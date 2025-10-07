


CREATE OR REPLACE FUNCTION fn_update_payment (
    p_transaction_id VARCHAR(255),
    p_new_status payment_status_enum,
    p_status_message VARCHAR(500) DEFAULT NULL,
    p_processor_response JSONB DEFAULT NULL,
    p_payment_method_details JSONB DEFAULT NULL
)
RETURNS TABLE(
    payment_id INTEGER,
    old_status payment_status_enum,
    new_status payment_status_enum,
    order_created BOOLEAN,
    order_id INTEGER,
    success BOOLEAN,
    message TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_payment_id INTEGER;
    v_old_status payment_status_enum;
    v_payment payments%ROWTYPE;
    v_address_id INTEGER;
    v_order_success BOOLEAN;
    v_new_order_id INTEGER := NULL;
    v_status_message TEXT;
BEGIN

    SELECT p.id, p.payment_status INTO v_payment_id, v_old_status
    FROM payments p
    WHERE p.transaction_id = p_transaction_id;

    IF v_payment_id IS NULL THEN
        RETURN QUERY SELECT 
            NULL::INTEGER, NULL::payment_status_enum, p_new_status,
            FALSE, NULL::INTEGER, FALSE, 'Payment no encontrado'::TEXT;
        RETURN;
    END IF;

    IF v_old_status = p_new_status THEN
        -- Si el estado no cambió, verificar si necesita crear orden para APPROVED o PENDING
        IF p_new_status IN ('APPROVED', 'PENDING') THEN
            IF NOT EXISTS(SELECT 1 FROM orders o WHERE o.payment_id = v_payment_id) THEN
                -- El payment está APPROVED/PENDING pero no tiene orden, crearla
                SELECT * INTO v_payment FROM payments WHERE id = v_payment_id;
                
                SELECT fa.address_id, fa.success, fa.message INTO v_address_id, v_order_success, v_status_message
                FROM fn_create_address_from_payment(v_payment_id) AS fa(address_id, success, message);
                
                IF v_address_id IS NOT NULL THEN
                    SELECT fo.order_id, fo.success 
                    INTO v_new_order_id, v_order_success
                    FROM fn_create_order(v_payment_id, v_address_id, NULL) AS fo(order_id, payment_id, total_amount, success, message);
                    
                    IF v_order_success THEN
                        RETURN QUERY SELECT 
                            v_payment_id, v_old_status, p_new_status,
                            TRUE, v_new_order_id, TRUE, 
                            ('Payment ya estaba ' || p_new_status::TEXT || ', orden #' || v_new_order_id || ' creada exitosamente')::TEXT;
                    ELSE
                        RETURN QUERY SELECT 
                            v_payment_id, v_old_status, p_new_status,
                            FALSE, NULL::INTEGER, TRUE, 
                            ('Payment ya estaba ' || p_new_status::TEXT || ' pero error creando orden')::TEXT;
                    END IF;
                ELSE
                    RETURN QUERY SELECT 
                        v_payment_id, v_old_status, p_new_status,
                        FALSE, NULL::INTEGER, TRUE, 
                        ('Payment ya estaba ' || p_new_status::TEXT || ' pero no se pudo crear dirección: ' || COALESCE(v_status_message, 'Error desconocido'))::TEXT;
                END IF;
            ELSE
                -- Payment APPROVED/PENDING y orden ya existe
                SELECT o.id INTO v_new_order_id FROM orders o WHERE o.payment_id = v_payment_id;
                RETURN QUERY SELECT 
                    v_payment_id, v_old_status, p_new_status,
                    TRUE, v_new_order_id, TRUE, 
                    'Payment ya está en el estado solicitado y orden ya existe'::TEXT;
            END IF;
        ELSE
            -- Estado no cambió y no es APPROVED ni PENDING
            RETURN QUERY SELECT 
                v_payment_id, v_old_status, p_new_status,
                FALSE, NULL::INTEGER, TRUE, 'Payment ya está en el estado solicitado'::TEXT;
        END IF;
        RETURN;
    END IF;

    UPDATE payments 
    SET 
        payment_status = p_new_status,
        status_message = COALESCE(p_status_message, status_message),
        processor_response = COALESCE(p_processor_response, processor_response),
        payment_method_details = COALESCE(p_payment_method_details, payment_method_details),
        approved_at = CASE 
            WHEN p_new_status = 'APPROVED' THEN NOW()
            ELSE approved_at 
        END,
        failed_at = CASE 
            WHEN p_new_status IN ('DECLINED', 'ERROR', 'VOIDED') THEN NOW()
            ELSE failed_at 
        END,
        updated_at = NOW()
    WHERE id = v_payment_id;

    IF p_new_status IN ('APPROVED') THEN
        IF NOT EXISTS(SELECT 1 FROM orders o WHERE o.payment_id = v_payment_id) THEN
            SELECT * INTO v_payment FROM payments WHERE id = v_payment_id;
            
            SELECT fa.address_id, fa.success, fa.message INTO v_address_id, v_order_success, v_status_message
            FROM fn_create_address_from_payment(v_payment_id) AS fa(address_id, success, message);
            
            IF v_address_id IS NOT NULL THEN
                SELECT fo.order_id, fo.success 
                INTO v_new_order_id, v_order_success
                FROM fn_create_order(v_payment_id, v_address_id, NULL) AS fo(order_id, payment_id, total_amount, success, message);
                
                IF v_order_success THEN
                    RETURN QUERY SELECT 
                        v_payment_id, v_old_status, p_new_status,
                        TRUE, v_new_order_id, TRUE, 
                        ('Payment actualizado a ' || p_new_status::TEXT || ' y orden #' || v_new_order_id || ' creada exitosamente')::TEXT;
                ELSE
                    RETURN QUERY SELECT 
                        v_payment_id, v_old_status, p_new_status,
                        FALSE, NULL::INTEGER, TRUE, 
                        ('Payment actualizado a ' || p_new_status::TEXT || ' pero error creando orden')::TEXT;
                END IF;
            ELSE
                RETURN QUERY SELECT 
                    v_payment_id, v_old_status, p_new_status,
                    FALSE, NULL::INTEGER, TRUE, 
                    ('Payment actualizado a ' || p_new_status::TEXT || ' pero no se pudo crear dirección: ' || COALESCE(v_status_message, 'Error desconocido'))::TEXT;
            END IF;
        ELSE
            SELECT o.id INTO v_new_order_id FROM orders o WHERE o.payment_id = v_payment_id;
            RETURN QUERY SELECT 
                v_payment_id, v_old_status, p_new_status,
                TRUE, v_new_order_id, TRUE, 
                ('Payment actualizado a ' || p_new_status::TEXT || ', orden ya existía')::TEXT;
        END IF;
    ELSE
        RETURN QUERY SELECT 
            v_payment_id, v_old_status, p_new_status,
            FALSE, NULL::INTEGER, TRUE, 
            ('Payment actualizado a estado: ' || p_new_status::TEXT)::TEXT;
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        RETURN QUERY SELECT 
            v_payment_id, v_old_status, p_new_status,
            FALSE, NULL::INTEGER, FALSE, 
            ('Error actualizando payment: ' || SQLERRM)::TEXT;
END;
$$;

CREATE OR REPLACE FUNCTION fn_create_address_from_payment(
    p_payment_id INTEGER
)
RETURNS TABLE(
    address_id INTEGER,
    success BOOLEAN,
    message TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_payment payments%ROWTYPE;
    v_address_id INTEGER;
    v_shipping_data JSONB;
BEGIN
    SELECT * INTO v_payment FROM payments WHERE id = p_payment_id;
    
    IF v_payment.id IS NULL THEN
        RETURN QUERY SELECT NULL::INTEGER, FALSE, 'Payment no encontrado'::TEXT;
        RETURN;
    END IF;

    v_shipping_data := v_payment.shipping_address;

    -- Mapear los campos del frontend a la estructura real de la tabla addresses
    SELECT id INTO v_address_id
    FROM addresses 
    WHERE user_id = v_payment.user_id
    AND address = COALESCE(
        v_shipping_data->>'street', 
        v_shipping_data->>'line1', 
        v_shipping_data->>'address_line_1', 
        'Sin dirección'
    )
    AND city = COALESCE(v_shipping_data->>'city', 'Sin ciudad')
    LIMIT 1;

    IF v_address_id IS NULL THEN
        INSERT INTO addresses (
            user_id,
            address,
            city,
            department,
            country,
            is_default,
            created_at
        ) VALUES (
            v_payment.user_id,
            COALESCE(
                v_shipping_data->>'street', 
                v_shipping_data->>'line1', 
                v_shipping_data->>'address_line_1', 
                'Sin dirección'
            ),
            COALESCE(v_shipping_data->>'city', 'Sin ciudad'),
            COALESCE(
                v_shipping_data->>'state', 
                v_shipping_data->>'region', 
                'Sin departamento'
            ),
            COALESCE(
                v_shipping_data->>'country', 
                CASE WHEN v_shipping_data->>'country' = 'CO' THEN 'Colombia' ELSE 'Colombia' END
            ),
            FALSE,
            NOW()
        ) RETURNING id INTO v_address_id;
    END IF;

    RETURN QUERY SELECT v_address_id, TRUE, 'Dirección creada/encontrada exitosamente'::TEXT;

EXCEPTION
    WHEN OTHERS THEN
        RETURN QUERY SELECT NULL::INTEGER, FALSE, ('Error creando dirección: ' || SQLERRM)::TEXT;
END;
$$;




select * from payments;