CREATE OR REPLACE PROCEDURE sp_create_brand(p_name TEXT, p_image_url TEXT)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Validación: nombre obligatorio
    IF p_name IS NULL OR trim(p_name) = '' THEN
        RAISE EXCEPTION 'El nombre de la marca es obligatorio' USING ERRCODE = 'not_null_violation';
    END IF;

    -- Validación: nombre único
    IF EXISTS (SELECT 1 FROM brands WHERE name = p_name) THEN
        RAISE EXCEPTION 'El nombre de la marca ya existe' USING ERRCODE = 'unique_violation';
    END IF;

    INSERT INTO brands (name, image_url)
    VALUES (p_name, p_image_url);

EXCEPTION
    WHEN unique_violation THEN
        RAISE EXCEPTION 'Violación de unicidad al crear marca: %', SQLERRM;
    WHEN not_null_violation THEN
        RAISE EXCEPTION 'Campo obligatorio faltante al crear marca: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error inesperado al crear marca: %', SQLERRM;
END;
$$;

CREATE OR REPLACE PROCEDURE sp_delete_brand(p_id INT)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Validación: existencia de la marca
    IF NOT EXISTS (SELECT 1 FROM brands WHERE id = p_id) THEN
        RAISE EXCEPTION 'Marca no encontrada' USING ERRCODE = 'no_data_found';
    END IF;

    DELETE FROM brands WHERE id = p_id;

EXCEPTION
    WHEN no_data_found THEN
        RAISE EXCEPTION 'No se puede eliminar: marca no encontrada';
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error inesperado al eliminar marca: %', SQLERRM;
END;
$$;

CREATE OR REPLACE PROCEDURE sp_update_brand(p_id INT, p_name TEXT, p_image_url TEXT)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Validación: existencia de la marca
    IF NOT EXISTS (SELECT 1 FROM brands WHERE id = p_id) THEN
        RAISE EXCEPTION 'Marca no encontrada' USING ERRCODE = 'no_data_found';
    END IF;

    -- Validación: nombre único
    IF EXISTS (SELECT 1 FROM brands WHERE name = p_name AND id <> p_id) THEN
        RAISE EXCEPTION 'El nombre de la marca ya está en uso' USING ERRCODE = 'unique_violation';
    END IF;

    UPDATE brands SET name = p_name, image_url = p_image_url
    WHERE id = p_id;

EXCEPTION
    WHEN unique_violation THEN
        RAISE EXCEPTION 'Violación de unicidad al actualizar marca: %', SQLERRM;
    WHEN not_null_violation THEN
        RAISE EXCEPTION 'Campo obligatorio faltante al actualizar marca: %', SQLERRM;
    WHEN no_data_found THEN
        RAISE EXCEPTION 'No se puede actualizar: marca no encontrada';
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error inesperado al actualizar marca: