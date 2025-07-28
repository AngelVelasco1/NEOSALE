CREATE OR REPLACE FUNCTION sp_create_address(
    p_address TEXT, 
    p_country TEXT, 
    p_city TEXT, 
    p_department TEXT, 
    p_user_id INT,
    OUT p_new_id INT
) 
LANGUAGE plpgsql 
AS $$ 
BEGIN 
    IF p_user_id IS NULL THEN
        RAISE EXCEPTION 'El ID de usuario es obligatorio' USING ERRCODE = 'not_null_violation';
    END IF;

    INSERT INTO addresses (address, country, city, department, user_id) 
    VALUES (p_address, p_country, p_city, p_department, p_user_id)
    RETURNING id INTO p_new_id;

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE EXCEPTION 'El usuario no existe';
    WHEN not_null_violation THEN
        RAISE EXCEPTION 'Campo obligatorio faltante al crear dirección: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error inesperado al crear dirección: %', SQLERRM;
END; 
$$;

CREATE OR REPLACE PROCEDURE sp_update_address(
    p_id INT,
    p_address TEXT, 
    p_country TEXT, 
    p_city TEXT, 
    p_department TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM addresses WHERE id = p_id) THEN
        RAISE EXCEPTION 'Dirección no encontrada' USING ERRCODE = 'no_data_found';
    END IF;

    UPDATE addresses SET
        address = COALESCE(p_address, address),
        country = COALESCE(p_country, country),
        city = COALESCE(p_city, city),
        department = COALESCE(p_department, department)
    WHERE id = p_id;

EXCEPTION
    WHEN not_null_violation THEN
        RAISE EXCEPTION 'Campo obligatorio faltante al actualizar dirección: %', SQLERRM;
    WHEN no_data_found THEN
        RAISE EXCEPTION 'No se puede actualizar: dirección no encontrada';
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error inesperado al actualizar dirección: %', SQLERRM;
END;
$$;

CREATE OR REPLACE PROCEDURE sp_delete_address(p_id INT)
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM addresses WHERE id = p_id) THEN
        RAISE EXCEPTION 'Dirección no encontrada' USING ERRCODE = 'no_data_found';
    END IF;

    DELETE FROM addresses WHERE id = p_id;

EXCEPTION
    WHEN no_data_found THEN
        RAISE EXCEPTION 'No se puede eliminar: dirección no encontrada';
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error inesperado al eliminar dirección: %', SQLERRM;
END;
$$;