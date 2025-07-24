CREATE OR REPLACE PROCEDURE sp_createuser(
    p_name TEXT,
    p_email TEXT,
    p_emailverified TIMESTAMP,
    p_password TEXT,
    p_phonenumber TEXT,
    p_identification TEXT,
    p_role TEXT DEFAULT 'user'
)
LANGUAGE plpgsql
AS $$
BEGIN

    IF EXISTS (SELECT 1 FROM "User" WHERE email = p_email) THEN
        RAISE EXCEPTION 'Email ya registrado' USING ERRCODE = 'unique_violation';
    END IF;

    IF EXISTS (SELECT 1 FROM "User" WHERE phonenumber = p_phonenumber) THEN
        RAISE EXCEPTION 'Numero de telefono ya registrado' USING ERRCODE = 'unique_violation';
    END IF;


    INSERT INTO "User" (name, email, "emailVerified", password, phonenumber, identification, role) 
    VALUES (
        p_name, 
        p_email, 
        p_emailVerified, 
        p_password, 
        p_phonenumber, 
        p_identification, 
        p_role::roles_enum 
    );
    EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error en SP: %', SQLERRM;
END;
$$;



CREATE OR REPLACE PROCEDURE sp_deleteUser(p_id users.id%TYPE)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM users WHERE id = p_id;
END;
$$;

CREATE OR REPLACE PROCEDURE sp_updateuser(
    p_id INT,
    p_name TEXT,
    p_email TEXT,
    p_emailverified TIMESTAMP,
    p_phonenumber TEXT,
    p_identification TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE "User"  SET 
        name = COALESCE(p_name, name),
        email = COALESCE(p_email, email),
        "emailVerified" = COALESCE(p_emailverified, "emailVerified"),
        phonenumber = COALESCE(p_phonenumber, phonenumber),
        identification = COALESCE(p_identification, identification)
    WHERE id = p_id;
END;
$$;


CREATE OR REPLACE PROCEDURE sp_updatePassword(p_id INT, p_newPassword TEXT) 
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE users SET password = p_newPassword WHERE id = p_id;
END;
$$;

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
    SELECT u.id, u.name, u.email, u."emailverified", u.phonenumber, u.identification, u.role, u."createdAt"
    FROM users u
    WHERE u.id = p_id;
END;
$$;

select * from users;

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
    SELECT u.id, u.name, u.email, u."emailverified", u.password, u.phonenumber, u.identification, u.role, u."createdAt"
    FROM users u
    WHERE u.email = p_email;
END;
$$;