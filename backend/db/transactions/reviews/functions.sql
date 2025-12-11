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
    
    -- Verificar que el usuario no haya hecho ya una review para este producto en esta orden (si se proporciona order_id)
    IF p_order_id IS NOT NULL THEN
        SELECT id INTO v_existing_review 
        FROM reviews 
        WHERE user_id = p_user_id AND product_id = p_product_id AND order_id = p_order_id;
        
        IF v_existing_review IS NOT NULL THEN
            RAISE EXCEPTION 'El usuario ya ha calificado este producto en esta orden' USING ERRCODE = 'unique_violation';
        END IF;
    ELSE
        -- Si no hay order_id, verificar que no exista ninguna review del usuario para este producto
        SELECT id INTO v_existing_review 
        FROM reviews 
        WHERE user_id = p_user_id AND product_id = p_product_id;
        
        IF v_existing_review IS NOT NULL THEN
            RAISE EXCEPTION 'El usuario ya ha calificado este producto' USING ERRCODE = 'unique_violation';
        END IF;
    END IF;
    
    -- Verificar que el usuario existe y está activo
    IF NOT EXISTS (SELECT 1 FROM "User" WHERE id = p_user_id AND active = true) THEN
        RAISE EXCEPTION 'Usuario no existe o está inactivo' USING ERRCODE = 'foreign_key_violation';
    END IF;
    
    -- Verificar que el producto existe y está activo
    IF NOT EXISTS (SELECT 1 FROM products WHERE id = p_product_id AND active = true) THEN
        RAISE EXCEPTION 'Producto no existe o está inactivo' USING ERRCODE = 'foreign_key_violation';
    END IF;
    
    -- Insertar la review con order_id
    INSERT INTO reviews(rating, comment, user_id, product_id, order_id) 
    VALUES (p_rating, p_comment, p_user_id, p_product_id, p_order_id)
    RETURNING id INTO v_review_id;
    
    RETURN v_review_id;
EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE EXCEPTION 'Usuario o producto no existe o está inactivo';
    WHEN unique_violation THEN
        RAISE EXCEPTION 'El usuario ya ha calificado este producto';
    WHEN check_violation THEN
        RAISE EXCEPTION 'La calificación debe estar entre 1 y 5';
    WHEN not_null_violation THEN
        RAISE EXCEPTION 'Campo obligatorio faltante al crear review: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error inesperado al crear review: %', SQLERRM;
END;
$$;

