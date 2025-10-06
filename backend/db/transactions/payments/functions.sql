CREATE OR REPLACE FUNCTION fn_create_payment (
    p_transaction_id VARCHAR(255),
    p_reference VARCHAR(255),
    p_amount_in_cents INTEGER,
    p_payment_method payment_method_enum,
    p_customer_email VARCHAR(255),
    p_cart_data JSONB,
    p_shipping_address JSONB,
    p_user_id INTEGER,
    p_currency VARCHAR(3) DEFAULT 'COP',
    p_payment_method_details JSONB DEFAULT '{}',
    p_card_token VARCHAR(255) DEFAULT NULL,
    p_acceptance_token TEXT DEFAULT NULL,
    p_acceptance_token_auth TEXT DEFAULT NULL,
    p_signature_used VARCHAR(255) DEFAULT NULL,
    p_redirect_url VARCHAR(500) DEFAULT NULL,
    p_checkout_url VARCHAR(500) DEFAULT NULL,
    p_customer_phone VARCHAR(20) DEFAULT NULL,
    p_customer_document_type VARCHAR(10) DEFAULT NULL,
    p_customer_document_number VARCHAR(20) DEFAULT NULL,
    p_processor_response JSONB DEFAULT '{}'
)
RETURNS TABLE(
    payment_id INTEGER,
    transaction_id VARCHAR(255),
    reference VARCHAR(255),
    checkout_url VARCHAR(500),
    success BOOLEAN,
    message TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_payment_id INTEGER;
    v_final_checkout_url VARCHAR(500);
BEGIN
    CASE p_payment_method
        WHEN 'CARD' THEN
            IF p_acceptance_token IS NULL OR p_acceptance_token_auth IS NULL THEN
                RETURN QUERY SELECT 
                    NULL::INTEGER, p_transaction_id, p_reference, NULL::VARCHAR(500),
                    FALSE, 'Para pagos con tarjeta se requieren acceptance_token y acceptance_token_auth'::TEXT;
                RETURN;
            END IF;
            
        WHEN 'PSE' THEN
            IF p_customer_document_type IS NULL OR p_customer_document_number IS NULL THEN
                RETURN QUERY SELECT 
                    NULL::INTEGER, p_transaction_id, p_reference, NULL::VARCHAR(500),
                    FALSE, 'Para PSE se requiere documento de identidad'::TEXT;
                RETURN;
            END IF;
            
        WHEN 'NEQUI' THEN
            IF p_customer_phone IS NULL THEN
                RETURN QUERY SELECT 
                    NULL::INTEGER, p_transaction_id, p_reference, NULL::VARCHAR(500),
                    FALSE, 'Para Nequi se requiere número de teléfono'::TEXT;
                RETURN;
            END IF;
            
        WHEN 'BANCOLOMBIA', 'BANCOLOMBIA_TRANSFER' THEN
            IF p_customer_document_type IS NULL OR p_customer_document_number IS NULL THEN
                RETURN QUERY SELECT 
                    NULL::INTEGER, p_transaction_id, p_reference, NULL::VARCHAR(500),
                    FALSE, 'Para Bancolombia se requiere documento de identidad'::TEXT;
                RETURN;
            END IF;
    END CASE;

    IF p_transaction_id IS NOT NULL AND EXISTS(SELECT 1 FROM payments p WHERE p.transaction_id = p_transaction_id) THEN
        RETURN QUERY SELECT 
            NULL::INTEGER, p_transaction_id, p_reference, NULL::VARCHAR(500),
            FALSE, 'Ya existe un payment con este transaction_id'::TEXT;
        RETURN;
    END IF;

    INSERT INTO payments (
        transaction_id,
        reference,
        amount_in_cents,
        currency,
        payment_status,
        payment_method,
        payment_method_details,
        card_token,
        acceptance_token,
        acceptance_token_auth,
        signature_used,
        redirect_url,
        checkout_url,
        customer_email,
        customer_phone,
        customer_document_type,
        customer_document_number,
        cart_data,
        shipping_address,
        user_id,
        processor_response,
        created_at,
        updated_at
    ) VALUES (
        p_transaction_id,
        p_reference,
        p_amount_in_cents,
        p_currency,
        'PENDING'::payment_status_enum,
        p_payment_method,
        p_payment_method_details,
        p_card_token,
        p_acceptance_token,
        p_acceptance_token_auth,
        p_signature_used,
        p_redirect_url,
        p_checkout_url,
        p_customer_email,
        p_customer_phone,
        p_customer_document_type,
        p_customer_document_number,
        p_cart_data,
        p_shipping_address,
        p_user_id,
        p_processor_response,
        NOW(),
        NOW()
    ) RETURNING payments.id, payments.checkout_url INTO v_payment_id, v_final_checkout_url;
    
    RETURN QUERY SELECT 
        v_payment_id,
        p_transaction_id,
        p_reference,
        v_final_checkout_url,
        TRUE,
        'Payment creado exitosamente'::TEXT;
        
EXCEPTION
    WHEN OTHERS THEN
        RETURN QUERY SELECT 
            NULL::INTEGER,
            p_transaction_id,
            p_reference,
            NULL::VARCHAR(500),
            FALSE,
            ('Error creando payment: ' || SQLERRM)::TEXT;
END;
$$;

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