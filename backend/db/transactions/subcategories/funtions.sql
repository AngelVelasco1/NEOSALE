/*********************************/
/*Función para Crear Subcategoria*/
/*********************************/

CREATE OR REPLACE PROCEDURE createsubcategory(p_name VARCHAR)
    LANGUAGE plpgsql
    AS $$
    BEGIN
        INSERT INTO subcategories (name) 
        VALUES (p_name);
    END;
    $$;

    
/**************************************/
/*Función para Actualizar Subcategoria*/
/**************************************/
CREATE OR REPLACE PROCEDURE updatesubcategory(p_name VARCHAR)
    LANGUAGE plpgsql
    AS $$
    BEGIN
        UPDATE subcategories SET name = p_name
        WHERE id = p_id;
    END;
    $$;


/*********************************/
/*Función para Eliminar Subcategoria*/
/*********************************/
CREATE OR REPLACE PROCEDURE deletesubcategory(p_id INT)
    LANGUAGE plpgsql
    AS $$
    BEGIN
        DELETE FROM subcategories WHERE id = p_id;
    END;
$$;