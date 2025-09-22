CREATE OR REPLACE PROCEDURE sp_create_user(
    p_name TEXT,
    p_email TEXT,
    p_email_verified TIMESTAMP,
    p_password TEXT,
    p_phone_number TEXT,
    p_identification TEXT,
    p_role TEXT DEFAULT 'user'
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM "User" WHERE email = p_email) THEN
        RAISE EXCEPTION 'Email ya registrado' USING ERRCODE = 'unique_violation';
    END IF;

    IF EXISTS (SELECT 1 FROM "User" WHERE phone_number = p_phone_number) THEN
        RAISE EXCEPTION 'Numero de telefono ya registrado' USING ERRCODE = 'unique_violation';
    END IF;

    IF EXISTS (SELECT 1 FROM "User" WHERE identification = p_identification) THEN
        RAISE EXCEPTION 'Numero de identificacion ya registrado' USING ERRCODE = 'unique_violation';
    END IF;

    INSERT INTO "User" (name, email, email_verified, password, phone_number, identification, role) 
    VALUES (
        p_name, 
        p_email, 
        p_email_verified, 
        p_password, 
        p_phone_number, 
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

CREATE OR REPLACE PROCEDURE sp_delete_user(p_id INT)
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM "User" WHERE id = p_id) THEN 
        RAISE EXCEPTION 'Usuario no encontrado' USING ERRCODE = 'no_data_found';
    END IF;

    DELETE FROM "User" WHERE id = p_id;
    EXCEPTION   
        WHEN unique_violation THEN
            RAISE EXCEPTION 'Violación de unicidad al eliminar usuario: %', SQLERRM;
        WHEN not_null_violation THEN
            RAISE EXCEPTION 'Campo obligatorio faltante al eliminar usuario: %', SQLERRM;
        WHEN invalid_text_representation THEN
            RAISE EXCEPTION 'Formato de texto inválido al eliminar usuario: %', SQLERRM;
        WHEN no_data_found THEN
            RAISE EXCEPTION 'No se puede eliminar: usuario no encontrado';
        WHEN OTHERS THEN
            RAISE EXCEPTION 'Error al eliminar usuario en SP: %', SQLERRM;
END;
$$;

CREATE OR REPLACE PROCEDURE sp_update_user(
    p_id INT,
    p_name TEXT,
    p_email TEXT,
    p_email_verified TIMESTAMP,
    p_phone_number TEXT,
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
    
    IF p_phone_number IS NOT NULL AND EXISTS (SELECT 1 FROM "User" WHERE phone_number = p_phone_number AND id != p_id) THEN
        RAISE EXCEPTION 'Numero de telefono ya registrado' USING ERRCODE = 'unique_violation';
    END IF;

    IF p_identification IS NOT NULL AND EXISTS (SELECT 1 FROM "User" WHERE identification = p_identification AND id != p_id) THEN
        RAISE EXCEPTION 'Numero de identificacion ya registrado' USING ERRCODE = 'unique_violation';
    END IF;

    UPDATE "User" SET 
        name = COALESCE(p_name, name),
        email = COALESCE(p_email, email),
        email_verified = COALESCE(p_email_verified, email_verified),
        phone_number = COALESCE(p_phone_number, phone_number),
        identification = COALESCE(p_identification, identification)
    WHERE id = p_id;

    EXCEPTION
        WHEN not_null_violation THEN
            RAISE EXCEPTION 'Campo obligatorio faltante al actualizar usuario: %', SQLERRM;
        WHEN no_data_found THEN
            RAISE EXCEPTION 'No se puede actualizar: usuario no encontrado';
        WHEN OTHERS THEN
            RAISE EXCEPTION 'Error al actualizar usuario en SP: %', SQLERRM;
END;
$$;

CREATE OR REPLACE PROCEDURE sp_update_password(p_id INT, p_new_password TEXT) 
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM "User" WHERE id = p_id) THEN
        RAISE EXCEPTION 'Usuario no encontrado' USING ERRCODE = 'no_data_found';
    END IF;

    IF p_new_password IS NULL OR trim(p_new_password) = '' THEN
        RAISE EXCEPTION 'La nueva contraseña es obligatoria' USING ERRCODE = 'not_null_violation';
    END IF;

    UPDATE "User" SET password = p_new_password WHERE id = p_id;
    EXCEPTION
        WHEN not_null_violation THEN
            RAISE EXCEPTION 'Campo obligatorio faltante al actualizar contraseña: %', SQLERRM;
        WHEN no_data_found THEN
            RAISE EXCEPTION 'No se puede actualizar contraseña: usuario no encontrado';
        WHEN OTHERS THEN
            RAISE EXCEPTION 'Error al actualizar contraseña en SP: %', SQLERRM;
END;
$$;

CREATE OR REPLACE FUNCTION fn_add_favorite(p_user_id INT, p_product_id INT)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM "User" WHERE id = p_user_id) THEN
        RAISE EXCEPTION 'Usuario no encontrado' USING ERRCODE = 'no_data_found';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM products WHERE id = p_product_id) THEN
        RAISE EXCEPTION 'Producto no encontrado' USING ERRCODE = 'no_data_found';
    END IF;

    IF EXISTS (SELECT 1 FROM favorites WHERE user_id = p_user_id AND product_id = p_product_id) THEN
        RAISE EXCEPTION 'El producto ya está en favoritos' USING ERRCODE = 'unique_violation';
    END IF;

    INSERT INTO favorites (user_id, product_id) VALUES (p_user_id, p_product_id);
    RETURN TRUE;
    
    EXCEPTION
        WHEN unique_violation THEN
            RAISE EXCEPTION 'Violación de unicidad al agregar favorito: %', SQLERRM;
        WHEN not_null_violation THEN
            RAISE EXCEPTION 'Campo obligatorio faltante al agregar favorito: %', SQLERRM;
        WHEN invalid_text_representation THEN
            RAISE EXCEPTION 'Formato de texto inválido al agregar favorito: %', SQLERRM;
        WHEN no_data_found THEN
            RAISE EXCEPTION 'No se puede agregar favorito: usuario o producto no encontrado';
        WHEN OTHERS THEN
            RAISE EXCEPTION 'Error al agregar favorito en FN: %', SQLERRM;
END;
$$;
