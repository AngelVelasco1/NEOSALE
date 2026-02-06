-- =====================================================
-- SCRIPT DE PRUEBAS: Sistema de Stock Mejorado
-- Ejecutar DESPUÉS de aplicar la migración
-- =====================================================

-- Configurar para ver los resultados
\timing on
\pset border 2

-- =====================================================
-- PREPARACIÓN: Crear datos de prueba
-- =====================================================

BEGIN;

-- Crear usuario de prueba
INSERT INTO "User" (name, email, password, role)
VALUES ('Test User', 'test@neosale.com', 'test123', 'user')
ON CONFLICT (email) DO UPDATE SET name = 'Test User'
RETURNING id AS test_user_id \gset

-- Crear dirección de prueba
INSERT INTO addresses (address, country, city, department, is_default, user_id)
VALUES ('Calle Test 123', 'Colombia', 'Bogotá', 'Cundinamarca', true, :test_user_id)
ON CONFLICT DO NOTHING
RETURNING id AS test_address_id \gset

-- Crear marca de prueba
INSERT INTO brands (name, description, active)
VALUES ('Test Brand', 'Marca de prueba', true)
ON CONFLICT (name) DO UPDATE SET name = 'Test Brand'
RETURNING id AS test_brand_id \gset

-- Crear categoría de prueba
INSERT INTO categories (name, description, active)
VALUES ('Test Category', 'Categoría de prueba', true)
RETURNING id AS test_category_id \gset

-- Crear producto de prueba CON VARIANTES
INSERT INTO products (
    name, description, price, stock, weight_grams, sizes,
    category_id, brand_id, active, created_by, updated_by
)
VALUES (
    'Producto Test con Variantes',
    'Producto para pruebas con variantes',
    100000, -- Precio $100,000
    0, -- Stock inicial (se recalculará automáticamente)
    500, -- 500 gramos
    'S,M,L',
    :test_category_id,
    :test_brand_id,
    true,
    :test_user_id,
    :test_user_id
)
RETURNING id AS test_product_variants_id \gset

-- Crear variantes del producto
INSERT INTO product_variants (product_id, color_code, color, size, stock, active)
VALUES 
    (:test_product_variants_id, '#FF0000', 'Rojo', 'S', 10, true),
    (:test_product_variants_id, '#FF0000', 'Rojo', 'M', 20, true),
    (:test_product_variants_id, '#FF0000', 'Rojo', 'L', 15, true),
    (:test_product_variants_id, '#0000FF', 'Azul', 'S', 8, true),
    (:test_product_variants_id, '#0000FF', 'Azul', 'M', 12, true),
    (:test_product_variants_id, '#0000FF', 'Azul', 'L', 10, true);

-- Crear producto de prueba SIN VARIANTES
INSERT INTO products (
    name, description, price, stock, weight_grams, sizes,
    category_id, brand_id, active, created_by, updated_by
)
VALUES (
    'Producto Test sin Variantes',
    'Producto para pruebas sin variantes',
    50000, -- Precio $50,000
    100, -- Stock directo
    300, -- 300 gramos
    'Única',
    :test_category_id,
    :test_brand_id,
    true,
    :test_user_id,
    :test_user_id
)
RETURNING id AS test_product_simple_id \gset

COMMIT;

\echo '✅ Datos de prueba creados'
\echo ''

-- =====================================================
-- PRUEBA 1: Verificar Recálculo Automático del Stock
-- =====================================================

\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
\echo '📊 PRUEBA 1: Recálculo Automático del Stock'
\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
\echo ''

-- Ver stock inicial
\echo '🔍 Stock inicial del producto con variantes:'
SELECT 
    p.id,
    p.name,
    p.stock as stock_producto,
    (SELECT SUM(stock) FROM product_variants pv 
     WHERE pv.product_id = p.id AND pv.active = TRUE) as suma_variantes
FROM products p
WHERE p.id = :test_product_variants_id;

\echo ''
\echo '🔍 Detalle de variantes:'
SELECT color, size, stock 
FROM product_variants 
WHERE product_id = :test_product_variants_id 
ORDER BY color, size;

\echo ''
\echo '✅ ESPERADO: stock_producto = suma_variantes (10+20+15+8+12+10 = 75)'
\echo ''

-- =====================================================
-- PRUEBA 2: Trigger al Actualizar Variante
-- =====================================================

\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
\echo '🔧 PRUEBA 2: Trigger al actualizar variante'
\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
\echo ''

BEGIN;

