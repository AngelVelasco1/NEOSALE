/********************************/
/*Función para Crear Usuarios*/
/*******************************/

CREATE OR REPLACE PROCEDURE createUser(p_name TEXT, p_email TEXT, p_emailverified BOOLEAN, p_password TEXT, p_phonenumber TEXT, p_roleid INT)
    LANGUAGE plpgsql
    AS $$
    BEGIN
        INSERT INTO users (name, email, emailverified, password, phonenumber, roleid) 
        VALUES (p_name, p_email, p_emailverified, p_password, p_phonenumber, p_roleid);
    END;
    $$;


/***********************************/
/*Función para Eliminar Usuarios*/
/**********************************/
CREATE OR REPLACE PROCEDURE deleteUser(p_id INT)
    LANGUAGE plpgsql
    AS $$
    BEGIN
        DELETE FROM users WHERE id = p_id;
    END;
$$;


/*************************************/
/*Función para Actualizar Usuarios*/
/************************************/
CREATE OR REPLACE PROCEDURE updateUser(p_name TEXT, p_email TEXT, p_emailverified BOOLEAN, p_password TEXT, p_phonenumber TEXT, p_roleid INT, p_createdat INT)
    LANGUAGE plpgsql
    AS $$
    BEGIN
        UPDATE users SET name = p_name, email = p_email, emailverified = p_emailverified, password = p_password, phonenumber = p_phonenumber, roleid = p_roleid, createdat = p_createdat
        WHERE id = p_id;
    END;
    $$;