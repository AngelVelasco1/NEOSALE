CREATE OR REPLACE FUNCTION fn_create_order(
    p_payment_id INTEGER,
    p_shipping_address_id INTEGER,
    p_coupon_id INTEGER DEFAULT NULL
)
RETURNS TABLE(
    order_id INTEGER,
    payment_id INTEGER,
    total_amount INTEGER,
    success BOOLEAN,
    message TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_payment payments%ROWTYPE;
    v_new_order_id INTEGER;
    v_cart_item RECORD;
    v_subtotal INTEGER := 0;
    v_available_stock INTEGER;
    v_items_result RECORD;
    v_cart_items_count INTEGER := 0;
BEGIN
    SELECT * INTO v_payment 
    FROM payments 
    WHERE id = p_payment_id;
    
    IF v_payment.id IS NULL THEN
        RETURN QUERY SELECT 
            NULL::INTEGER, p_payment_id, 0,
            FALSE, 'Payment no encontrado'::TEXT;
        RETURN;
    END IF;

    -- VERIFICAR QUE CART_DATA NO SEA NULL
    IF v_payment.cart_data IS NULL THEN
        RETURN QUERY SELECT 
            NULL::INTEGER, p_payment_id, 0,
            FALSE, 'Cart data es NULL en el payment'::TEXT;
        RETURN;
    END IF;

    -- VERIFICAR QUE CART_DATA SEA UN ARRAY
    IF jsonb_typeof(v_payment.cart_data) != 'array' THEN
        RETURN QUERY SELECT 
            NULL::INTEGER, p_payment_id, 0,
            FALSE, ('Cart data no es un array, es: ' || jsonb_typeof(v_payment.cart_data))::TEXT;
        RETURN;
    END IF;

    -- Verificar que el usuario existe
    IF NOT EXISTS(SELECT 1 FROM "User" WHERE id = v_payment.user_id) THEN
        RETURN QUERY SELECT 
            NULL::INTEGER, p_payment_id, 0,
            FALSE, 'Usuario no encontrado'::TEXT;
        RETURN;
    END IF;

    -- Verificar shipping address
    IF NOT EXISTS(SELECT 1 FROM addresses WHERE id = p_shipping_address_id) THEN
        RETURN QUERY SELECT 
            NULL::INTEGER, p_payment_id, 0,
            FALSE, 'Dirección de envío no encontrada'::TEXT;
        RETURN;
    END IF;

    -- Validar cupón si se proporciona
    IF p_coupon_id IS NOT NULL THEN
        IF NOT EXISTS(SELECT 1 FROM coupons WHERE id = p_coupon_id AND is_active = TRUE) THEN
            RETURN QUERY SELECT 
                NULL::INTEGER, p_payment_id, 0,
                FALSE, 'Cupón no válido o inactivo'::TEXT;
            RETURN;
        END IF;
    END IF;

    FOR v_cart_item IN 
        SELECT 
            (item->>'product_id')::INTEGER as product_id,
            (item->>'quantity')::INTEGER as quantity,
            (item->>'price')::INTEGER as price,
            COALESCE(item->>'color_code', '') as color_code,
            COALESCE(item->>'size', '') as size
        FROM jsonb_array_elements(v_payment.cart_data) as item
    LOOP
        v_cart_items_count := v_cart_items_count + 1;
        
        IF NOT EXISTS(SELECT 1 FROM products WHERE id = v_cart_item.product_id) THEN
            RETURN QUERY SELECT 
                NULL::INTEGER, p_payment_id, 0,
                FALSE, ('Producto con ID ' || v_cart_item.product_id || ' no encontrado')::TEXT;
            RETURN;
        END IF;

        -- Verificar stock
        v_available_stock := NULL;
        
        -- Intentar obtener stock de product_variants primero
        IF v_cart_item.color_code != '' AND v_cart_item.size != '' THEN
            SELECT stock INTO v_available_stock 
            FROM product_variants 
            WHERE product_id = v_cart_item.product_id 
            AND color_code = v_cart_item.color_code 
            AND size = v_cart_item.size;
        END IF;
        
        -- Si no hay variants o no se encontró, usar products
        IF v_available_stock IS NULL THEN
            SELECT stock INTO v_available_stock 
            FROM products 
            WHERE id = v_cart_item.product_id;
        END IF;

        -- Validar stock disponible
        IF v_available_stock IS NULL OR v_available_stock < v_cart_item.quantity THEN
            RETURN QUERY SELECT 
                NULL::INTEGER, p_payment_id, 0,
                FALSE, ('Stock insuficiente para producto ID ' || v_cart_item.product_id || 
                       '. Disponible: ' || COALESCE(v_available_stock, 0) || 
                       ', Solicitado: ' || v_cart_item.quantity)::TEXT;
            RETURN;
        END IF;

        -- Solo calcular subtotal para verificación
        v_subtotal := v_subtotal + (v_cart_item.price * v_cart_item.quantity);
    END LOOP;

    -- VERIFICAR QUE SE PROCESARON ITEMS
    IF v_cart_items_count = 0 THEN
        RETURN QUERY SELECT 
            NULL::INTEGER, p_payment_id, 0,
            FALSE, ('No se encontraron items en cart_data. Longitud del array: ' || jsonb_array_length(v_payment.cart_data))::TEXT;
        RETURN;
    END IF;

    -- VERIFICAR QUE EL SUBTOTAL NO SEA 0
    IF v_subtotal = 0 THEN
        RETURN QUERY SELECT 
            NULL::INTEGER, p_payment_id, 0,
            FALSE, ('Subtotal es 0 después de procesar ' || v_cart_items_count || ' items')::TEXT;
        RETURN;
    END IF;

    INSERT INTO orders (
        payment_id,
        status,
        subtotal,
        discount,
        shipping_cost,
        taxes,
        total,
        shipping_address_id,
        coupon_id,
        coupon_discount,
        user_id,
        updated_by,
        created_at,
        updated_at
    ) VALUES (
        p_payment_id,
        'pending'::orders_status_enum,
        v_subtotal,
        0,
        v_payment.amount_in_cents - v_subtotal - ROUND(v_subtotal * 0.19),
        ROUND(v_subtotal * 0.19),
        v_payment.amount_in_cents,
        p_shipping_address_id,
        p_coupon_id,
        0,
        v_payment.user_id,
        v_payment.user_id,
        NOW(),
        NOW()
    ) RETURNING id INTO v_new_order_id;

    SELECT 
        result.items_created, 
        result.success, 
        result.message
    INTO v_items_result
    FROM fn_create_order_items(v_new_order_id, v_payment.cart_data) AS result;
    
    IF NOT v_items_result.success THEN
        RETURN QUERY SELECT 
            v_new_order_id, p_payment_id, v_payment.amount_in_cents,
            FALSE, ('Error creando order items: ' || v_items_result.message)::TEXT;
        RETURN;
    END IF;

    FOR v_cart_item IN 
        SELECT 
            (item->>'product_id')::INTEGER as product_id,
            (item->>'quantity')::INTEGER as quantity,
            COALESCE(item->>'color_code', '') as color_code,
            COALESCE(item->>'size', '') as size
        FROM jsonb_array_elements(v_payment.cart_data) as item
    LOOP
        -- Intentar actualizar product_variants primero
        IF v_cart_item.color_code != '' AND v_cart_item.size != '' THEN
            UPDATE product_variants 
            SET stock = stock - v_cart_item.quantity
            WHERE product_id = v_cart_item.product_id 
            AND color_code = v_cart_item.color_code 
            AND size = v_cart_item.size;
            
            IF NOT FOUND THEN
                UPDATE products 
                SET stock = stock - v_cart_item.quantity
                WHERE id = v_cart_item.product_id;
            END IF;
        ELSE
            UPDATE products 
            SET stock = stock - v_cart_item.quantity
            WHERE id = v_cart_item.product_id;
        END IF;
    END LOOP;

    -- Limpiar carrito del usuario si existe
    DELETE FROM cart_items 
    WHERE cart_id IN (
        SELECT id FROM cart WHERE user_id = v_payment.user_id
    );

    -- Retornar resultado exitoso
    RETURN QUERY SELECT 
        v_new_order_id,
        p_payment_id,
        v_payment.amount_in_cents,
        TRUE,
        ('Orden creada exitosamente con ' || v_items_result.items_created || ' productos. Total: ' || v_payment.amount_in_cents || ' centavos')::TEXT;

EXCEPTION
    WHEN foreign_key_violation THEN
        RETURN QUERY SELECT 
            NULL::INTEGER, p_payment_id, 0,
            FALSE, ('Error de integridad referencial: ' || SQLERRM)::TEXT;
    WHEN check_violation THEN
        RETURN QUERY SELECT 
            NULL::INTEGER, p_payment_id, 0,
            FALSE, ('Error de validación: ' || SQLERRM)::TEXT;
    WHEN OTHERS THEN
        RETURN QUERY SELECT 
            NULL::INTEGER, p_payment_id, 0,
            FALSE, ('Error inesperado: ' || SQLERRM)::TEXT;
END;
$$;

CREATE OR REPLACE FUNCTION fn_create_order_items(
    p_order_id INTEGER,
    p_cart_data JSONB
)
RETURNS TABLE(
    items_created INTEGER,
    success BOOLEAN,
    message TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_cart_item RECORD;
    v_items_count INTEGER := 0;
BEGIN
    -- Crear order_items desde cart_data
    FOR v_cart_item IN 
        SELECT 
            (item->>'product_id')::INTEGER as product_id,
            (item->>'quantity')::INTEGER as quantity,
            (item->>'price')::INTEGER as price,
            COALESCE(item->>'color_code', '') as color_code,
            COALESCE(item->>'size', '') as size
        FROM jsonb_array_elements(p_cart_data) as item
    LOOP
        INSERT INTO order_items (
            order_id,
            product_id,
            quantity,
            price,
            color_code,
            size,
            subtotal,
            created_at
        ) VALUES (
            p_order_id,
            v_cart_item.product_id,
            v_cart_item.quantity,
            v_cart_item.price,
            v_cart_item.color_code,
            v_cart_item.size,
            v_cart_item.price * v_cart_item.quantity,
            NOW()
        );
        
        v_items_count := v_items_count + 1;
    END LOOP;
    
    RETURN QUERY SELECT v_items_count, TRUE, 'Order items creados correctamente'::TEXT;

EXCEPTION
    WHEN OTHERS THEN
        RETURN QUERY SELECT 0, FALSE, ('Error creando order items: ' || SQLERRM)::TEXT;
END;
$$;

select * from orders;