\echo '📝 Actualizando stock de variante Rojo-M de 20 → 50'
UPDATE product_variants 
SET stock = 50 
WHERE product_id = :test_product_variants_id 
AND color_code = '#FF0000' 
AND size = 'M';

\echo ''
\echo '🔍 Stock después de actualización:'
SELECT 
    p.stock as stock_producto,
    (SELECT SUM(stock) FROM product_variants pv 
     WHERE pv.product_id = p.id AND pv.active = TRUE) as suma_variantes
FROM products p
WHERE p.id = :test_product_variants_id;

\echo ''
\echo '✅ ESPERADO: stock_producto = 105 (10+50+15+8+12+10)'

COMMIT;
\echo ''

-- =====================================================
-- PRUEBA 3: Crear Orden con Variante Específica
-- =====================================================

\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
\echo '🛒 PRUEBA 3: Crear orden con variante específica'
\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
\echo ''

BEGIN;

-- Stock ANTES de la orden
\echo '📊 Stock ANTES de crear la orden:'
SELECT color, size, stock 
FROM product_variants 
WHERE product_id = :test_product_variants_id 
AND color_code = '#0000FF' 
AND size = 'L';

SELECT stock as stock_producto 
FROM products 
WHERE id = :test_product_variants_id;

-- Crear payment de prueba
INSERT INTO payments (
    reference,
    amount_in_cents,
    currency,
    payment_status,
    payment_method,
    customer_email,
    cart_data,
    shipping_address,
    user_id
)
VALUES (
    'TEST_ORDER_' || NOW()::TEXT,
    11900000, -- $119,000 (100,000 + 19% IVA)
    'COP',
    'APPROVED',
    'CARD',
    'test@neosale.com',
    '[{
        "product_id": ' || :test_product_variants_id || ',
        "quantity": 3,
        "price": 10000000,
        "color_code": "#0000FF",
        "size": "L"
    }]'::jsonb,
    '{"address": "Calle Test 123", "city": "Bogotá"}'::jsonb,
    :test_user_id
)
RETURNING id AS test_payment_id \gset

\echo ''
\echo '💳 Payment creado con ID:' :test_payment_id
\echo '📦 Cantidad a ordenar: 3 unidades de Azul-L'
\echo ''

-- Crear orden
\echo '🔄 Ejecutando fn_create_order...'
SELECT * FROM fn_create_order(
    :test_payment_id,
    :test_address_id,
    NULL
) AS result;

\echo ''
\echo '📊 Stock DESPUÉS de crear la orden:'

-- Variante específica
SELECT color, size, stock 
FROM product_variants 
WHERE product_id = :test_product_variants_id 
AND color_code = '#0000FF' 
AND size = 'L';

-- Producto total
SELECT stock as stock_producto 
FROM products 
WHERE id = :test_product_variants_id;

\echo ''
\echo '✅ ESPERADO Variante Azul-L: 10 - 3 = 7'
\echo '✅ ESPERADO Producto Total: 105 - 3 = 102'

COMMIT;
\echo ''

-- =====================================================
-- PRUEBA 4: Crear Orden sin Variantes
-- =====================================================

\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
\echo '📦 PRUEBA 4: Crear orden sin variantes'
\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
\echo ''

BEGIN;

-- Stock ANTES
\echo '📊 Stock ANTES de crear la orden:'
SELECT id, name, stock 
FROM products 
WHERE id = :test_product_simple_id;

-- Crear payment
INSERT INTO payments (
    reference,
    amount_in_cents,
    currency,
    payment_status,
    payment_method,
    customer_email,
    cart_data,
    shipping_address,
    user_id
)
VALUES (
    'TEST_SIMPLE_' || NOW()::TEXT,
    5950000, -- $59,500 (50,000 + 19% IVA)
    'COP',
    'APPROVED',
    'CARD',
    'test@neosale.com',
    '[{
        "product_id": ' || :test_product_simple_id || ',
        "quantity": 5,
        "price": 5000000,
        "color_code": "",
        "size": ""
    }]'::jsonb,
    '{"address": "Calle Test 123", "city": "Bogotá"}'::jsonb,
    :test_user_id
)
RETURNING id AS test_payment_simple_id \gset

\echo ''
\echo '💳 Payment creado con ID:' :test_payment_simple_id
\echo '📦 Cantidad a ordenar: 5 unidades'
\echo ''

-- Crear orden
\echo '🔄 Ejecutando fn_create_order...'
SELECT * FROM fn_create_order(
    :test_payment_simple_id,
    :test_address_id,
    NULL
) AS result;

