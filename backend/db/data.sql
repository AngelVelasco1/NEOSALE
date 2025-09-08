-- 1. LIMPIEZA DE TABLAS EN ORDEN INVERSO DE DEPENDENCIAS
DELETE FROM review_images;
DELETE FROM favorites;
DELETE FROM order_logs;
DELETE FROM order_items;
DELETE FROM cart_items;
DELETE FROM images;
DELETE FROM reviews;
DELETE FROM "Account";
DELETE FROM product_variants;
DELETE FROM orders;
DELETE FROM cart;
DELETE FROM addresses;
DELETE FROM products;
DELETE FROM coupons;
DELETE FROM category_subcategory;
DELETE FROM categories;
DELETE FROM subcategories;
DELETE FROM brands;
DELETE FROM "User";

-- 2. REINICIO DE SECUENCIAS
ALTER SEQUENCE subcategories_id_seq RESTART WITH 1;
ALTER SEQUENCE categories_id_seq RESTART WITH 1;
ALTER SEQUENCE brands_id_seq RESTART WITH 1;
ALTER SEQUENCE "User_id_seq" RESTART WITH 1;
ALTER SEQUENCE products_id_seq RESTART WITH 1;
ALTER SEQUENCE product_variants_id_seq RESTART WITH 1;
ALTER SEQUENCE images_id_seq RESTART WITH 1;
ALTER SEQUENCE addresses_id_seq RESTART WITH 1;
ALTER SEQUENCE cart_id_seq RESTART WITH 1;
ALTER SEQUENCE cart_items_id_seq RESTART WITH 1;
ALTER SEQUENCE orders_id_seq RESTART WITH 1;
ALTER SEQUENCE order_items_id_seq RESTART WITH 1;
ALTER SEQUENCE order_logs_id_seq RESTART WITH 1;
ALTER SEQUENCE coupons_id_seq RESTART WITH 1;
ALTER SEQUENCE favorites_id_seq RESTART WITH 1;
ALTER SEQUENCE review_images_id_seq RESTART WITH 1;
ALTER SEQUENCE reviews_id_seq RESTART WITH 1;

-- 3. HABILITAR EXTENSIÓN PARA HASH DE CONTRASEÑAS
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ========================================
-- INSERCIÓN DE DATOS
-- ========================================

-- 4. SUBCATEGORÍAS
INSERT INTO subcategories (name, active) VALUES 
('Camisas deportivas', TRUE), ('Pantalones deportivos', TRUE), ('Calzado running', TRUE), ('Accesorios fitness', TRUE),
('Ropa casual', TRUE), ('Electrónicos móviles', TRUE), ('Computadores', TRUE), ('Audio y Video', TRUE),
('Gaming', TRUE), ('Electrodomésticos', TRUE), ('Muebles Sala', TRUE), ('Muebles Dormitorio', TRUE),
('Decoración Hogar', TRUE), ('Smartphones', TRUE), ('Tablets', TRUE);

-- 5. CATEGORÍAS
INSERT INTO categories (name, description, id_subcategory, active) VALUES 
('Ropa Deportiva', 'Prendas para actividades deportivas y ejercicio', 1, TRUE),
('Pantalones Deportivos', 'Pantalones y shorts para deporte', 2, TRUE),
('Calzado Deportivo', 'Zapatos para running y ejercicio', 3, TRUE),
('Accesorios Deportivos', 'Complementos para fitness y entrenamiento', 4, TRUE),
('Ropa Casual', 'Vestimenta para uso diario y comodidad', 5, TRUE),
('Tecnología Móvil', 'Dispositivos móviles inteligentes', 6, TRUE),
('Computación', 'Equipos de cómputo personal y profesional', 7, TRUE),
('Audio y Video', 'Equipos de sonido y entretenimiento', 8, TRUE),
('Gaming', 'Consolas y videojuegos', 9, TRUE),
('Electrodomésticos', 'Aparatos para el hogar', 10, TRUE),
('Muebles Sala', 'Mobiliario para sala de estar', 11, TRUE),
('Muebles Dormitorio', 'Mobiliario para habitaciones', 12, TRUE),
('Decoración', 'Artículos decorativos para el hogar', 13, TRUE);

