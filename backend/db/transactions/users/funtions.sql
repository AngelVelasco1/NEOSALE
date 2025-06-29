CREATE OR REPLACE PROCEDURE sp_createuser(
    p_name VARCHAR(255),
    p_email VARCHAR(255),
    p_emailverified BOOLEAN,
    p_password VARCHAR(255),
    p_phonenumber VARCHAR(255),
    p_identification VARCHAR(255) ,
    p_role roles_enum DEFAULT 'user'::roles_enum
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO users (name, email, emailverified, password, phonenumber, identification, role) 
    VALUES (p_name, p_email, p_emailverified, p_password, p_phonenumber, p_identification, p_role);
END;
$$;

DROP PROCEDURE sp_createuser(character varying,character varying,boolean,character varying,character varying,character varying,roles_enum) 
CREATE OR REPLACE PROCEDURE sp_deleteUser(p_id users.id%TYPE)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM users WHERE id = p_id;
END;
$$;


CREATE OR REPLACE PROCEDURE sp_deleteUser(p_id users.id%TYPE)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM users WHERE id = p_id;
END;
$$;



CREATE OR REPLACE PROCEDURE sp_updateUser(
    p_id users.id%TYPE,
    p_name users.name%TYPE DEFAULT NULL,
    p_email users.email%TYPE DEFAULT NULL,
    p_emailverified users.emailverified%TYPE DEFAULT NULL,
    p_password users.password%TYPE DEFAULT NULL,
    p_phonenumber users.phonenumber%TYPE DEFAULT NULL,
    p_identification users.identification%TYPE DEFAULT NULL,
    p_role users.role%TYPE DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE users SET 
        name = COALESCE(p_name, name),
        email = COALESCE(p_email, email),
        emailverified = COALESCE(p_emailverified, emailverified),
        password = COALESCE(p_password, password),
        phonenumber = COALESCE(p_phonenumber, phonenumber),
        identification = COALESCE(p_identification, identification),
        role = COALESCE(p_role, role)
    WHERE id = p_id;
END;
$$;

/*************************************/
/*Función para Obtener Usuario por ID*/
/************************************/
CREATE OR REPLACE FUNCTION fn_getUserById(p_id users.id%TYPE)
RETURNS TABLE(
    id users.id%TYPE,
    name users.name%TYPE,
    email users.email%TYPE,
    emailverified users.emailverified%TYPE,
    phonenumber users.phonenumber%TYPE,
    identification users.identification%TYPE,
    role users.role%TYPE,
    createdat users."createdAt"%TYPE
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT u.id, u.name, u.email, u.emailverified, u.phonenumber, u.identification, u.role, u."createdAt"
    FROM users u
    WHERE u.id = p_id;
END;
$$;

/*************************************/
/*Función para Obtener Usuario por Email*/
/************************************/
CREATE OR REPLACE FUNCTION fn_getUserByEmail(p_email users.email%TYPE)
RETURNS TABLE(
    id users.id%TYPE,
    name users.name%TYPE,
    email users.email%TYPE,
    emailverified users.emailverified%TYPE,
    password users.password%TYPE,
    phonenumber users.phonenumber%TYPE,
    identification users.identification%TYPE,
    role users.role%TYPE,
    createdat users."createdAt"%TYPE
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT u.id, u.name, u.email, u.emailverified, u.password, u.phonenumber, u.identification, u.role, u."createdAt"
    FROM users u
    WHERE u.email = p_email;
END;
$$;

