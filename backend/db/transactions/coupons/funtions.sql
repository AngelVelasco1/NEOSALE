CREATE OR REPLACE PROCEDURE sp_create_coupon(p_code VARCHAR, p_discount NUMERIC)
LANGUAGE plpgsql
AS $$
BEGIN 
    IF p_discount IS NULL OR p_discount <= 0 THEN
        RAISE EXCEPTION 'El descuento debe ser mayor a 0' USING ERRCODE = 'not_null_violation';
    END IF;

    IF EXISTS (SELECT 1 FROM coupons WHERE code = p_code) THEN
        RAISE EXCEPTION 'El código de cupón ya existe' USING ERRCODE = 'unique_violation';
    END IF;

    INSERT INTO coupons (code, discount)
    VALUES (p_code, p_discount);

EXCEPTION
    WHEN unique_violation THEN
        RAISE EXCEPTION 'Violación de unicidad al crear cupón: %', SQLERRM;
    WHEN not_null_violation THEN
        RAISE EXCEPTION 'Campo obligatorio faltante al crear cupón: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error inesperado al crear cupón: %', SQLERRM;
END;
$$;

CREATE OR REPLACE PROCEDURE sp_delete_coupon(p_id INT)
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM coupons WHERE id = p_id) THEN
        RAISE EXCEPTION 'Cupón no encontrado' USING ERRCODE = 'no_data_found';
    END IF;

    DELETE FROM coupons WHERE id = p_id;

EXCEPTION
    WHEN no_data_found THEN
        RAISE EXCEPTION 'No se puede eliminar: cupón no encontrado';
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error inesperado al eliminar cupón: %', SQLERRM;
END;
$$;


