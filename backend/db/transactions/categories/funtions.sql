CREATE OR REPLACE PROCEDURE sp_create_category(p_name VARCHAR)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Validación: nombre único
    IF EXISTS (SELECT 1 FROM categories WHERE name = p_name) THEN
        RAISE EXCEPTION 'El nombre de la categoría ya existe' USING ERRCODE = 'unique_violation';
    END IF;

    INSERT INTO categories (name)
    VALUES (p_name);

EXCEPTION
    WHEN unique_violation THEN
        RAISE EXCEPTION 'Violación de unicidad al crear categoría: %', SQLERRM;
    WHEN not_null_violation THEN
        RAISE EXCEPTION 'Campo obligatorio faltante al crear categoría: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error inesperado al crear categoría: %', SQLERRM;
END;
$$;


CREATE OR REPLACE PROCEDURE sp_update_category(p_id INT, p_name VARCHAR)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Validación: existencia de la categoría
    IF NOT EXISTS (SELECT 1 FROM categories WHERE id = p_id) THEN
        RAISE EXCEPTION 'Categoría no encontrada' USING ERRCODE = 'no_data_found';
    END IF;

    -- Validación: nombre único
    IF EXISTS (SELECT 1 FROM categories WHERE name = p_name AND id <> p_id) THEN
        RAISE EXCEPTION 'El nombre de la categoría ya está en uso' USING ERRCODE = 'unique_violation';
    END IF;

    UPDATE categories SET name = p_name WHERE id = p_id;

EXCEPTION
    WHEN unique_violation THEN
        RAISE EXCEPTION 'Violación de unicidad al actualizar categoría: %', SQLERRM;
    WHEN not_null_violation THEN
        RAISE EXCEPTION 'Campo obligatorio faltante al actualizar categoría: %', SQLERRM;
    WHEN no_data_found THEN
        RAISE EXCEPTION 'No se puede actualizar: categoría no encontrada';
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error inesperado al actualizar categoría: %', SQLERRM;
END;
$$;


CREATE OR REPLACE PROCEDURE sp_delete_category(p_id INT)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Validación: existencia de la categoría
    IF NOT EXISTS (SELECT 1 FROM categories WHERE id = p_id) THEN
        RAISE EXCEPTION 'Categoría no encontrada' USING ERRCODE = 'no_data_found';
    END IF;

    DELETE FROM categories WHERE id = p_id;

EXCEPTION
    WHEN no_data_found THEN
        RAISE EXCEPTION 'No se puede eliminar: categoría no encontrada';
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error inesperado al eliminar categoría: %', SQLERRM;
END;
$$;
