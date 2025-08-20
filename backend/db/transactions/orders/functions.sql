CREATE OR REPLACE FUNCTION fn_create_order(
    p_total NUMERIC,
    p_payment_method orders_paymentmethod_enum,
    p_user_id INT,
    p_coupon_id INT,
    p_updated_by INT
)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
    v_cart_id INT;
    new_order_id INT;
    rec RECORD;
BEGIN
    -- Validaciones generales
    IF p_total IS NULL OR p_total < 0 THEN
        RAISE EXCEPTION 'El total de la orden es obligatorio y debe ser mayor o igual a 0' USING ERRCODE = 'not_null_violation';
    END IF;

    IF p_user_id IS NULL OR NOT EXISTS (SELECT 1 FROM users WHERE id = p_user_id) THEN
        RAISE EXCEPTION 'El usuario con ID % no existe.', p_user_id USING ERRCODE = 'foreign_key_violation';
    END IF;

    IF p_coupon_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM coupons WHERE id = p_coupon_id) THEN
        RAISE EXCEPTION 'El cupón con ID % no existe.', p_coupon_id USING ERRCODE = 'foreign_key_violation';
    END IF;

    -- Buscar carrito del usuario
    SELECT id INTO v_cart_id FROM cart WHERE user_id = p_user_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'El carrito no existe.' USING ERRCODE = 'foreign_key_violation';
    END IF;

    -- Validar que el carrito tenga productos
    IF NOT EXISTS (SELECT 1 FROM cart_items WHERE cart_id = v_cart_id) THEN
        RAISE EXCEPTION 'El carrito está vacío.' USING ERRCODE = 'not_null_violation';
    END IF;

    -- Verificar stock de cada producto
    FOR rec IN
        SELECT ci.product_id, ci.quantity, p.stock, p.name
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.id
        WHERE ci.cart_id = v_cart_id
    LOOP
        IF rec.quantity > rec.stock THEN
            RAISE EXCEPTION 'Stock insuficiente para el producto "%". Disponible: %, Solicitado: %', rec.name, rec.stock, rec.quantity;
        END IF;
    END LOOP;

    INSERT INTO orders (
        status,
        total,
        payment_method,
        payment_status,
        transaction_id,
        user_id,
        coupon_id,
        updated_by
    )
    VALUES (
        'Pending',
        p_total,
        p_payment_method,
        FALSE,
        '',
        p_user_id,
        p_coupon_id,
        p_updated_by
    )
    RETURNING id INTO new_order_id;

    -- Añadir productos del carrito a order_items y descontar stock
    FOR rec IN
        SELECT * FROM cart_items WHERE cart_id = v_cart_id
    LOOP
        INSERT INTO order_items (price, quantity, subtotal, product_id, order_id, created_at)
        VALUES (
            rec.unit_price,
            rec.quantity,
            rec.unit_price * rec.quantity,
            rec.product_id,
            new_order_id,
            NOW()
        );

        UPDATE product_variants
        SET stock = stock - rec.quantity
        WHERE product_id = rec.product_id;
    END LOOP;

    DELETE FROM cart_items WHERE cart_id = v_cart_id;

    RETURN new_order_id;

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE EXCEPTION 'Error de integridad referencial al crear la orden: %', SQLERRM;
    WHEN not_null_violation THEN
        RAISE EXCEPTION 'Campo obligatorio faltante al crear la orden: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error inesperado al crear la orden: %', SQLERRM;
END;
$$;