-- 6. RELACIONES CATEGORÍA-SUBCATEGORÍA
INSERT INTO category_subcategory (category_id, subcategory_id, active) VALUES
(1, 1, TRUE), (2, 2, TRUE), (3, 3, TRUE), (4, 4, TRUE), (5, 5, TRUE), (6, 6, TRUE),
(6, 14, TRUE), (6, 15, TRUE), (7, 7, TRUE), (8, 8, TRUE), (9, 9, TRUE), (10, 10, TRUE),
(11, 11, TRUE), (12, 12, TRUE), (13, 13, TRUE);

-- 7. MARCAS
INSERT INTO brands (name, description, image_url, active) VALUES 
('Nike', 'Marca líder mundial en ropa y calzado deportivo', 'https://example.com/nike-logo.png', TRUE),
('Adidas', 'Marca alemana de artículos deportivos y lifestyle', 'https://example.com/adidas-logo.png', TRUE),
('Puma', 'Marca alemana de ropa deportiva y calzado', 'https://example.com/puma-logo.png', TRUE),
('Apple', 'Compañía tecnológica líder en innovación', 'https://example.com/apple-logo.png', TRUE),
('Samsung', 'Conglomerado multinacional surcoreano de tecnología', 'https://example.com/samsung-logo.png', TRUE),
('Sony', 'Multinacional japonesa de electrónicos y entretenimiento', 'https://example.com/sony-logo.png', TRUE),
('LG', 'Conglomerado surcoreano de electrodomésticos', 'https://example.com/lg-logo.png', TRUE),
('IKEA', 'Empresa sueca de muebles y decoración', 'https://example.com/ikea-logo.png', TRUE);

-- 8. USUARIOS
INSERT INTO "User" (name, email, email_verified, password, phone_number, identification, identification_type, role, active, email_notifications) VALUES
('Angel García', 'angel.admin@neosale.com', '2023-10-01 10:00:00', crypt('Admin123!', gen_salt('bf', 12)), '3001234567', '123456789', 'CC', 'admin', TRUE, TRUE),
('María López', 'maria.admin@neosale.com', '2023-10-02 10:00:00', crypt('Admin123!', gen_salt('bf', 12)), '3012345678', '987654321', 'CC', 'admin', TRUE, TRUE),
('Super Admin', 'super@neosale.com', '2023-09-01 08:00:00', crypt('Super123!', gen_salt('bf', 12)), '3000000001', '111111111', 'CC', 'super_admin', TRUE, TRUE),
('Carlos Rodríguez', 'carlos.rodriguez@email.com', '2023-11-15 14:30:00', crypt('User123!', gen_salt('bf', 12)), '3023456789', '1087654321', 'CC', 'user', TRUE, TRUE),
('Ana Martínez', 'ana.martinez@email.com', '2023-11-20 09:15:00', crypt('User456!', gen_salt('bf', 12)), '3034567890', '1076543210', 'CC', 'user', TRUE, TRUE),
('Luis Fernández', 'luis.fernandez@email.com', '2023-12-01 16:45:00', crypt('User789!', gen_salt('bf', 12)), '3045678901', '1065432109', 'CE', 'user', TRUE, FALSE),
('Sofia Herrera', 'sofia.herrera@email.com', '2023-12-05 11:20:00', crypt('User101!', gen_salt('bf', 12)), '3056789012', '1054321098', 'CC', 'user', TRUE, TRUE),
('Diego Morales', 'diego.morales@email.com', '2023-12-10 13:10:00', crypt('User202!', gen_salt('bf', 12)), '3067890123', '1043210987', 'CC', 'user', TRUE, TRUE);

-- 9. CUPONES
INSERT INTO coupons (code, name, discount_type, discount_value, min_purchase_amount, usage_limit, expires_at, created_by) VALUES
('WELCOME10', '10% Descuento de Bienvenida', 'percentage', 10.00, 50000, 1, '2026-12-31 23:59:59', 1),
('FREESHIP', 'Envío Gratis', 'fixed', 15000, 100000, 100, '2026-12-31 23:59:59', 1),
('TECH20', '20% en Tecnología', 'percentage', 20.00, 1000000, 50, '2026-10-31 23:59:59', 1),
('EXPIRED', 'Cupón Vencido', 'percentage', 50.00, 0, 10, '2026-01-01 00:00:00', 1);

