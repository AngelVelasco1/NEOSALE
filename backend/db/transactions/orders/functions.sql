CREATE OR REPLACE PROCEDURE create_order_initial(p_total INT, p_paymentMethod orders_paymentmethod_enum, p_userId INT, p_couponId INT DEFAULT NULL, p_updatedBy INT)
    LANGUAGE plpgsql
    AS $$
    RETURNS INT AS $$
DECLARE
    new_order_id INT;
BEGIN
    -- Verificar que el usuario existe
    IF NOT EXISTS (SELECT 1 FROM USERS WHERE id = p_userId) THEN
        RAISE EXCEPTION 'El usuario con ID % no existe.', p_userId;
    END IF;

    -- Verificar que el cupón existe si se proporciona
    IF p_couponId IS NOT NULL AND NOT EXISTS (SELECT 1 FROM COUPONS WHERE id = p_couponId) THEN
        RAISE EXCEPTION 'El cupón con ID % no existe.', p_couponId;
    END IF;

    INSERT INTO ORDERS (
        status,
        total,
        paymentMethod,
        paymentStatus,
        transactionId,
        userId,
        couponId,
        updatedBy
    )
    VALUES (
        'Pending',  
        p_total,
        p_paymentMethod,
        FALSE,             
        '',                
        p_userId,
        p_couponId,
        p_updatedBy
    )
    RETURNING id INTO new_order_id;

    RETURN new_order_id;

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error al crear la orden: %', SQLERRM;
        RETURN NULL;
END;
$$ ;
