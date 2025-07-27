CREATE OR REPLACE PROCEDURE sp_createUser(
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

    IF EXISTS (SELECT 1 FROM "User" WHERE identification = p_identification) THEN
        RAISE EXCEPTION 'Numero de identificacion ya registrado' USING ERRCODE = 'unique_violation';
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
        WHEN unique_violation THEN
            RAISE EXCEPTION 'Violación de unicidad al crear usuario: %', SQLERRM;
        WHEN not_null_violation THEN
            RAISE EXCEPTION 'Campo obligatorio faltante al crear usuario: %', SQLERRM;
        WHEN invalid_text_representation THEN
            RAISE EXCEPTION 'Formato de texto inválido al crear usuario: %', SQLERRM;
        WHEN OTHERS THEN
            RAISE EXCEPTION 'Error al crear usuario en SP: %', SQLERRM;
END;
$$;

CREATE OR REPLACE PROCEDURE sp_deleteUser(p_id users.id%TYPE)
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM "User" WHERE id = p_id) THEN 
        RAISE EXCEPTION 'Usuario no encontrado' USING ERRCODE = 'no_data_found'
    END IF;

    DELETE FROM "User" WHERE id = p_id;
    EXCEPTION   
        WHEN unique_violation THEN
            RAISE EXCEPTION 'Violación de unicidad al actualizar usuario: %', SQLERRM;
        WHEN not_null_violation THEN
            RAISE EXCEPTION 'Campo obligatorio faltante al actualizar usuario: %', SQLERRM;
        WHEN invalid_text_representation THEN
            RAISE EXCEPTION 'Formato de texto inválido al actualizar usuario: %', SQLERRM;
        WHEN no_data_found THEN
            RAISE EXCEPTION 'No se puede actualizar: usuario no encontrado';
        WHEN OTHERS THEN
            RAISE EXCEPTION 'Error al eliminar usuario en SP: %', SQLERRM;
END;
$$;

CREATE OR REPLACE PROCEDURE sp_updateUser(
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
    IF NOT EXISTS (SELECT 1 FROM "User" WHERE id = p_id) THEN 
        RAISE EXCEPTION 'Usuario no encontrado' USING ERRCODE = 'no_data_found';
    END IF;

    IF p_email IS NOT NULL AND EXISTS (SELECT 1 FROM "User" WHERE email = p_email AND id != p_id) THEN
        RAISE EXCEPTION 'Email ya registrado' USING ERRCODE = 'unique_violation';
    END IF;
    
    IF p_phonenumber IS NOT NULL AND EXISTS (SELECT 1 FROM "User" WHERE phonenumber = p_phonenumber AND id != p_id) THEN
        RAISE EXCEPTION 'Numero de telefono ya registrado' USING ERRCODE = 'unique_violation';
    END IF;

    IF p_identification IS NOT NULL AND EXISTS (SELECT 1 FROM "User" WHERE identification = p_identification AND id != p_id) THEN
        RAISE EXCEPTION 'Numero de identificacion ya registrado' USING ERRCODE = 'unique_violation';
    END IF;

    UPDATE "User"  SET 
        name = COALESCE(p_name, name),
        email = COALESCE(p_email, email),
        "emailVerified" = COALESCE(p_emailverified, "emailVerified"),
        phonenumber = COALESCE(p_phonenumber, phonenumber),
        identification = COALESCE(p_identification, identification)
    WHERE id = p_id;

    EXCEPTION
        WHEN not_null_violation THEN
            RAISE EXCEPTION 'Campo obligatorio faltante al actualizar contraseña: %', SQLERRM;
        WHEN no_data_found THEN
            RAISE EXCEPTION 'No se puede actualizar contraseña: usuario no encontrado';
        WHEN OTHERS THEN
            RAISE EXCEPTION 'Error al actualizar usuario en SP: %', SQLERRM;
END;
$$;

CREATE OR REPLACE PROCEDURE sp_updatePassword(p_id INT, p_newPassword TEXT) 
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = p_id) THEN
        RAISE EXCEPTION 'Usuario no encontrado' USING ERRCODE = 'no_data_found';
    END IF;

    IF p_newPassword IS NULL OR trim(p_newPassword) = '' THEN
        RAISE EXCEPTION 'La nueva contraseña es obligatoria' USING ERRCODE = 'not_null_violation';
    END IF;

    UPDATE users SET password = p_newPassword WHERE id = p_id;
    EXCEPTION
        WHEN not_null_violation THEN
            RAISE EXCEPTION 'Campo obligatorio faltante al actualizar contraseña: %', SQLERRM;
        WHEN no_data_found THEN
            RAISE EXCEPTION 'No se puede actualizar contraseña: usuario no encontrado';
        WHEN OTHERS THEN
            RAISE EXCEPTION 'Error al actualizar contraseña en SP: %', SQLERRM;
END;
$$;