-- 10. PRODUCTOS
INSERT INTO products (name, description, price, stock, weight_grams, sizes, base_discount, category_id, brand_id, active, in_offer, offer_discount, offer_start_date, offer_end_date, created_by, updated_by) VALUES
('Camiseta Dry-Fit Pro', 'Camiseta deportiva de alto rendimiento', 89000, 0, 250, 'XS,S,M,L,XL,XXL', 0, 1, 1, TRUE, TRUE, 20.0, '2024-08-01 00:00:00', '2025-12-31 23:59:59', 1, 1),
('Pantaloneta Running Elite', 'Pantaloneta liviana para running', 75000, 0, 200, 'S,M,L,XL', 0, 2, 1, TRUE, FALSE, NULL, NULL, NULL, 1, 1),
('Camiseta Training Adidas', 'Camiseta de entrenamiento transpirable', 95000, 0, 300, 'S,M,L,XL,XXL', 0, 1, 2, TRUE, TRUE, 15.0, '2024-08-15 00:00:00', '2025-12-31 23:59:59', 1, 1),
('Leggings Deportivos', 'Leggings de compresión para mujer', 120000, 0, 350, 'XS,S,M,L,XL', 0, 2, 3, TRUE, FALSE, NULL, NULL, NULL, 1, 1),
('Chaqueta Deportiva Puma', 'Chaqueta resistente al viento', 180000, 0, 800, 'S,M,L,XL', 0, 1, 3, TRUE, TRUE, 30.0, '2024-09-01 00:00:00', '2025-12-31 23:59:59', 1, 1),
('Tenis Running Nike Air', 'Tenis de running con amortiguación Air Max', 320000, 0, 900, '36,37,38,39,40,41,42,43,44', 0, 3, 1, TRUE, FALSE, NULL, NULL, NULL, 1, 1),
('Tenis Training Adidas', 'Tenis versátiles para entrenamiento', 280000, 0, 850, '37,38,39,40,41,42,43', 0, 3, 2, TRUE, TRUE, 25.0, '2024-08-20 00:00:00', '2025-12-31 23:59:59', 1, 1),
('iPhone 15 Pro', 'Smartphone Apple con chip A17 Pro', 4200000, 0, 190, 'Único', 0, 6, 4, TRUE, TRUE, 10.0, '2024-08-01 00:00:00', '2025-12-31 23:59:59', 1, 1),
('Samsung Galaxy S24', 'Smartphone Samsung con Dynamic AMOLED 2X', 3800000, 0, 210, 'Único', 0, 6, 5, TRUE, FALSE, NULL, NULL, NULL, 1, 1),
('MacBook Air M2', 'Laptop Apple con pantalla Liquid Retina', 5500000, 0, 1240, 'Único', 0, 7, 4, TRUE, FALSE, NULL, NULL, NULL, 1, 1),
('AirPods Pro 2', 'Audífonos inalámbricos con cancelación de ruido', 850000, 0, 50, 'Único', 0, 8, 4, TRUE, TRUE, 20.0, '2024-08-10 00:00:00', '2025-12-31 23:59:59', 1, 1),
('PlayStation 5', 'Consola de videojuegos con SSD ultra-rápido', 2800000, 0, 4500, 'Único', 0, 9, 6, TRUE, FALSE, NULL, NULL, NULL, 1, 1),
('Smart TV LG 55"', 'Televisor LG 55" 4K UHD con webOS', 1800000, 0, 15000, 'Único', 0, 8, 7, TRUE, TRUE, 35.0, '2024-09-01 00:00:00', '2025-12-31 23:59:59', 1, 1),
('Sofá Modular IKEA', 'Sofá modular de 3 puestos en tela gris', 1200000, 0, 45000, 'Único', 0, 11, 8, TRUE, FALSE, NULL, NULL, NULL, 1, 1),
('Cama King Size', 'Cama king size en madera maciza', 950000, 0, 60000, 'Único', 0, 12, 8, TRUE, TRUE, 40.0, '2024-08-25 00:00:00', '2025-12-31 23:59:59', 1, 1),
('Producto Descontinuado', 'Este producto ya no está disponible', 50000, 0, 100, 'Único', 0, 5, 1, FALSE, FALSE, NULL, NULL, NULL, 1, 1);

