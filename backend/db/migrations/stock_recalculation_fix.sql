-- =====================================================
-- MIGRACIÓN: Mejora del sistema de stock de productos
-- Fecha: 2026-02-06
-- Descripción: Corrige la lógica de decrementación de stock
--              y añade recálculo automático del stock total
-- =====================================================

BEGIN;

-- 1. Recalcular el stock de todos los productos que tienen variantes
UPDATE products p
SET stock = (
    SELECT COALESCE(SUM(pv.stock), 0)
    FROM product_variants pv
    WHERE pv.product_id = p.id
    AND pv.active = TRUE
    AND pv.deleted_at IS NULL
),
updated_at = NOW()
WHERE EXISTS (
    SELECT 1 
    FROM product_variants pv 
    WHERE pv.product_id = p.id 
    AND pv.active = TRUE 
    AND pv.deleted_at IS NULL
);

-- 2. Crear la función de recálculo de stock
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

-- 3. Crear el trigger
DROP TRIGGER IF EXISTS trg_recalculate_product_stock_on_variant_change ON product_variants;

CREATE TRIGGER trg_recalculate_product_stock_on_variant_change
    AFTER INSERT OR UPDATE OF stock, active, deleted_at OR DELETE
    ON product_variants
    FOR EACH ROW
    EXECUTE FUNCTION fn_recalculate_product_stock();

-- 4. Añadir comentarios
COMMENT ON FUNCTION fn_recalculate_product_stock() IS 
'Recalcula automáticamente el stock total del producto sumando el stock de todas sus variantes activas. 
Se ejecuta cuando se inserta, actualiza o elimina una variante.';

COMMENT ON TRIGGER trg_recalculate_product_stock_on_variant_change ON product_variants IS 
'Trigger que mantiene sincronizado el stock del producto con la suma de sus variantes activas.';

-- 5. Verificación de integridad de datos
DO $$
DECLARE
    v_inconsistent_products INTEGER;
BEGIN
    -- Contar productos con stock inconsistente
    SELECT COUNT(*) INTO v_inconsistent_products
    FROM products p
    WHERE EXISTS (
        SELECT 1 
        FROM product_variants pv 
        WHERE pv.product_id = p.id 
        AND pv.active = TRUE 
        AND pv.deleted_at IS NULL
    )
    AND p.stock != (
        SELECT COALESCE(SUM(pv.stock), 0)
        FROM product_variants pv
        WHERE pv.product_id = p.id
        AND pv.active = TRUE
        AND pv.deleted_at IS NULL
    );
    
    RAISE NOTICE 'Productos con stock inconsistente corregidos: %', v_inconsistent_products;
END $$;

COMMIT;

-- Reporte de verificación
SELECT 
    p.id as product_id,
    p.name as product_name,
    p.stock as current_stock,
    (
        SELECT COALESCE(SUM(pv.stock), 0)
        FROM product_variants pv
        WHERE pv.product_id = p.id
        AND pv.active = TRUE
        AND pv.deleted_at IS NULL
    ) as calculated_stock,
    (
        SELECT COUNT(*)
        FROM product_variants pv
        WHERE pv.product_id = p.id
        AND pv.active = TRUE
        AND pv.deleted_at IS NULL
    ) as variants_count
FROM products p
WHERE EXISTS (
    SELECT 1 
    FROM product_variants pv 
    WHERE pv.product_id = p.id 
    AND pv.active = TRUE 
    AND pv.deleted_at IS NULL
)
ORDER BY p.id
LIMIT 20;
