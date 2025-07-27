CREATE OR REPLACE PROCEDURE sp_createReview (
    p_rating INT, 
    p_comment TEXT, 
    p_userId INT, 
    p_productId INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF p_rating IS NULL THEN
        RAISE EXCEPTION 'La calificación es obligatoria' USING ERRCODE = 'not_null_violation';
    END IF;
    IF p_userId IS NULL OR p_productId IS NULL THEN
        RAISE EXCEPTION 'El usuario y el producto son obligatorios' USING ERRCODE = 'not_null_violation';
    END IF;
    INSERT INTO reviews(rating, comment, userId, productId) 
    VALUES (p_rating, p_comment, p_userId, p_productId);
EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE EXCEPTION 'Usuario o producto no existe';
    WHEN not_null_violation THEN
        RAISE EXCEPTION 'Campo obligatorio faltante al crear review: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error inesperado al crear review: %', SQLERRM;
END;
$$;

CREATE OR REPLACE PROCEDURE sp_updateReview (
    p_id INT,
    p_rating INT, 
    p_comment TEXT, 
    p_userId INT, 
    p_productId INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM reviews WHERE id = p_id) THEN
        RAISE EXCEPTION 'Review no encontrada' USING ERRCODE = 'no_data_found';
    END IF;
    UPDATE reviews 
    SET rating = p_rating, comment = p_comment, userId = p_userId, productId = p_productId 
    WHERE id = p_id;
EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE EXCEPTION 'Usuario o producto no existe';
    WHEN not_null_violation THEN
        RAISE EXCEPTION 'Campo obligatorio faltante al actualizar review: %', SQLERRM;
    WHEN no_data_found THEN
        RAISE EXCEPTION 'No se puede actualizar: review no encontrada';
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error inesperado al actualizar review: %', SQLERRM;
END;
$$;

CREATE OR REPLACE PROCEDURE sp_deleteReview (p_id INT)
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM reviews WHERE id = p_id) THEN
        RAISE EXCEPTION 'Review no encontrada' USING ERRCODE = 'no_data_found';
    END IF;
    DELETE FROM reviews WHERE id = p_id;
EXCEPTION
    WHEN no_data_found THEN
        RAISE EXCEPTION 'No se puede eliminar: review no encontrada';
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error inesperado al eliminar review: %', SQLERRM;
END;
$$;