-- 11. VARIANTES DE PRODUCTOS
INSERT INTO product_variants (product_id, color_code, size, stock, sku, price, weight_grams, active) VALUES
-- Camiseta Dry-Fit Pro (ID: 1) - Con oferta
(1, '#000000', 'M', 10, 'NIKE-DRYFIT-BLACK-M', 71200, 250, TRUE),
(1, '#FFFFFF', 'M', 9, 'NIKE-DRYFIT-WHITE-M', 71200, 250, TRUE),
(1, '#FF0000', 'L', 10, 'NIKE-DRYFIT-RED-L', 71200, 250, TRUE),
-- Pantaloneta Running Elite (ID: 2) - Sin oferta
(2, '#000000', 'M', 12, 'NIKE-SHORTS-BLACK-M', 75000, 200, TRUE),
(2, '#0066CC', 'L', 7, 'NIKE-SHORTS-BLUE-L', 75000, 200, TRUE),
-- Camiseta Training Adidas (ID: 3) - Con oferta
(3, '#FF6B6B', 'M', 10, 'ADIDAS-TRAIN-RED-M', 80750, 300, TRUE),
-- Leggings Deportivos (ID: 4)
(4, '#4ECDC4', 'S', 7, 'PUMA-LEGGINGS-TEAL-S', 120000, 350, TRUE),
-- Chaqueta Deportiva Puma (ID: 5) - Con oferta
(5, '#45B7D1', 'M', 5, 'PUMA-JACKET-BLUE-M', 126000, 800, TRUE),
-- Tenis Running Nike Air (ID: 6)
(6, '#000000', '40', 6, 'NIKE-AIR-BLACK-40', 320000, 900, TRUE),
(6, '#FFFFFF', '40', 5, 'NIKE-AIR-WHITE-40', 320000, 900, TRUE),
-- Tenis Training Adidas (ID: 7) - Con oferta
(7, '#96CEB4', '39', 5, 'ADIDAS-TRAIN-GREEN-39', 210000, 850, TRUE),
-- iPhone 15 Pro (ID: 8) - Con oferta
(8, '#8E8E93', 'Único', 5, 'IPHONE15-TITANIUM-NATURAL', 3780000, 190, TRUE),
-- Samsung Galaxy S24 (ID: 9)
(9, '#000000', 'Único', 8, 'GALAXY-S24-BLACK', 3800000, 210, TRUE),
-- MacBook Air M2 (ID: 10)
(10, '#FFEAA7', 'Único', 10, 'MACBOOK-AIR-M2-GOLD', 5500000, 1240, TRUE),
-- AirPods Pro 2 (ID: 11) - Con oferta
(11, '#FFFFFF', 'Único', 40, 'AIRPODS-PRO2-WHITE', 680000, 50, TRUE),
-- PlayStation 5 (ID: 12)
(12, '#FFFFFF', 'Único', 8, 'PS5-WHITE', 2800000, 4500, TRUE),
-- Smart TV LG 55" (ID: 13) - Con oferta
(13, '#000000', 'Único', 12, 'LG-TV-55-BLACK', 1170000, 15000, TRUE),
-- Sofá Modular IKEA (ID: 14)
(14, '#F0E68C', 'Único', 5, 'IKEA-SOFA-BEIGE', 1200000, 45000, TRUE),
-- Cama King Size (ID: 15) - Con oferta
(15, '#CD853F', 'Único', 8, 'IKEA-BED-BROWN', 570000, 60000, TRUE),
-- Producto Descontinuado (ID: 16) - Inactivo
(16, '#808080', 'Único', 0, 'DISCONTINUED-GRAY', 50000, 100, FALSE);

-- 12. IMÁGENES DE PRODUCTOS
INSERT INTO images (image_url, color_code, color, is_primary, product_id, variant_id) VALUES
('https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/61734ec7-dad8-40f3-9b95-c7500939150a/dri-fit-miler-mens-running-top-M0D4QV.png', '#000000', 'Negro', TRUE, 1, 1),
('https://via.placeholder.com/500x500/FF6B6B/FFFFFF?text=Adidas+Training', '#FF6B6B', 'Rojo', TRUE, 3, 6),
('https://images.unsplash.com/photo-1511707171634-5f897ff02aa9', '#8E8E93', 'Titanio Natural', TRUE, 8, 12),
('https://m.media-amazon.com/images/I/61UxfXTUyvL._AC_UF1000,1000_QL80_.jpg', '#FFFFFF', 'Blanco', TRUE, 12, 16);

