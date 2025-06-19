

CREATE OR REPLACE FUNCTION sp_createAddress(
    p_address TEXT, 
    p_country TEXT, 
    p_city TEXT, 
    p_department TEXT, 
    p_userId TEXT,
    OUT p_new_id INTEGER  -- o UUID si tu ID es de ese tipo
) 
LANGUAGE plpgsql 
AS $$ 
BEGIN 
    -- Validaciones básicas
    IF p_address IS NULL OR trim(p_address) = '' THEN
        RAISE EXCEPTION 'Address cannot be null or empty';
    END IF;
    
    IF p_userId IS NULL OR trim(p_userId) = '' THEN
        RAISE EXCEPTION 'User ID cannot be null or empty';
    END IF;
    
    -- Insertar y retornar el ID
    INSERT INTO addresses (address, country, city, department, userId) 
    VALUES (p_address, p_country, p_city, p_department, p_userId)
    RETURNING id INTO p_new_id;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error creating address: %', SQLERRM;
END; 
$$;