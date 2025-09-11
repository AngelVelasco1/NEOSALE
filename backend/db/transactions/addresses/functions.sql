-- ✅ CREAR DIRECCIÓN (FUNCTION - retorna el ID)
CREATE OR REPLACE FUNCTION sp_create_address(
    p_address TEXT, 
    p_country TEXT, 
    p_city TEXT, 
    p_department TEXT, 
    p_user_id INT,
    p_is_default BOOLEAN DEFAULT FALSE,
    OUT p_new_id INT
) 
LANGUAGE plpgsql 
AS $$ 
BEGIN 
    IF p_user_id IS NULL THEN
        RAISE EXCEPTION 'El ID de usuario es obligatorio' USING ERRCODE = 'not_null_violation';
    END IF;

    -- Si se marca como default, quitar el default de las otras direcciones del usuario
    IF p_is_default = TRUE THEN
        UPDATE addresses 
        SET is_default = FALSE 
        WHERE user_id = p_user_id AND is_default = TRUE;
    END IF;

    INSERT INTO addresses (address, country, city, department, user_id, is_default) 
    VALUES (p_address, p_country, p_city, p_department, p_user_id, p_is_default)
    RETURNING id INTO p_new_id;

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE EXCEPTION 'El usuario no existe';
    WHEN not_null_violation THEN
        RAISE EXCEPTION 'Campo obligatorio faltante al crear dirección: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error inesperado al crear dirección: %', SQLERRM;
END; 
$$;