CREATE OR REPLACE PROCEDURE sp_update_review (
    p_id INT,
    p_rating INT, 
    p_comment TEXT, 
    p_user_id INT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_review_user_id INT;
BEGIN
    -- Verificar que la review existe
    SELECT user_id INTO v_review_user_id 
    FROM reviews 
    WHERE id = p_id;
    
    IF v_review_user_id IS NULL THEN
        RAISE EXCEPTION 'Review no encontrada' USING ERRCODE = 'no_data_found';
    END IF;
    
    -- Verificar que el usuario es el propietario de la review
    IF v_review_user_id != p_user_id THEN
        RAISE EXCEPTION 'No tienes permisos para modificar esta review' USING ERRCODE = 'insufficient_privilege';
    END IF;
    
    -- Validar rango de rating si se proporciona
    IF p_rating IS NOT NULL AND (p_rating < 1 OR p_rating > 5) THEN
        RAISE EXCEPTION 'La calificación debe estar entre 1 y 5' USING ERRCODE = 'check_violation';
    END IF;
    
    -- Actualizar solo los campos proporcionados
    UPDATE reviews 
    SET 
        rating = COALESCE(p_rating, rating),
        comment = CASE WHEN p_comment IS NOT NULL THEN p_comment ELSE comment END,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_id;
    
EXCEPTION
    WHEN no_data_found THEN
        RAISE EXCEPTION 'Review no encontrada';
    WHEN insufficient_privilege THEN
        RAISE EXCEPTION 'No tienes permisos para modificar esta review';
    WHEN check_violation THEN
        RAISE EXCEPTION 'La calificación debe estar entre 1 y 5';
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error inesperado al actualizar review: %', SQLERRM;
END;
$$;

CREATE OR REPLACE PROCEDURE sp_delete_review (
    p_id INT,
    p_user_id INT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_review_user_id INT;
BEGIN
    -- Verificar que la review existe y obtener el propietario
    SELECT user_id INTO v_review_user_id 
    FROM reviews 
    WHERE id = p_id;
    
    IF v_review_user_id IS NULL THEN
        RAISE EXCEPTION 'Review no encontrada' USING ERRCODE = 'no_data_found';
    END IF;
    
    -- Verificar que el usuario es el propietario de la review
    IF v_review_user_id != p_user_id THEN
        RAISE EXCEPTION 'No tienes permisos para eliminar esta review' USING ERRCODE = 'insufficient_privilege';
    END IF;
    
    -- Eliminar la review (las imágenes se eliminan en cascada)
    DELETE FROM reviews WHERE id = p_id;
    
EXCEPTION
    WHEN no_data_found THEN
        RAISE EXCEPTION 'Review no encontrada';
    WHEN insufficient_privilege THEN
        RAISE EXCEPTION 'No tienes permisos para eliminar esta review';
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error inesperado al eliminar review: %', SQLERRM;
END;
$$;

-- Procedure para agregar imágenes a una review
CREATE OR REPLACE PROCEDURE sp_add_review_images (
    p_review_id INT,
    p_user_id INT,
    p_image_urls TEXT[]
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_review_user_id INT;
    v_image_url TEXT;
    v_current_images_count INT;
BEGIN
    -- Verificar que la review existe y obtener el propietario
    SELECT user_id INTO v_review_user_id 
    FROM reviews 
    WHERE id = p_review_id;
    
    IF v_review_user_id IS NULL THEN
        RAISE EXCEPTION 'Review no encontrada' USING ERRCODE = 'no_data_found';
    END IF;
    
    -- Verificar que el usuario es el propietario de la review
    IF v_review_user_id != p_user_id THEN
        RAISE EXCEPTION 'No tienes permisos para modificar esta review' USING ERRCODE = 'insufficient_privilege';
    END IF;
    
    -- Verificar límite de imágenes (máximo 5 por review)
    SELECT COUNT(*) INTO v_current_images_count 
    FROM review_images 
    WHERE review_id = p_review_id;
    
    IF v_current_images_count + array_length(p_image_urls, 1) > 5 THEN
        RAISE EXCEPTION 'No se pueden agregar más de 5 imágenes por review' USING ERRCODE = 'check_violation';
    END IF;
    
    -- Insertar las imágenes
    FOREACH v_image_url IN ARRAY p_image_urls
    LOOP
        IF v_image_url IS NOT NULL AND LENGTH(TRIM(v_image_url)) > 0 THEN
            INSERT INTO review_images (review_id, image_url)
            VALUES (p_review_id, TRIM(v_image_url));
        END IF;
    END LOOP;
    
EXCEPTION
    WHEN no_data_found THEN
        RAISE EXCEPTION 'Review no encontrada';
    WHEN insufficient_privilege THEN
        RAISE EXCEPTION 'No tienes permisos para modificar esta review';
    WHEN check_violation THEN
        RAISE EXCEPTION 'No se pueden agregar más de 5 imágenes por review';
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error inesperado al agregar imágenes: %', SQLERRM;
END;
$$;

-- Procedure para eliminar una imagen específica de una review
CREATE OR REPLACE PROCEDURE sp_delete_review_image (
    p_image_id INT,
    p_user_id INT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_review_user_id INT;
    v_review_id INT;
BEGIN
    -- Obtener la review asociada a la imagen
    SELECT r.user_id, ri.review_id 
    INTO v_review_user_id, v_review_id
    FROM review_images ri
    JOIN reviews r ON ri.review_id = r.id
    WHERE ri.id = p_image_id;
    
    IF v_review_user_id IS NULL THEN
        RAISE EXCEPTION 'Imagen de review no encontrada' USING ERRCODE = 'no_data_found';
    END IF;
    
    -- Verificar que el usuario es el propietario de la review
    IF v_review_user_id != p_user_id THEN
        RAISE EXCEPTION 'No tienes permisos para eliminar esta imagen' USING ERRCODE = 'insufficient_privilege';
    END IF;
    
    -- Eliminar la imagen
    DELETE FROM review_images WHERE id = p_image_id;
    
EXCEPTION
    WHEN no_data_found THEN
        RAISE EXCEPTION 'Imagen de review no encontrada';
    WHEN insufficient_privilege THEN
        RAISE EXCEPTION 'No tienes permisos para eliminar esta imagen';
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error inesperado al eliminar imagen: %', SQLERRM;
END;
$$;