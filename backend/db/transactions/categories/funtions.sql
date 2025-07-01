/******************************/
/*Función para Crear Categoria*/
/******************************/

CREATE OR REPLACE PROCEDURE createcategory(p_name VARCHAR)
    LANGUAGE plpgsql
    AS $$
    BEGIN
        INSERT INTO categories (name) 
        VALUES (p_name);
    END;
    $$;

    
/***********************************/
/*Función para Actualizar Categoria*/
/***********************************/
CREATE OR REPLACE PROCEDURE updatecategory(p_name VARCHAR)
    LANGUAGE plpgsql
    AS $$
    BEGIN
        UPDATE categories SET name = p_name
        WHERE id = p_id;
    END;
    $$;


/*********************************/
/*Función para Eliminar Categoria*/
/*********************************/
CREATE OR REPLACE PROCEDURE deletecategory(p_id INT)
    LANGUAGE plpgsql
    AS $$
    BEGIN
        DELETE FROM categories WHERE id = p_id;
    END;
$$;
