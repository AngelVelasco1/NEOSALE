CREATE OR REPLACE PROCEDURE sp_createuser(
    p_name TEXT,
    p_email TEXT,
    p_emailverified BOOLEAN,
    p_password TEXT,
    p_phonenumber TEXT,
    p_identification TEXT,
    p_role TEXT DEFAULT 'user'
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO users (name, email, emailverified, password, phonenumber, identification, role) 
    VALUES (
        p_name, 
        p_email, 
        p_emailverified, 
        p_password, 
        p_phonenumber, 
        p_identification, 
        p_role::roles_enum 
    );
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
    p_id INT,
    p_name TEXT,
    p_email TEXT,
    p_emailverified BOOLEAN,
    p_password TEXT,
    p_phonenumber TEXT,
    p_identification TEXT,
    p_role TEXT DEFAULT 'user'
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
        role = COALESCE(p_role::roles_enum, role)
    WHERE id = p_id;
END;
$$;
select * from users;

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