-- ✅ ACTUALIZAR DIRECCIÓN (PROCEDURE - con validación de propietario)
CREATE OR REPLACE PROCEDURE sp_update_address(
    p_id INT,
    p_address TEXT, 
    p_country TEXT, 
    p_city TEXT, 
    p_department TEXT,
    p_is_default BOOLEAN DEFAULT NULL,
    p_user_id INT DEFAULT NULL  -- Para validar que le pertenece al usuario
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_current_user_id INT;
BEGIN
    -- Verificar que la dirección existe y obtener el user_id
    SELECT user_id INTO v_current_user_id 
    FROM addresses 
    WHERE id = p_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Dirección no encontrada' USING ERRCODE = 'no_data_found';
    END IF;

    -- Validar que le pertenece al usuario (si se proporciona user_id)
    IF p_user_id IS NOT NULL AND v_current_user_id != p_user_id THEN
        RAISE EXCEPTION 'No tienes permisos para modificar esta dirección' USING ERRCODE = 'insufficient_privilege';
    END IF;

    -- Si se marca como default, quitar el default de las otras direcciones del usuario
    IF p_is_default = TRUE THEN
        UPDATE addresses 
        SET is_default = FALSE 
        WHERE user_id = v_current_user_id AND is_default = TRUE AND id != p_id;
    END IF;

    UPDATE addresses SET
        address = COALESCE(p_address, address),
        country = COALESCE(p_country, country),
        city = COALESCE(p_city, city),
        department = COALESCE(p_department, department),
        is_default = COALESCE(p_is_default, is_default)
    WHERE id = p_id;

EXCEPTION
    WHEN not_null_violation THEN
        RAISE EXCEPTION 'Campo obligatorio faltante al actualizar dirección: %', SQLERRM;
    WHEN no_data_found THEN
        RAISE EXCEPTION 'No se puede actualizar: dirección no encontrada';
    WHEN insufficient_privilege THEN
        RAISE EXCEPTION 'No tienes permisos para modificar esta dirección';
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error inesperado al actualizar dirección: %', SQLERRM;
END;
$$;

-- ✅ ELIMINAR DIRECCIÓN (PROCEDURE - con validación de propietario)
CREATE OR REPLACE PROCEDURE sp_delete_address(
    p_id INT,
    p_user_id INT DEFAULT NULL  -- Para validar que le pertenece al usuario
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_current_user_id INT;
    v_is_default BOOLEAN;
    v_address_count INT;
BEGIN
    -- Verificar que la dirección existe y obtener información
    SELECT user_id, is_default INTO v_current_user_id, v_is_default
    FROM addresses 
    WHERE id = p_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Dirección no encontrada' USING ERRCODE = 'no_data_found';
    END IF;

    -- Validar que le pertenece al usuario (si se proporciona user_id)
    IF p_user_id IS NOT NULL AND v_current_user_id != p_user_id THEN
        RAISE EXCEPTION 'No tienes permisos para eliminar esta dirección' USING ERRCODE = 'insufficient_privilege';
    END IF;

    -- Contar cuántas direcciones tiene el usuario
    SELECT COUNT(*) INTO v_address_count
    FROM addresses 
    WHERE user_id = v_current_user_id;

    -- No permitir eliminar la única dirección
    IF v_address_count = 1 THEN
        RAISE EXCEPTION 'No puedes eliminar tu única dirección' USING ERRCODE = 'restrict_violation';
    END IF;

    -- Si se elimina la dirección default, hacer que otra sea default
IF v_is_default = TRUE THEN
    UPDATE addresses
    SET is_default = TRUE
    WHERE id = (
        SELECT id FROM addresses
        WHERE user_id = v_current_user_id AND id != p_id
        ORDER BY created_at ASC
        LIMIT 1
    );
END IF;

    DELETE FROM addresses WHERE id = p_id;

EXCEPTION
    WHEN no_data_found THEN
        RAISE EXCEPTION 'No se puede eliminar: dirección no encontrada';
    WHEN insufficient_privilege THEN
        RAISE EXCEPTION 'No tienes permisos para eliminar esta dirección';
    WHEN restrict_violation THEN
        RAISE EXCEPTION 'No puedes eliminar tu única dirección';
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error inesperado al eliminar dirección: %', SQLERRM;
END;
$$;

-- ✅ ESTABLECER DIRECCIÓN COMO DEFAULT (PROCEDURE)
CREATE OR REPLACE PROCEDURE sp_set_default_address(
    p_id INT,
    p_user_id INT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_current_user_id INT;
BEGIN
    -- Verificar que la dirección existe y obtener el user_id
    SELECT user_id INTO v_current_user_id 
    FROM addresses 
    WHERE id = p_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Dirección no encontrada' USING ERRCODE = 'no_data_found';
    END IF;

    -- Validar que le pertenece al usuario
    IF v_current_user_id != p_user_id THEN
        RAISE EXCEPTION 'No tienes permisos para modificar esta dirección' USING ERRCODE = 'insufficient_privilege';
    END IF;

    -- Quitar default de todas las direcciones del usuario
    UPDATE addresses 
    SET is_default = FALSE 
    WHERE user_id = p_user_id AND is_default = TRUE;

    -- Establecer la nueva dirección como default
    UPDATE addresses 
    SET is_default = TRUE 
    WHERE id = p_id;

EXCEPTION
    WHEN no_data_found THEN
        RAISE EXCEPTION 'No se puede actualizar: dirección no encontrada';
    WHEN insufficient_privilege THEN
        RAISE EXCEPTION 'No tienes permisos para modificar esta dirección';
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error inesperado al establecer dirección predeterminada: %', SQLERRM;
END;
$$;

-- ✅ OBTENER DIRECCIONES DE UN USUARIO (FUNCTION)
CREATE OR REPLACE FUNCTION sp_get_user_addresses(p_user_id INT)
RETURNS TABLE (
    id INT,
    address VARCHAR(255),
    country VARCHAR(255),
    city VARCHAR(255),
    department VARCHAR(255),
    is_default BOOLEAN,
    created_at TIMESTAMP
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF p_user_id IS NULL THEN
        RAISE EXCEPTION 'El ID de usuario es obligatorio' USING ERRCODE = 'not_null_violation';
    END IF;

    RETURN QUERY
    SELECT 
        a.id,
        a.address,
        a.country,
        a.city,
        a.department,
        a.is_default,
        a.created_at
    FROM addresses a
    WHERE a.user_id = p_user_id
    ORDER BY a.is_default DESC;

EXCEPTION
    WHEN not_null_violation THEN
        RAISE EXCEPTION 'ID de usuario requerido';
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error inesperado al obtener direcciones: %', SQLERRM;
END;
$$;

-- ✅ OBTENER UNA DIRECCIÓN ESPECÍFICA (FUNCTION)
CREATE OR REPLACE FUNCTION sp_get_address_by_id(p_id INT, p_user_id INT)
RETURNS TABLE (
    id INT,
    address VARCHAR(255),
    country VARCHAR(255),
    city VARCHAR(255),
    department VARCHAR(255),
    is_default BOOLEAN,
    created_at TIMESTAMP
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF p_id IS NULL OR p_user_id IS NULL THEN
        RAISE EXCEPTION 'ID de dirección y usuario son obligatorios' USING ERRCODE = 'not_null_violation';
    END IF;

    RETURN QUERY
    SELECT 
        a.id,
        a.address,
        a.country,
        a.city,
        a.department,
        a.is_default,
        a.created_at
    FROM addresses a
    WHERE a.id = p_id AND a.user_id = p_user_id;

    -- Verificar si se encontró la dirección
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Dirección no encontrada o no pertenece al usuario' USING ERRCODE = 'no_data_found';
    END IF;

EXCEPTION
    WHEN not_null_violation THEN
        RAISE EXCEPTION 'ID de dirección y usuario requeridos';
    WHEN no_data_found THEN
        RAISE EXCEPTION 'Dirección no encontrada o no pertenece al usuario';
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error inesperado al obtener dirección: %', SQLERRM;
END;
$$;