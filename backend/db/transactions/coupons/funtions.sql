/******************************/
/*Función para Crear Cupón*/
/*****************************/

CREATE OR REPLACE PROCEDURE created_cupón(p_code VARCHAR, p_discount NUMERIC)

    LANGUAGE plpgsql
    AS $$
    BEGIN
        INSERT INTO created_cupón (code, discount) 
        VALUES (p_code, p_discount);
    END;
    $$;

/*********************************/
/*Función para Eliminar Cupón*/
/********************************/

    CREATE OR REPLACE PROCEDURE delete_cupón(p_id INT)

    LANGUAGE plpgsql
    AS $$
    BEGIN
            DELETE FROM COUPONS WHEN id = p.id;
    END;
    $$;