-- 13. DIRECCIONES DE USUARIOS
INSERT INTO addresses (address, country, city, department, is_default, user_id) VALUES 
('Carrera 27 #34-56, Cabecera', 'Colombia', 'Bucaramanga', 'Santander', TRUE, 1),
('Avenida El Poblado #12-34', 'Colombia', 'Medellín', 'Antioquia', TRUE, 2),
('Calle 100 #25-50, Zona Rosa', 'Colombia', 'Bogotá', 'Cundinamarca', TRUE, 3),
('Calle 26 #47-89, Zona Rosa', 'Colombia', 'Bogotá', 'Cundinamarca', TRUE, 4),
('Avenida 6 #23-45, San Fernando', 'Colombia', 'Cali', 'Valle del Cauca', TRUE, 5),
('Calle 70 #11-89, Zona Norte', 'Colombia', 'Barranquilla', 'Atlántico', TRUE, 6),
('Calle 85 #15-34, Chapinero', 'Colombia', 'Bogotá', 'Cundinamarca', TRUE, 7),
('Carrera 7 #123-45, Zona T', 'Colombia', 'Bogotá', 'Cundinamarca', TRUE, 8);

-- 14. CARRITOS DE COMPRAS
INSERT INTO cart (user_id, session_token, subtotal, expires_at) VALUES
(4, NULL, 391200, '2025-09-30 23:59:59'), -- Carlos Rodríguez
(5, NULL, 3900000, '2025-09-30 23:59:59'), -- Ana Martínez
(NULL, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 71200, '2025-09-05 23:59:59'); -- Carrito anónimo

-- 15. ITEMS EN CARRITOS
INSERT INTO cart_items (cart_id, product_id, quantity, unit_price, color_code, size) VALUES
(1, 1, 1, 71200, '#000000', 'M'),
(1, 6, 1, 320000, '#000000', '40'),
(2, 4, 1, 120000, '#4ECDC4', 'S'),
(2, 8, 1, 3780000, '#8E8E93', 'Único'),
(3, 1, 1, 71200, '#FF0000', 'L');

-- 16. ÓRDENES
INSERT INTO orders (status, subtotal, discount, shipping_cost, taxes, total, payment_method, payment_status, transaction_id, paid_at, shipping_address_id, user_note, user_id, coupon_id, updated_by) VALUES
('delivered', 391200, 39120, 15000, 64252.8, 431332.8, 'mercadopago', 'paid', 'MP-12345678901', '2024-08-25 14:30:00', 4, 'Entregar en horario de oficina', 4, 1, 1),
('processing', 120000, 0, 12000, 19200, 151200, 'credit_card', 'paid', 'CC-98765432109', '2024-08-28 09:15:00', 5, NULL, 5, NULL, 1),
('pending', 71200, 0, 8000, 11392, 90592, 'pse', 'pending', NULL, NULL, 7, NULL, 7, NULL, 7);

-- 17. ITEMS DE ÓRDENES
INSERT INTO order_items (price, quantity, subtotal, product_id, order_id) VALUES
(71200, 1, 71200, 1, 1),
(320000, 1, 320000, 6, 1),
(120000, 1, 120000, 4, 2),
(71200, 1, 71200, 1, 3);

-- 18. LOGS DE ÓRDENES
INSERT INTO order_logs (previous_status, new_status, note, order_id, updated_by, user_type) VALUES
('pending', 'confirmed', 'Orden confirmada automáticamente', 1, 1, 'system'),
('confirmed', 'processing', 'Iniciando preparación del pedido', 1, 1, 'admin'),
('processing', 'shipped', 'Pedido enviado con transportadora TCC', 1, 1, 'admin'),
('shipped', 'delivered', 'Pedido entregado exitosamente', 1, 1, 'system'),
('pending', 'confirmed', 'Orden confirmada y pago verificado', 2, 1, 'admin'),
('pending', 'pending', 'Esperando confirmación de pago PSE', 3, 1, 'system');

-- 19. FAVORITOS DE USUARIOS
INSERT INTO favorites (user_id, product_id) VALUES
(4, 8), (4, 12), (5, 1), (6, 6), (7, 4);

UPDATE products SET stock = (
    SELECT COALESCE(SUM(pv.stock), 0)
    FROM product_variants pv
    WHERE pv.product_id = products.id AND pv.active = TRUE
);
update products SET base_discount = 20 where price = 89000;
