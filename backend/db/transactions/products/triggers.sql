-- Función para recalcular automáticamente el stock del producto cuando cambian sus variantes
CREATE OR REPLACE FUNCTION fn_recalculate_product_stock()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_product_id INTEGER;
    v_new_total_stock INTEGER;
BEGIN
    -- Determinar qué product_id usar según la operación
    IF TG_OP = 'DELETE' THEN
        v_product_id := OLD.product_id;
    ELSE
        v_product_id := NEW.product_id;
    END IF;
    
    -- Calcular la suma total del stock de todas las variantes activas del producto
    SELECT COALESCE(SUM(stock), 0) INTO v_new_total_stock
    FROM product_variants
    WHERE product_id = v_product_id
    AND active = TRUE
    AND deleted_at IS NULL;
    
    -- Actualizar el stock del producto
    UPDATE products
    SET stock = v_new_total_stock,
        updated_at = NOW()
    WHERE id = v_product_id;
    
    -- Retornar el registro apropiado según la operación
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$;

-- Eliminar trigger si existe
DROP TRIGGER IF EXISTS trg_recalculate_product_stock_on_variant_change ON product_variants;

-- Crear trigger que se ejecuta después de INSERT, UPDATE o DELETE en product_variants
CREATE TRIGGER trg_recalculate_product_stock_on_variant_change
    AFTER INSERT OR UPDATE OF stock, active, deleted_at OR DELETE
    ON product_variants
    FOR EACH ROW
    EXECUTE FUNCTION fn_recalculate_product_stock();

