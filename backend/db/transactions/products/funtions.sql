/************************************/
/*Función para Insertar Productos*/
/************************************/

CREATE OR REPLACE PROCEDURE insertProduct(p_name TEXT, p_description TEXT, p_price NUMERIC, p_stock INT, p_weight NUMERIC,
                                                                                p_sizes TEXT, p_isActive BOOLEAN, p_categoryId INT, p_brandId INT, p_createdBy INT, p_updatedBy INT)

    LANGUAGE plpgsql
    AS $$
    BEGIN
        INSERT INTO products (name, description, price, stock, weight, sizes, isActive, categoryId, brandId, createdBy, updatedBy) 
        VALUES (p_name, p_description, p_price, p_stock, p_weight, p_sizes, p_isActive, p_categoryId, p_brandId, p_createdBy, p_updatedBy);
    END;
    $$;

/************************************/
/*Función para Eliminar Productos*/
/************************************/

CREATE OR REPLACE PROCEDURE deleteProduct(p_id INT)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM products WHERE id = p_id;
END;
$$;

/**************************************/
/*Función para Actualizar Productos*/
/**************************************/

CREATE OR REPLACE PROCEDURE updateProduct(p_name TEXT, p_description TEXT, p_price NUMERIC, p_stock INT, p_weight NUMERIC,
                                                                                    p_sizes TEXT, p_isActive BOOLEAN, p_categoryId INT, p_brandId INT, p_createdBy INT, p_updatedBy INT)
    LANGUAGE plpgsql
    AS $$
    BEGIN
        UPDATE products SET name = p_name, description = p_description, price = p_price, stock = p_stock, weight = p_weight, sizes = p_sizes, isActive = p_isActive,
                                            categoryId = p_categoryId, brandId = p_brandId, updatedBy = p_updatedBy, updatedAt = NOW()
        WHERE id = p_productId;
    END;
    $$;