\echo ''
\echo '📊 Stock DESPUÉS de crear la orden:'
SELECT id, name, stock 
FROM products 
WHERE id = :test_product_simple_id;

\echo ''
\echo '✅ ESPERADO: 100 - 5 = 95'

COMMIT;
\echo ''

-- =====================================================
-- PRUEBA 5: Insertar Nueva Variante (Trigger)
-- =====================================================

\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
\echo '➕ PRUEBA 5: Insertar nueva variante'
\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
\echo ''

BEGIN;

-- Stock ANTES
\echo '📊 Stock ANTES de insertar variante:'
SELECT stock FROM products WHERE id = :test_product_variants_id;

-- Insertar nueva variante
\echo ''
\echo '➕ Insertando variante Verde-M con stock 25'
INSERT INTO product_variants (product_id, color_code, color, size, stock, active)
VALUES (:test_product_variants_id, '#00FF00', 'Verde', 'M', 25, true);

-- Stock DESPUÉS
\echo ''
\echo '📊 Stock DESPUÉS de insertar variante:'
SELECT stock FROM products WHERE id = :test_product_variants_id;

\echo ''
\echo '✅ ESPERADO: 102 + 25 = 127'

COMMIT;
\echo ''

-- =====================================================
-- PRUEBA 6: Desactivar Variante (Trigger)
-- =====================================================

\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
\echo '❌ PRUEBA 6: Desactivar variante'
\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
\echo ''

BEGIN;

-- Stock ANTES
\echo '📊 Stock ANTES de desactivar variante:'
SELECT stock FROM products WHERE id = :test_product_variants_id;

-- Desactivar variante Verde-M
\echo ''
\echo '❌ Desactivando variante Verde-M (25 unidades)'
UPDATE product_variants 
SET active = false 
WHERE product_id = :test_product_variants_id 
AND color_code = '#00FF00' 
AND size = 'M';

-- Stock DESPUÉS
\echo ''
\echo '📊 Stock DESPUÉS de desactivar variante:'
SELECT stock FROM products WHERE id = :test_product_variants_id;

\echo ''
\echo '✅ ESPERADO: 127 - 25 = 102 (no cuenta variantes inactivas)'

COMMIT;
\echo ''

-- =====================================================
-- RESUMEN FINAL
-- =====================================================

\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
\echo '📋 RESUMEN FINAL'
\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
\echo ''

\echo '🔍 Estado final de productos:'
SELECT 
    p.id,
    p.name,
    p.stock as stock_total,
    (SELECT COUNT(*) FROM product_variants pv 
     WHERE pv.product_id = p.id AND pv.active = TRUE) as variantes_activas,
    (SELECT SUM(pv.stock) FROM product_variants pv 
     WHERE pv.product_id = p.id AND pv.active = TRUE) as suma_variantes
FROM products p
WHERE p.id IN (:test_product_variants_id, :test_product_simple_id)
ORDER BY p.id;

\echo ''
\echo '🔍 Órdenes creadas:'
SELECT 
    o.id,
    o.status,
    o.total,
    (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as items
FROM orders o
WHERE o.user_id = :test_user_id
ORDER BY o.created_at DESC
LIMIT 5;

\echo ''
\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
\echo '✅ PRUEBAS COMPLETADAS'
\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
\echo ''
\echo 'Verificar que:'
\echo '  ✓ Stock de productos con variantes = suma de variantes activas'
\echo '  ✓ Stock de productos sin variantes se decrementa correctamente'
\echo '  ✓ Trigger funciona al insertar/actualizar/desactivar variantes'
\echo '  ✓ Órdenes se crean correctamente con decrementación precisa'
\echo ''

-- Opcional: Limpiar datos de prueba
\echo '¿Desea limpiar los datos de prueba? (Comentar para mantener)'
-- BEGIN;
-- DELETE FROM order_items WHERE order_id IN (SELECT id FROM orders WHERE user_id = :test_user_id);
-- DELETE FROM orders WHERE user_id = :test_user_id;
-- DELETE FROM payments WHERE user_id = :test_user_id;
-- DELETE FROM product_variants WHERE product_id IN (:test_product_variants_id, :test_product_simple_id);
-- DELETE FROM products WHERE id IN (:test_product_variants_id, :test_product_simple_id);
-- DELETE FROM addresses WHERE user_id = :test_user_id;
-- DELETE FROM categories WHERE id = :test_category_id;
-- DELETE FROM brands WHERE id = :test_brand_id;
-- DELETE FROM "User" WHERE id = :test_user_id;
-- COMMIT;
-- \echo '🗑️  Datos de prueba eliminados'
