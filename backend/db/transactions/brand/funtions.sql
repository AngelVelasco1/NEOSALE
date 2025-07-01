/******************************/
/*Función para Crear Marca*/
/*****************************/

CREATE OR REPLACE PROCEDURE createBrand(p_name TEXT, p_imageurl TEXT)
    LANGUAGE plpgsql
    AS $$
    BEGIN
        INSERT INTO brands (name, imageurl) 
        VALUES (p_name, p_imageurl);
    END;
    $$;|    


/********************************/
/*Función para Eliminar Marca*/
/********************************/
CREATE OR REPLACE PROCEDURE deleteBrand(p_id INT)
    LANGUAGE plpgsql
    AS $$
    BEGIN
        DELETE FROM brands WHERE id = p_id;
    END;
$$;


/**********************************/
/*Función para Actualizar Marca*/
/**********************************/
CREATE OR REPLACE PROCEDURE updateBrand(p_name TEXT, p_imageurl TEXT)
    LANGUAGE plpgsql
    AS $$
    BEGIN
        UPDATE brands SET name = p_name, imageurl = p_imageurl
        WHERE id = p_id;
    END;
    $$;