CREATE OR REPLACE PROCEDURE sp_insert_product(
    p_name TEXT, 
    p_description TEXT, 
    p_price NUMERIC, 
    p_stock INT, 
    p_weight NUMERIC,
    p_sizes TEXT, 
    p_is_active BOOLEAN, 
    p_category_id INT, 
    p_brand_id INT, 
    p_created_by INT, 
    p_updated_by INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO products (
        name, description, price, stock, weight, sizes, is_active, category_id, brand_id, created_by, updated_by
    ) VALUES (
        p_name, p_description, p_price, p_stock, p_weight, p_sizes, p_is_active, p_category_id, p_brand_id, p_created_by, p_updated_by
    );
EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE EXCEPTION 'Error: categoría o marca no existe';
    WHEN not_null_violation THEN
        RAISE EXCEPTION 'Error: campo obligatorio faltante';
    WHEN unique_violation THEN
        RAISE EXCEPTION 'Error: producto duplicado';
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error inesperado al insertar producto: %', SQLERRM;
END;
$$;

CREATE OR REPLACE PROCEDURE sp_delete_product(p_id INT)
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM products WHERE id = p_id) THEN
        RAISE EXCEPTION 'Producto no encontrado' USING ERRCODE = 'no_data_found';
    END IF;
    DELETE FROM products WHERE id = p_id;
EXCEPTION
    WHEN no_data_found THEN
        RAISE EXCEPTION 'No se puede eliminar: producto no encontrado';
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error inesperado al eliminar producto: %', SQLERRM;
END;
$$;

CREATE OR REPLACE PROCEDURE sp_update_product(
    p_id INT, 
    p_name TEXT, 
    p_description TEXT, 
    p_price NUMERIC, 
    p_stock INT, 
    p_weight NUMERIC,
    p_sizes TEXT, 
    p_is_active BOOLEAN, 
    p_category_id INT, 
    p_brand_id INT, 
    p_created_by INT, 
    p_updated_by INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM products WHERE id = p_id) THEN
        RAISE EXCEPTION 'Producto no encontrado' USING ERRCODE = 'no_data_found';
    END IF;
    UPDATE products SET 
        name = p_name, 
        description = p_description, 
        price = p_price, 
        stock = p_stock, 
        weight = p_weight, 
        sizes = p_sizes, 
        is_active = p_is_active,
        category_id = p_category_id, 
        brand_id = p_brand_id, 
        updated_by = p_updated_by, 
        updated_at = NOW()
    WHERE id = p_id;
EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE EXCEPTION 'Error: categoría o marca no existe';
    WHEN not_null_violation THEN
        RAISE EXCEPTION 'Error: campo obligatorio faltante';
    WHEN unique_violation THEN
        RAISE EXCEPTION 'Error: producto duplicado';
    WHEN no_data_found THEN
        RAISE EXCEPTION 'No se puede actualizar: producto no encontrado';
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error inesperado al actualizar producto: %', SQLERRM;
END;
$$;

CREATE OR REPLACE PROCEDURE sp_desactivate_product(p_id INT, p_updated_by INT)
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM products WHERE id = p_id) THEN
        RAISE EXCEPTION 'Producto no encontrado' USING ERRCODE = 'no_data_found';
    END IF;
    UPDATE products SET is_active = FALSE, updated_by = p_updated_by, updated_at = NOW()
    WHERE id = p_id;
EXCEPTION
    WHEN not_null_violation THEN
        RAISE EXCEPTION 'Error: campo obligatorio faltante';
    WHEN no_data_found THEN
        RAISE EXCEPTION 'No se puede desactivar: producto no encontrado';
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error inesperado al desactivar producto: %', SQLERRM;
END;
$$;