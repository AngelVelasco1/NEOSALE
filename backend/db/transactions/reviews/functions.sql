CREATE OR REPLACE FUNCTION sp_create_review (
    p_rating INT, 
    p_comment TEXT, 
    p_user_id INT, 
    p_product_id INT,
    p_order_id INT DEFAULT NULL
)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
    v_review_id INT;
    v_existing_review INT;
BEGIN
    -- Validaciones básicas
    IF p_rating IS NULL THEN
        RAISE EXCEPTION 'La calificación es obligatoria' USING ERRCODE = 'not_null_violation';
    END IF;
    
    IF p_user_id IS NULL OR p_product_id IS NULL THEN
        RAISE EXCEPTION 'El usuario y el producto son obligatorios' USING ERRCODE = 'not_null_violation';
    END IF;
    
    -- Validar rango de rating
    IF p_rating < 1 OR p_rating > 5 THEN
        RAISE EXCEPTION 'La calificación debe estar entre 1 y 5' USING ERRCODE = 'check_violation';
    END IF;
    
    -- Verificar que el usuario existe y está activo
    IF NOT EXISTS (SELECT 1 FROM "User" WHERE id = p_user_id AND active = true) THEN
        RAISE EXCEPTION 'Usuario no existe o está inactivo' USING ERRCODE = 'foreign_key_violation';
    END IF;
    
    -- Verificar que el producto existe y está activo
    IF NOT EXISTS (SELECT 1 FROM products WHERE id = p_product_id AND active = true) THEN
        RAISE EXCEPTION 'Producto no existe o está inactivo' USING ERRCODE = 'foreign_key_violation';
    END IF;
    
    -- Si se proporciona order_id, verificar que la orden existe y pertenece al usuario
    IF p_order_id IS NOT NULL THEN
        -- Verificar que la orden existe, pertenece al usuario y está entregada
        IF NOT EXISTS (
            SELECT 1 FROM orders 
            WHERE id = p_order_id 
            AND user_id = p_user_id 
            AND status = 'delivered'
        ) THEN
            RAISE EXCEPTION 'La orden no existe, no te pertenece o aún no ha sido entregada' USING ERRCODE = 'foreign_key_violation';
        END IF;
        
        -- Verificar que el producto está en esa orden
        IF NOT EXISTS (
            SELECT 1 FROM order_items 
            WHERE order_id = p_order_id 
            AND product_id = p_product_id
        ) THEN
            RAISE EXCEPTION 'El producto no está en esta orden' USING ERRCODE = 'foreign_key_violation';
        END IF;
        
        -- Verificar que el usuario no haya hecho ya una review para este producto en esta orden
        SELECT id INTO v_existing_review 
        FROM reviews 
        WHERE user_id = p_user_id 
        AND product_id = p_product_id 
        AND order_id = p_order_id;
        
        IF v_existing_review IS NOT NULL THEN
            RAISE EXCEPTION 'Ya has calificado este producto en esta orden' USING ERRCODE = 'unique_violation';
        END IF;
    ELSE
        -- Si no hay order_id, verificar que no exista ninguna review del usuario para este producto
        SELECT id INTO v_existing_review 
        FROM reviews 
        WHERE user_id = p_user_id 
        AND product_id = p_product_id 
        AND order_id IS NULL;
        
        IF v_existing_review IS NOT NULL THEN
            RAISE EXCEPTION 'Ya has calificado este producto' USING ERRCODE = 'unique_violation';
        END IF;
    END IF;
    
    -- Insertar la review con order_id
    INSERT INTO reviews(rating, comment, user_id, product_id, order_id) 
    VALUES (p_rating, p_comment, p_user_id, p_product_id, p_order_id)
    RETURNING id INTO v_review_id;
    
    RETURN v_review_id;
EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE;
    WHEN unique_violation THEN
        RAISE;
    WHEN check_violation THEN
        RAISE;
    WHEN not_null_violation THEN
        RAISE EXCEPTION 'Campo obligatorio faltante al crear review: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error inesperado al crear review: %', SQLERRM;
END;
$$;
   