CREATE OR REPLACE PROCEDURE insertProduct(
    p_name TEXT, p_description TEXT, p_price NUMERIC, p_stock INT, p_weight NUMERIC,
    p_sizes TEXT, p_isActive BOOLEAN, p_categoryId INT, p_brandId INT, p_createdBy INT, p_updatedBy INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO products (name, description, price, stock, weight, sizes, isActive, categoryId, brandId, createdBy, updatedBy) 
    VALUES (p_name, p_description, p_price, p_stock, p_weight, p_sizes, p_isActive, p_categoryId, p_brandId, p_createdBy, p_updatedBy);
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

CREATE OR REPLACE PROCEDURE deleteProduct(p_id INT)
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

CREATE OR REPLACE PROCEDURE updateProduct(
    p_productId INT, p_name TEXT, p_description TEXT, p_price NUMERIC, p_stock INT, p_weight NUMERIC,
    p_sizes TEXT, p_isActive BOOLEAN, p_categoryId INT, p_brandId INT, p_createdBy INT, p_updatedBy INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM products WHERE id = p_productId) THEN
        RAISE EXCEPTION 'Producto no encontrado' USING ERRCODE = 'no_data_found';
    END IF;
    UPDATE products SET 
        name = p_name, 
        description = p_description, 
        price = p_price, 
        stock = p_stock, 
        weight = p_weight, 
        sizes = p_sizes, 
        isActive = p_isActive,
        categoryId = p_categoryId, 
        brandId = p_brandId, 
        updatedBy = p_updatedBy, 
        updatedAt = NOW()
    WHERE id = p_productId;
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

CREATE OR REPLACE PROCEDURE desactivateProduct(p_id INT, p_updatedBy INT)
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM products WHERE id = p_id) THEN
        RAISE EXCEPTION 'Producto no encontrado' USING ERRCODE = 'no_data_found';
    END IF;
    UPDATE products SET isActive = FALSE, updatedBy = p_updatedBy, updatedAt = NOW()
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


