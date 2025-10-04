CREATE OR REPLACE FUNCTION fn_create_payment (
    -- ✅ PARÁMETROS OBLIGATORIOS PRIMERO
    p_transaction_id VARCHAR(255),
    p_reference VARCHAR(255),
    p_amount_in_cents INTEGER,
    p_payment_method payment_method_enum,
    p_customer_email VARCHAR(255),
    p_cart_data JSONB,
    p_shipping_address JSONB,
    p_user_id INTEGER,
    
    -- ✅ PARÁMETROS OPCIONALES AL FINAL
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
    -- Validaciones específicas por método de pago
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

    -- Verificar duplicados
    IF p_transaction_id IS NOT NULL AND EXISTS(SELECT 1 FROM payments WHERE transaction_id = p_transaction_id) THEN
        RETURN QUERY SELECT 
            NULL::INTEGER, p_transaction_id, p_reference, NULL::VARCHAR(500),
            FALSE, 'Ya existe un payment con este transaction_id'::TEXT;
        RETURN;
    END IF;

    -- Insertar payment
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
    ) RETURNING id, checkout_url INTO v_payment_id, v_final_checkout_url;
    
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