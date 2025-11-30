-- Migración: Agregar campos de Soft Delete a tablas principales
-- Fecha: 2025-11-29
-- Descripción: Agrega deleted_at y deleted_by para implementar soft delete

-- 1. COUPONS
ALTER TABLE coupons 
ADD COLUMN deleted_at TIMESTAMP(6) NULL,
ADD COLUMN deleted_by INTEGER NULL,
ADD CONSTRAINT fk_coupon_deleted_by FOREIGN KEY (deleted_by) REFERENCES "User"(id);

COMMENT ON COLUMN coupons.deleted_at IS 'Fecha de eliminación lógica (NULL = activo)';
COMMENT ON COLUMN coupons.deleted_by IS 'Usuario que realizó la eliminación';

-- 2. PRODUCTS
ALTER TABLE products 
ADD COLUMN deleted_at TIMESTAMP(6) NULL,
ADD COLUMN deleted_by INTEGER NULL,
ADD CONSTRAINT fk_product_deleted_by FOREIGN KEY (deleted_by) REFERENCES "User"(id);

COMMENT ON COLUMN products.deleted_at IS 'Fecha de eliminación lógica (NULL = activo)';
COMMENT ON COLUMN products.deleted_by IS 'Usuario que realizó la eliminación';

-- 3. CATEGORIES
ALTER TABLE categories 
ADD COLUMN deleted_at TIMESTAMP(6) NULL,
ADD COLUMN deleted_by INTEGER NULL,
ADD CONSTRAINT fk_category_deleted_by FOREIGN KEY (deleted_by) REFERENCES "User"(id);

COMMENT ON COLUMN categories.deleted_at IS 'Fecha de eliminación lógica (NULL = activo)';
COMMENT ON COLUMN categories.deleted_by IS 'Usuario que realizó la eliminación';

-- 4. SUBCATEGORIES
ALTER TABLE subcategories 
ADD COLUMN deleted_at TIMESTAMP(6) NULL,
ADD COLUMN deleted_by INTEGER NULL,
ADD CONSTRAINT fk_subcategory_deleted_by FOREIGN KEY (deleted_by) REFERENCES "User"(id);

COMMENT ON COLUMN subcategories.deleted_at IS 'Fecha de eliminación lógica (NULL = activo)';
COMMENT ON COLUMN subcategories.deleted_by IS 'Usuario que realizó la eliminación';

-- 5. BRANDS
ALTER TABLE brands 
ADD COLUMN deleted_at TIMESTAMP(6) NULL,
ADD COLUMN deleted_by INTEGER NULL,
ADD CONSTRAINT fk_brand_deleted_by FOREIGN KEY (deleted_by) REFERENCES "User"(id);

COMMENT ON COLUMN brands.deleted_at IS 'Fecha de eliminación lógica (NULL = activo)';
COMMENT ON COLUMN brands.deleted_by IS 'Usuario que realizó la eliminación';

-- INDICES para mejorar performance de queries (solo registros NO eliminados)
CREATE INDEX idx_coupon_deleted ON coupons(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_product_deleted ON products(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_category_deleted ON categories(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_subcategory_deleted ON subcategories(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_brand_deleted ON brands(deleted_at) WHERE deleted_at IS NULL;

-- Verificación
SELECT 
    'coupons' as tabla, 
    COUNT(*) as total_registros,
    COUNT(deleted_at) as eliminados,
    COUNT(*) - COUNT(deleted_at) as activos
FROM coupons
UNION ALL
SELECT 'products', COUNT(*), COUNT(deleted_at), COUNT(*) - COUNT(deleted_at) FROM products
UNION ALL
SELECT 'categories', COUNT(*), COUNT(deleted_at), COUNT(*) - COUNT(deleted_at) FROM categories
UNION ALL
SELECT 'subcategories', COUNT(*), COUNT(deleted_at), COUNT(*) - COUNT(deleted_at) FROM subcategories
UNION ALL
SELECT 'brands', COUNT(*), COUNT(deleted_at), COUNT(*) - COUNT(deleted_at) FROM brands;
