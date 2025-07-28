CREATE OR REPLACE PROCEDURE create_subcategory(p_name VARCHAR)
LANGUAGE plpgsql
AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM subcategories WHERE name = p_name) THEN
        RAISE EXCEPTION 'La subcategoría ya existe' USING ERRCODE = 'unique_violation';
    END IF;
    INSERT INTO subcategories (name) VALUES (p_name);
EXCEPTION
    WHEN unique_violation THEN
        RAISE EXCEPTION 'Violación de unicidad al crear subcategoría: %', SQLERRM;
    WHEN not_null_violation THEN
        RAISE EXCEPTION 'Campo obligatorio faltante al crear subcategoría: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error inesperado al crear subcategoría: %', SQLERRM;
END;
$$;

CREATE OR REPLACE PROCEDURE update_subcategory(p_id INT, p_name VARCHAR)
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM subcategories WHERE id = p_id) THEN
        RAISE EXCEPTION 'Subcategoría no encontrada' USING ERRCODE = 'no_data_found';
    END IF;
    
    IF EXISTS (SELECT 1 FROM subcategories WHERE name = p_name AND id <> p_id) THEN
        RAISE EXCEPTION 'El nombre de la subcategoría ya está en uso' USING ERRCODE = 'unique_violation';
    END IF;
    UPDATE subcategories SET name = p_name WHERE id = p_id;
EXCEPTION
    WHEN unique_violation THEN
        RAISE EXCEPTION 'Violación de unicidad al actualizar subcategoría: %', SQLERRM;
    WHEN not_null_violation THEN
        RAISE EXCEPTION 'Campo obligatorio faltante al actualizar subcategoría: %', SQLERRM;
    WHEN no_data_found THEN
        RAISE EXCEPTION 'No se puede actualizar: subcategoría no encontrada';
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error inesperado al actualizar subcategoría: %', SQLERRM;
END;
$$;

CREATE OR REPLACE PROCEDURE delete_subcategory(p_id INT)
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM subcategories WHERE id = p_id) THEN
        RAISE EXCEPTION 'Subcategoría no encontrada' USING ERRCODE = 'no_data_found';
    END IF;
    DELETE FROM subcategories WHERE id = p_id;
EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE EXCEPTION 'No se puede eliminar: la subcategoría está relacionada con otros registros';
    WHEN no_data_found THEN
        RAISE EXCEPTION 'No se puede eliminar: subcategoría no encontrada';
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error inesperado al eliminar subcategoría: %', SQLERRM;
END;
$$;

