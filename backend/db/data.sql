-- Limpiar datos existentes (en orden correcto de dependencias)
DELETE FROM review_images;
DELETE FROM favorites;
DELETE FROM order_logs;
DELETE FROM order_items;
DELETE FROM cart_items;
DELETE FROM cart;
DELETE FROM orders;
DELETE FROM images;
DELETE FROM product_variants;
DELETE FROM products;
DELETE FROM coupons;
DELETE FROM category_subcategory;
DELETE FROM categories;
DELETE FROM subcategories;
DELETE FROM brands;
DELETE FROM addresses;
DELETE FROM "Account";
DELETE FROM "User";

-- Reiniciar secuencias
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

-- Habilitar extensión para hash de contraseñas
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. SUBCATEGORÍAS
INSERT INTO subcategories (name, active) VALUES 
('Camisas deportivas', TRUE),
('Pantalones deportivos', TRUE),
('Calzado running', TRUE),
('Accesorios fitness', TRUE),
('Ropa casual', TRUE),
('Electrónicos móviles', TRUE),
('Computadores', TRUE),
('Audio y Video', TRUE),
('Gaming', TRUE),
('Electrodomésticos', TRUE),
('Muebles Sala', TRUE),
('Muebles Dormitorio', TRUE),
('Decoración Hogar', TRUE),
('Smartphones', TRUE),
('Tablets', TRUE);

-- 2. CATEGORÍAS
INSERT INTO categories (name, description, id_subcategory, active) VALUES 
('Ropa Deportiva', 'Prendas para actividades deportivas', 1, TRUE),
('Ropa Deportiva', 'Pantalones y shorts para deporte', 2, TRUE),
('Calzado Deportivo', 'Zapatos para running y ejercicio', 3, TRUE),
('Accesorios Deportivos', 'Complementos para fitness', 4, TRUE),
('Ropa Casual', 'Vestimenta para uso diario', 5, TRUE),
('Tecnología Móvil', 'Dispositivos móviles inteligentes', 6, TRUE),
('Computación', 'Equipos de cómputo personal', 7, TRUE),
('Audio y Video', 'Equipos de sonido y entretenimiento', 8, TRUE),
('Gaming', 'Consolas y videojuegos', 9, TRUE),
('Electrodomésticos', 'Aparatos para el hogar', 10, TRUE),
('Muebles Sala', 'Mobiliario para sala de estar', 11, TRUE),
('Muebles Dormitorio', 'Mobiliario para habitaciones', 12, TRUE),
('Decoración', 'Artículos decorativos', 13, TRUE);

-- 3. MARCAS
INSERT INTO brands (name, description, image_url, active) VALUES 
('Nike', 'Marca líder en ropa y calzado deportivo', 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/61734ec7-dad8-40f3-9b95-c7500939150a/dri-fit-miler-mens-running-top-M0D4QV.png', TRUE),
('Adidas', 'Marca alemana de artículos deportivos', 'https://m.media-amazon.com/images/I/61pK9bZl+GL._AC_UF1000,1000_QL80_.jpg', TRUE),
('Puma', 'Marca alemana de ropa deportiva', 'https://m.media-amazon.com/images/I/61v5ZtQ+1lL._AC_UF1000,1000_QL80_.jpg', TRUE),
('Under Armour', 'Marca estadounidense de ropa deportiva', 'https://m.media-amazon.com/images/I/71v6i5p9ZTL._AC_UF1000,1000_QL80_.jpg', TRUE),
('Apple', 'Compañía tecnológica estadounidense', 'https://m.media-amazon.com/images/I/71yzJoE7WlL._AC_UF1000,1000_QL80_.jpg', TRUE),
('Samsung', 'Conglomerado multinacional surcoreano', 'https://m.media-amazon.com/images/I/71w8c8AywJL._AC_UF1000,1000_QL80_.jpg', TRUE),
('Sony', 'Multinacional japonesa de electrónicos', 'https://m.media-amazon.com/images/I/61UxfXTUyvL._AC_UF1000,1000_QL80_.jpg', TRUE),
('LG', 'Conglomerado multinacional surcoreano', 'https://www.lg.com/content/dam/channel/wcms/latin/images/tvs/55up7750psb_awm_eail_latin_01.jpg', TRUE),
('IKEA', 'Empresa sueca de muebles', 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4', TRUE),
('Zara', 'Cadena española de moda', 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f', TRUE);

-- 4. USUARIOS
INSERT INTO "User" (name, email, email_verified, password, phone_number, identification, identification_type, role, active, email_notifications) VALUES
-- Administradores
('Angel García', 'angel.admin@neosale.com', '2023-10-01 10:00:00', crypt('Admin123!', gen_salt('bf', 12)), '3001234567', '1234567890', 'CC', 'admin', TRUE, TRUE),
('María López', 'maria.admin@neosale.com', '2023-10-02 10:00:00', crypt('Admin123!', gen_salt('bf', 12)), '3012345678', '1098765432', 'CC', 'admin', TRUE, TRUE),

-- Usuarios regulares
('Carlos Rodríguez', 'carlos.rodriguez@email.com', '2023-11-15 14:30:00', crypt('User123!', gen_salt('bf', 12)), '3023456789', '1087654321', 'CC', 'user', TRUE, TRUE),
('Ana Martínez', 'ana.martinez@email.com', '2023-11-20 09:15:00', crypt('User456!', gen_salt('bf', 12)), '3034567890', '1076543210', 'CC', 'user', TRUE, TRUE),
('Luis Fernández', 'luis.fernandez@email.com', '2023-12-01 16:45:00', crypt('User789!', gen_salt('bf', 12)), '3045678901', '1065432109', 'CE', 'user', TRUE, FALSE),
('Sofia Herrera', 'sofia.herrera@email.com', '2023-12-05 11:20:00', crypt('User101!', gen_salt('bf', 12)), '3056789012', '1054321098', 'CC', 'user', TRUE, TRUE),
('Diego Morales', 'diego.morales@email.com', '2023-12-10 13:10:00', crypt('User202!', gen_salt('bf', 12)), '3067890123', '1043210987', 'CC', 'user', TRUE, TRUE),
('Valentina Cruz', 'valentina.cruz@email.com', '2023-12-15 15:30:00', crypt('User303!', gen_salt('bf', 12)), '3078901234', '1032109876', 'PP', 'user', TRUE, TRUE),
('Andrés Vargas', 'andres.vargas@email.com', '2023-12-20 08:45:00', crypt('User404!', gen_salt('bf', 12)), '3089012345', '1021098765', 'CC', 'user', TRUE, FALSE),
('Isabella Reyes', 'isabella.reyes@email.com', '2023-12-25 12:00:00', crypt('User505!', gen_salt('bf', 12)), '3090123456', '1010987654', 'CC', 'user', TRUE, TRUE),
('Mateo Jiménez', 'mateo.jimenez@email.com', '2024-01-01 10:00:00', crypt('User606!', gen_salt('bf', 12)), '3101234567', '1009876543', 'CE', 'user', TRUE, TRUE),
('Camila Torres', 'camila.torres@email.com', '2024-01-05 14:20:00', crypt('User707!', gen_salt('bf', 12)), '3112345678', '1008765432', 'CC', 'user', FALSE, TRUE); -- Usuario inactivo para testing

-- 5. CUPONES DE DESCUENTO
INSERT INTO coupons (code, name, discount_type, discount_value, min_purchase_amount, usage_limit, usage_count, active, created_by, expires_at) VALUES
('WELCOME10', 'Descuento de Bienvenida', 'percentage', 10.00, 50000, 100, 5, TRUE, 1, '2025-12-31 23:59:59'),
('BLACKFRIDAY', 'Black Friday 2024', 'percentage', 25.00, 100000, 500, 25, TRUE, 1, '2024-12-01 23:59:59'),
('FREESHIP', 'Envío Gratis', 'fixed', 15000.00, 80000, 200, 8, TRUE, 1, '2025-06-30 23:59:59'),
('TECH20', 'Descuento Tecnología', 'percentage', 20.00, 200000, 50, 12, TRUE, 2, '2024-12-31 23:59:59'),
('EXPIRED', 'Cupón Vencido', 'percentage', 15.00, 30000, 10, 0, FALSE, 1, '2023-12-31 23:59:59'); -- Cupón vencido para testing

-- 6. PRODUCTOS (stock será calculado automáticamente desde variants)
INSERT INTO products (name, description, price, stock, weight_grams, sizes, base_discount, category_id, brand_id, active, in_offer, offer_discount, offer_start_date, offer_end_date, created_by, updated_by) VALUES
-- PRODUCTOS DEPORTIVOS
('Camiseta Dry-Fit Pro', 'Camiseta deportiva de alto rendimiento con tecnología de absorción de sudor. Ideal para entrenamientos intensos.', 89000, 0, 250, 'XS,S,M,L,XL,XXL', 15.0, 1, 1, TRUE, TRUE, 20.0, '2024-08-01 00:00:00', '2024-12-31 23:59:59', 1, 1),
('Pantaloneta Running Elite', 'Pantaloneta liviana para running con bolsillos laterales y tecnología anti-rozadura.', 75000, 0, 200, 'S,M,L,XL', 0.0, 2, 1, TRUE, FALSE, NULL, NULL, NULL, 1, 1),
('Camiseta Training Adidas', 'Camiseta de entrenamiento con diseño moderno y tela transpirable.', 95000, 0, 300, 'S,M,L,XL,XXL', 20.0, 1, 2, TRUE, TRUE, 15.0, '2024-08-15 00:00:00', '2024-11-30 23:59:59', 1, 1),
('Leggings Deportivos', 'Leggings de compresión para mujer con cintura alta y control de abdomen.', 120000, 0, 350, 'XS,S,M,L,XL', 10.0, 2, 3, TRUE, FALSE, NULL, NULL, NULL, 1, 1),
('Chaqueta Deportiva Puma', 'Chaqueta resistente al viento con capucha ajustable y bolsillos con cierre.', 180000, 0, 800, 'S,M,L,XL', 25.0, 1, 3, TRUE, TRUE, 30.0, '2024-09-01 00:00:00', '2024-12-15 23:59:59', 1, 1),

-- CALZADO DEPORTIVO
('Tenis Running Nike Air', 'Tenis de running con amortiguación avanzada Air Max y suela antideslizante.', 320000, 0, 900, '36,37,38,39,40,41,42,43,44', 12.0, 3, 1, TRUE, FALSE, NULL, NULL, NULL, 1, 1),
('Tenis Training Adidas', 'Tenis versátiles para entrenamiento con soporte lateral y suela de goma.', 280000, 0, 850, '37,38,39,40,41,42,43', 18.0, 3, 2, TRUE, TRUE, 25.0, '2024-08-20 00:00:00', '2024-10-31 23:59:59', 1, 1),

-- ELECTRÓNICOS (estos no tienen variantes de color/size tradicionales)
('iPhone 15 Pro', 'Smartphone Apple iPhone 15 Pro con chip A17 Pro y cámara de 48MP.', 4200000, 0, 190, 'Único', 5.0, 6, 5, TRUE, TRUE, 10.0, '2024-08-01 00:00:00', '2024-12-25 23:59:59', 1, 1),
('Samsung Galaxy S24', 'Smartphone Samsung Galaxy S24 con pantalla Dynamic AMOLED 2X.', 3800000, 0, 210, 'Único', 8.0, 6, 6, TRUE, FALSE, NULL, NULL, NULL, 1, 1),
('MacBook Air M2', 'Laptop Apple MacBook Air M2 con pantalla Liquid Retina de 13 pulgadas.', 5500000, 0, 1240, 'Único', 0.0, 7, 5, TRUE, FALSE, NULL, NULL, NULL, 1, 1),
('AirPods Pro 2', 'Audífonos inalámbricos Apple con cancelación activa de ruido.', 850000, 0, 50, 'Único', 15.0, 8, 5, TRUE, TRUE, 20.0, '2024-08-10 00:00:00', '2024-11-15 23:59:59', 1, 1),
('PlayStation 5', 'Consola de videojuegos Sony PlayStation 5 con SSD ultra-rápido.', 2800000, 0, 4500, 'Único', 0.0, 9, 7, TRUE, FALSE, NULL, NULL, NULL, 1, 1),

-- ELECTRODOMÉSTICOS Y HOGAR
('Smart TV LG 55"', 'Televisor LG 55 pulgadas 4K UHD con webOS y inteligencia artificial.', 1800000, 0, 15000, 'Único', 30.0, 8, 8, TRUE, TRUE, 35.0, '2024-09-01 00:00:00', '2024-12-31 23:59:59', 1, 1),
('Sofá Modular IKEA', 'Sofá modular de 3 puestos en tela gris con cojines extraíbles.', 1200000, 0, 45000, 'Único', 22.0, 11, 9, TRUE, FALSE, NULL, NULL, NULL, 1, 1),
('Cama King Size', 'Cama matrimonial king size en madera maciza con cabecera tapizada.', 950000, 0, 60000, 'Único', 35.0, 12, 9, TRUE, TRUE, 40.0, '2024-08-25 00:00:00', '2024-12-20 23:59:59', 1, 1),

-- PRODUCTO INACTIVO PARA TESTING
('Producto Descontinuado', 'Este producto ya no está disponible', 50000, 0, 100, 'Único', 0.0, 5, 10, FALSE, FALSE, NULL, NULL, NULL, 1, 1);

-- 7. VARIANTES DE PRODUCTOS
INSERT INTO product_variants (product_id, color_code, size, stock, sku, price, weight_grams, active) VALUES
-- Camiseta Dry-Fit Pro (ID: 1) - Con ofertas flash
(1, '#000000', 'XS', 5, 'NIKE-DRYFIT-BLACK-XS', 71200, 250, TRUE), -- Precio con descuento de oferta
(1, '#000000', 'S', 8, 'NIKE-DRYFIT-BLACK-S', 71200, 250, TRUE),
(1, '#000000', 'M', 10, 'NIKE-DRYFIT-BLACK-M', 71200, 250, TRUE),
(1, '#000000', 'L', 12, 'NIKE-DRYFIT-BLACK-L', 71200, 250, TRUE),
(1, '#000000', 'XL', 8, 'NIKE-DRYFIT-BLACK-XL', 71200, 250, TRUE),
(1, '#000000', 'XXL', 5, 'NIKE-DRYFIT-BLACK-XXL', 71200, 250, TRUE),
(1, '#FFFFFF', 'XS', 4, 'NIKE-DRYFIT-WHITE-XS', 71200, 250, TRUE),
(1, '#FFFFFF', 'S', 7, 'NIKE-DRYFIT-WHITE-S', 71200, 250, TRUE),
(1, '#FFFFFF', 'M', 9, 'NIKE-DRYFIT-WHITE-M', 71200, 250, TRUE),
(1, '#FFFFFF', 'L', 11, 'NIKE-DRYFIT-WHITE-L', 71200, 250, TRUE),
(1, '#FFFFFF', 'XL', 6, 'NIKE-DRYFIT-WHITE-XL', 71200, 250, TRUE),
(1, '#FFFFFF', 'XXL', 3, 'NIKE-DRYFIT-WHITE-XXL', 71200, 250, TRUE),
(1, '#FF0000', 'XS', 3, 'NIKE-DRYFIT-RED-XS', 71200, 250, TRUE),
(1, '#FF0000', 'S', 6, 'NIKE-DRYFIT-RED-S', 71200, 250, TRUE),
(1, '#FF0000', 'M', 8, 'NIKE-DRYFIT-RED-M', 71200, 250, TRUE),
(1, '#FF0000', 'L', 10, 'NIKE-DRYFIT-RED-L', 71200, 250, TRUE),
(1, '#FF0000', 'XL', 5, 'NIKE-DRYFIT-RED-XL', 71200, 250, TRUE),
(1, '#FF0000', 'XXL', 2, 'NIKE-DRYFIT-RED-XXL', 71200, 250, TRUE),

-- Pantaloneta Running Elite (ID: 2) - Sin oferta
(2, '#000000', 'S', 8, 'NIKE-SHORTS-BLACK-S', 75000, 200, TRUE),
(2, '#000000', 'M', 12, 'NIKE-SHORTS-BLACK-M', 75000, 200, TRUE),
(2, '#000000', 'L', 10, 'NIKE-SHORTS-BLACK-L', 75000, 200, TRUE),
(2, '#000000', 'XL', 6, 'NIKE-SHORTS-BLACK-XL', 75000, 200, TRUE),
(2, '#0066CC', 'S', 5, 'NIKE-SHORTS-BLUE-S', 75000, 200, TRUE),
(2, '#0066CC', 'M', 8, 'NIKE-SHORTS-BLUE-M', 75000, 200, TRUE),
(2, '#0066CC', 'L', 7, 'NIKE-SHORTS-BLUE-L', 75000, 200, TRUE),
(2, '#0066CC', 'XL', 4, 'NIKE-SHORTS-BLUE-XL', 75000, 200, TRUE),

-- Camiseta Training Adidas (ID: 3) - Con oferta
(3, '#FF6B6B', 'S', 6, 'ADIDAS-TRAIN-RED-S', 80750, 300, TRUE), -- Precio con descuento de oferta
(3, '#FF6B6B', 'M', 10, 'ADIDAS-TRAIN-RED-M', 80750, 300, TRUE),
(3, '#FF6B6B', 'L', 8, 'ADIDAS-TRAIN-RED-L', 80750, 300, TRUE),
(3, '#FF6B6B', 'XL', 5, 'ADIDAS-TRAIN-RED-XL', 80750, 300, TRUE),
(3, '#FF6B6B', 'XXL', 3, 'ADIDAS-TRAIN-RED-XXL', 80750, 300, TRUE),

-- Leggings Deportivos (ID: 4)
(4, '#4ECDC4', 'XS', 4, 'PUMA-LEGGINGS-TEAL-XS', 120000, 350, TRUE),
(4, '#4ECDC4', 'S', 7, 'PUMA-LEGGINGS-TEAL-S', 120000, 350, TRUE),
(4, '#4ECDC4', 'M', 9, 'PUMA-LEGGINGS-TEAL-M', 120000, 350, TRUE),
(4, '#4ECDC4', 'L', 6, 'PUMA-LEGGINGS-TEAL-L', 120000, 350, TRUE),
(4, '#4ECDC4', 'XL', 4, 'PUMA-LEGGINGS-TEAL-XL', 120000, 350, TRUE),

-- Chaqueta Deportiva Puma (ID: 5) - Con oferta
(5, '#45B7D1', 'S', 3, 'PUMA-JACKET-BLUE-S', 126000, 800, TRUE), -- Precio con descuento de oferta
(5, '#45B7D1', 'M', 5, 'PUMA-JACKET-BLUE-M', 126000, 800, TRUE),
(5, '#45B7D1', 'L', 4, 'PUMA-JACKET-BLUE-L', 126000, 800, TRUE),
(5, '#45B7D1', 'XL', 2, 'PUMA-JACKET-BLUE-XL', 126000, 800, TRUE),

-- Tenis Running Nike Air (ID: 6)
(6, '#000000', '36', 2, 'NIKE-AIR-BLACK-36', 320000, 900, TRUE),
(6, '#000000', '37', 3, 'NIKE-AIR-BLACK-37', 320000, 900, TRUE),
(6, '#000000', '38', 4, 'NIKE-AIR-BLACK-38', 320000, 900, TRUE),
(6, '#000000', '39', 5, 'NIKE-AIR-BLACK-39', 320000, 900, TRUE),
(6, '#000000', '40', 6, 'NIKE-AIR-BLACK-40', 320000, 900, TRUE),
(6, '#000000', '41', 5, 'NIKE-AIR-BLACK-41', 320000, 900, TRUE),
(6, '#000000', '42', 4, 'NIKE-AIR-BLACK-42', 320000, 900, TRUE),
(6, '#000000', '43', 3, 'NIKE-AIR-BLACK-43', 320000, 900, TRUE),
(6, '#000000', '44', 2, 'NIKE-AIR-BLACK-44', 320000, 900, TRUE),
(6, '#FFFFFF', '36', 1, 'NIKE-AIR-WHITE-36', 320000, 900, TRUE),
(6, '#FFFFFF', '37', 2, 'NIKE-AIR-WHITE-37', 320000, 900, TRUE),
(6, '#FFFFFF', '38', 3, 'NIKE-AIR-WHITE-38', 320000, 900, TRUE),
(6, '#FFFFFF', '39', 4, 'NIKE-AIR-WHITE-39', 320000, 900, TRUE),
(6, '#FFFFFF', '40', 5, 'NIKE-AIR-WHITE-40', 320000, 900, TRUE),
(6, '#FFFFFF', '41', 4, 'NIKE-AIR-WHITE-41', 320000, 900, TRUE),
(6, '#FFFFFF', '42', 3, 'NIKE-AIR-WHITE-42', 320000, 900, TRUE),
(6, '#FFFFFF', '43', 2, 'NIKE-AIR-WHITE-43', 320000, 900, TRUE),
(6, '#FFFFFF', '44', 1, 'NIKE-AIR-WHITE-44', 320000, 900, TRUE),

-- Tenis Training Adidas (ID: 7) - Con oferta
(7, '#96CEB4', '37', 3, 'ADIDAS-TRAIN-GREEN-37', 210000, 850, TRUE), -- Precio con descuento de oferta
(7, '#96CEB4', '38', 4, 'ADIDAS-TRAIN-GREEN-38', 210000, 850, TRUE),
(7, '#96CEB4', '39', 5, 'ADIDAS-TRAIN-GREEN-39', 210000, 850, TRUE),
(7, '#96CEB4', '40', 6, 'ADIDAS-TRAIN-GREEN-40', 210000, 850, TRUE),
(7, '#96CEB4', '41', 5, 'ADIDAS-TRAIN-GREEN-41', 210000, 850, TRUE),
(7, '#96CEB4', '42', 4, 'ADIDAS-TRAIN-GREEN-42', 210000, 850, TRUE),
(7, '#96CEB4', '43', 3, 'ADIDAS-TRAIN-GREEN-43', 210000, 850, TRUE),

-- Electrónicos con variantes de color
-- iPhone 15 Pro (ID: 8) - Con oferta
(8, '#8E8E93', 'Único', 5, 'IPHONE15-TITANIUM-NATURAL', 3780000, 190, TRUE), -- Precio con descuento de oferta
(8, '#5E5CE6', 'Único', 4, 'IPHONE15-TITANIUM-BLUE', 3780000, 190, TRUE),
(8, '#F2F2F7', 'Único', 6, 'IPHONE15-TITANIUM-WHITE', 3780000, 190, TRUE),

-- Samsung Galaxy S24 (ID: 9)
(9, '#000000', 'Único', 8, 'GALAXY-S24-BLACK', 3800000, 210, TRUE),
(9, '#800080', 'Único', 6, 'GALAXY-S24-VIOLET', 3800000, 210, TRUE),

-- MacBook Air M2 (ID: 10)
(10, '#FFEAA7', 'Único', 10, 'MACBOOK-AIR-M2-GOLD', 5500000, 1240, TRUE),

-- AirPods Pro 2 (ID: 11) - Con oferta
(11, '#DDA0DD', 'Único', 40, 'AIRPODS-PRO2-WHITE', 680000, 50, TRUE), -- Precio con descuento de oferta

-- PlayStation 5 (ID: 12)
(12, '#FFFFFF', 'Único', 8, 'PS5-WHITE', 2800000, 4500, TRUE),

-- Smart TV LG 55" (ID: 13) - Con oferta
(13, '#000000', 'Único', 12, 'LG-TV-55-BLACK', 1170000, 15000, TRUE), -- Precio con descuento de oferta

-- Sofá Modular IKEA (ID: 14)
(14, '#F0E68C', 'Único', 5, 'IKEA-SOFA-BEIGE', 1200000, 45000, TRUE),

-- Cama King Size (ID: 15) - Con oferta
(15, '#CD853F', 'Único', 8, 'IKEA-BED-BROWN', 570000, 60000, TRUE), -- Precio con descuento de oferta

-- Producto Descontinuado (ID: 16) - Inactivo
(16, '#808080', 'Único', 0, 'DISCONTINUED-GRAY', 50000, 100, FALSE);

-- 8. IMÁGENES DE PRODUCTOS
INSERT INTO images (image_url, color_code, color, is_primary, product_id, variant_id) VALUES
-- Camiseta Dry-Fit Pro
('https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/61734ec7-dad8-40f3-9b95-c7500939150a/dri-fit-miler-mens-running-top-M0D4QV.png', '#000000', 'Negro', TRUE, 1, NULL),
('https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/2a8eb628-e25b-4b1b-9b1a-7b5c3d4e5f6g/dri-fit-miler-mens-running-top-M0D4QV.png', '#FFFFFF', 'Blanco', FALSE, 1, NULL),
('https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/3c9fc639-f36c-5c2c-ac2b-8c6d4e5f6g7h/dri-fit-miler-mens-running-top-M0D4QV.png', '#FF0000', 'Rojo', FALSE, 1, NULL),

-- Pantaloneta Running Elite
('https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/shorts-example-1.png', '#000000', 'Negro', TRUE, 2, NULL),
('https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/shorts-example-2.png', '#0066CC', 'Azul', FALSE, 2, NULL),

-- Camiseta Training Adidas
('https://via.placeholder.com/500x500/FF6B6B/FFFFFF?text=Adidas+Training', '#FF6B6B', 'Rojo', TRUE, 3, NULL),

-- Leggings Deportivos
('https://via.placeholder.com/500x500/4ECDC4/FFFFFF?text=Puma+Leggings', '#4ECDC4', 'Verde Agua', TRUE, 4, NULL),

-- Chaqueta Deportiva Puma
('https://via.placeholder.com/500x500/45B7D1/FFFFFF?text=Puma+Jacket', '#45B7D1', 'Azul', TRUE, 5, NULL),

-- Tenis Nike Air
('https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/air-max-example.png', '#000000', 'Negro', TRUE, 6, NULL),
('https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/air-max-example-white.png', '#FFFFFF', 'Blanco', FALSE, 6, NULL),

-- Tenis Training Adidas
('https://via.placeholder.com/500x500/96CEB4/FFFFFF?text=Adidas+Training', '#96CEB4', 'Verde', TRUE, 7, NULL),

-- iPhone 15 Pro
('https://images.unsplash.com/photo-1511707171634-5f897ff02aa9', '#8E8E93', 'Titanio Natural', TRUE, 8, NULL),
('https://images.unsplash.com/photo-1510557880182-3d4d3c1b9021', '#5E5CE6', 'Titanio Azul', FALSE, 8, NULL),
('https://images.unsplash.com/photo-1519125323398-675f0ddb6308', '#F2F2F7', 'Titanio Blanco', FALSE, 8, NULL),

-- Samsung Galaxy S24
('https://images.unsplash.com/photo-1517336714731-489689fd1ca8', '#000000', 'Negro', TRUE, 9, NULL),
('https://images.unsplash.com/photo-1465101046530-73398c7f28ca', '#800080', 'Violeta', FALSE, 9, NULL),

-- MacBook Air M2
('https://via.placeholder.com/500x500/FFEAA7/000000?text=MacBook+Air+M2', '#FFEAA7', 'Dorado', TRUE, 10, NULL),

-- AirPods Pro 2
('https://via.placeholder.com/500x500/DDA0DD/000000?text=AirPods+Pro+2', '#DDA0DD', 'Blanco', TRUE, 11, NULL),

-- PlayStation 5
('https://m.media-amazon.com/images/I/61UxfXTUyvL._AC_UF1000,1000_QL80_.jpg', '#FFFFFF', 'Blanco', TRUE, 12, NULL),

-- Smart TV LG
('https://www.lg.com/content/dam/channel/wcms/latin/images/tvs/55up7750psb_awm_eail_latin_01.jpg', '#000000', 'Negro', TRUE, 13, NULL),

-- Sofá Modular IKEA
('https://via.placeholder.com/500x500/F0E68C/000000?text=IKEA+Sofa', '#F0E68C', 'Beige', TRUE, 14, NULL),

-- Cama King Size
('https://via.placeholder.com/500x500/CD853F/FFFFFF?text=IKEA+Bed', '#CD853F', 'Café', TRUE, 15, NULL),

-- Producto Descontinuado
('https://via.placeholder.com/500x500/808080/FFFFFF?text=Discontinued', '#808080', 'Gris', TRUE, 16, NULL);

-- 9. DIRECCIONES DE USUARIOS
INSERT INTO addresses (address, country, city, department, is_default, user_id) VALUES 
-- Direcciones para Angel García (admin - ID: 1)
('Carrera 27 #34-56, Cabecera', 'Colombia', 'Bucaramanga', 'Santander', TRUE, 1),
('Calle 48 #29-45, Provenza', 'Colombia', 'Bucaramanga', 'Santander', FALSE, 1),

-- Direcciones para María López (admin - ID: 2)
('Avenida El Poblado #12-34', 'Colombia', 'Medellín', 'Antioquia', TRUE, 2),

-- Direcciones para Super Admin (ID: 3)
('Calle 100 #25-50, Zona Rosa', 'Colombia', 'Bogotá', 'Cundinamarca', TRUE, 3),

-- Direcciones para usuarios regulares
('Calle 26 #47-89, Zona Rosa', 'Colombia', 'Bogotá', 'Cundinamarca', TRUE, 4),
('Carrera 15 #45-67, Centro', 'Colombia', 'Bogotá', 'Cundinamarca', FALSE, 4),
('Avenida 6 #23-45, San Fernando', 'Colombia', 'Cali', 'Valle del Cauca', TRUE, 5),
('Calle 70 #11-89, Zona Norte', 'Colombia', 'Barranquilla', 'Atlántico', TRUE, 6),
('Carrera 50 #76-12, Laureles', 'Colombia', 'Medellín', 'Antioquia', FALSE, 6),
('Calle 85 #15-34, Chapinero', 'Colombia', 'Bogotá', 'Cundinamarca', TRUE, 7),
('Avenida Las Palmas #45-67', 'Colombia', 'Medellín', 'Antioquia', FALSE, 7),
('Carrera 7 #123-45, Zona T', 'Colombia', 'Bogotá', 'Cundinamarca', TRUE, 8),
('Calle 100 #89-12, Santa Bárbara', 'Colombia', 'Bogotá', 'Cundinamarca', TRUE, 9),
('Avenida Santander #67-89', 'Colombia', 'Bucaramanga', 'Santander', TRUE, 10),
('Carrera 43A #34-56, El Poblado', 'Colombia', 'Medellín', 'Antioquia', TRUE, 11),
('Calle 19 #45-67, La Candelaria', 'Colombia', 'Bogotá', 'Cundinamarca', TRUE, 12),
('Avenida 30 de Agosto #78-90', 'Colombia', 'Pereira', 'Risaralda', TRUE, 13);

-- 10. CARRITOS DE EJEMPLO
INSERT INTO cart (user_id, session_token, subtotal, expires_at) VALUES
(4, NULL, 409000, '2024-09-30 23:59:59'), -- Carlos Rodríguez
(5, NULL, 4320000, '2024-09-30 23:59:59'), -- Ana Martínez
(6, NULL, 126000, '2024-09-30 23:59:59'), -- Luis Fernández
(NULL, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 71200, '2024-09-05 23:59:59'), -- Carrito de sesión anónima
(NULL, 'b1ffcd11-1d1c-5fg9-cc7e-7cc1ce491b22', 320000, '2024-09-10 23:59:59'); -- Otro carrito anónimo

INSERT INTO cart_items (cart_id, product_id, quantity, unit_price, color_code, size) VALUES
-- Carrito de Carlos (ID: 1) - Total: 409,000
(1, 1, 2, 71200, '#000000', 'M'), -- 2 Camisetas Dry-Fit Pro con oferta = 142,400
(1, 6, 1, 320000, '#FFFFFF', '40'), -- 1 Tenis Nike Air = 320,000 (sin oferta)

-- Carrito de Ana (ID: 2) - Total: 4,320,000
(2, 4, 1, 120000, '#4ECDC4', 'S'), -- 1 Leggings = 120,000
(2, 8, 1, 3780000, '#8E8E93', 'Único'), -- 1 iPhone 15 Pro con oferta = 3,780,000

-- Carrito de Luis (ID: 3) - Total: 126,000
(3, 5, 1, 126000, '#45B7D1', 'M'), -- 1 Chaqueta Puma con oferta = 126,000

-- Carrito anónimo 1 (ID: 4) - Total: 71,200
(4, 1, 1, 71200, '#FF0000', 'L'), -- 1 Camiseta roja con oferta

-- Carrito anónimo 2 (ID: 5) - Total: 320,000
(5, 6, 1, 320000, '#000000', '42'); -- 1 Tenis Nike Air negro

-- 11. ÓRDENES DE EJEMPLO
INSERT INTO orders (status, subtotal, discount, shipping_cost, taxes, total, payment_method, payment_status, transaction_id, paid_at, shipping_address_id, user_note, user_id, coupon_id, updated_by) VALUES
-- Orden completada
('delivered', 409000, 20000, 15000, 65440, 469440, 'mercadopago', 'paid', 'MP-12345678901', '2024-08-25 14:30:00', 7, 'Entregar en horario de oficina', 4, 1, 1),

-- Orden en proceso
('processing', 120000, 0, 12000, 19200, 151200, 'credit_card', 'paid', 'CC-98765432109', '2024-08-28 09:15:00', 9, NULL, 5, NULL, 1),

-- Orden enviada
('shipped', 3780000, 378000, 0, 604800, 4006800, 'mercadopago', 'paid', 'MP-11223344556', '2024-08-29 16:45:00', 11, 'Producto frágil, manejar con cuidado', 6, 4, 1),

-- Orden pendiente
('pending', 71200, 0, 8000, 11392, 90592, 'pse', 'pending', NULL, NULL, 13, NULL, 7, NULL, 1),

-- Orden cancelada
('cancelled', 280000, 0, 15000, 44800, 339800, 'mercadopago', 'failed', 'MP-99887766554', NULL, 15, 'Cliente canceló por demora', 8, NULL, 2);

-- 12. ITEMS DE ÓRDENES
INSERT INTO order_items (price, quantity, subtotal, product_id, order_id) VALUES
-- Orden 1 (delivered) - Carlos
(71200, 2, 142400, 1, 1), -- 2 Camisetas Dry-Fit Pro
(320000, 1, 320000, 6, 1), -- 1 Tenis Nike Air

-- Orden 2 (processing) - Ana
(120000, 1, 120000, 4, 2), -- 1 Leggings

-- Orden 3 (shipped) - Luis
(3780000, 1, 3780000, 8, 3), -- 1 iPhone 15 Pro

-- Orden 4 (pending) - Sofia
(71200, 1, 71200, 1, 4), -- 1 Camiseta

-- Orden 5 (cancelled) - Diego
(210000, 1, 210000, 7, 5); -- 1 Tenis Training Adidas

-- 13. LOGS DE ÓRDENES
INSERT INTO order_logs (previous_status, new_status, note, order_id, updated_by, user_type) VALUES
-- Orden 1 logs
('pending', 'confirmed', 'Orden confirmada automáticamente', 1, 1, 'system'),
('confirmed', 'processing', 'Iniciando preparación del pedido', 1, 1, 'admin'),
('processing', 'shipped', 'Pedido enviado con transportadora TCC', 1, 1, 'admin'),
('shipped', 'delivered', 'Pedido entregado exitosamente', 1, 1, 'system'),

-- Orden 2 logs
('pending', 'confirmed', 'Orden confirmada y pago verificado', 2, 1, 'admin'),
('confirmed', 'processing', 'En preparación', 2, 1, 'admin'),

-- Orden 3 logs
('pending', 'confirmed', 'Pago aprobado por MercadoPago', 3, 1, 'system'),
('confirmed', 'processing', 'Verificando disponibilidad del producto', 3, 1, 'admin'),
('processing', 'shipped', 'Enviado con seguro especial para electrónicos', 3, 2, 'admin'),

-- Orden 4 logs
('pending', 'pending', 'Esperando confirmación de pago PSE', 4, 1, 'system'),

-- Orden 5 logs
('pending', 'cancelled', 'Pago rechazado por entidad bancaria', 5, 1, 'system');

-- 14. FAVORITOS DE USUARIOS
INSERT INTO favorites (user_id, product_id) VALUES
-- Carlos (ID: 4)
(4, 8), -- iPhone 15 Pro
(4, 12), -- PlayStation 5
(4, 13), -- Smart TV LG

-- Ana (ID: 5)
(5, 1), -- Camiseta Dry-Fit Pro
(5, 3), -- Camiseta Training Adidas
(5, 11), -- AirPods Pro 2

-- Luis (ID: 6)
(6, 6), -- Tenis Running Nike Air
(6, 7), -- Tenis Training Adidas
(6, 10), -- MacBook Air M2

-- Sofia (ID: 7)
(7, 4), -- Leggings Deportivos
(7, 14), -- Sofá Modular IKEA
(7, 15), -- Cama King Size

-- Diego (ID: 8)
(8, 2), -- Pantaloneta Running Elite
(8, 5), -- Chaqueta Deportiva Puma
(8, 9); -- Samsung Galaxy S24

-- 15. RELACIONES CATEGORY_SUBCATEGORY
INSERT INTO category_subcategory (category_id, subcategory_id, active) VALUES
(1, 1, TRUE), -- Ropa Deportiva -> Camisas deportivas
(2, 2, TRUE), -- Ropa Deportiva -> Pantalones deportivos  
(3, 3, TRUE), -- Calzado Deportivo -> Calzado running
(4, 4, TRUE), -- Accesorios Deportivos -> Accesorios fitness
(5, 5, TRUE), -- Ropa Casual -> Ropa casual
(6, 14, TRUE), -- Tecnología Móvil -> Smartphones
(7, 7, TRUE), -- Computación -> Computadores
(8, 8, TRUE), -- Audio y Video -> Audio y Video
(9, 9, TRUE), -- Gaming -> Gaming
(10, 10, TRUE), -- Electrodomésticos -> Electrodomésticos
(11, 11, TRUE), -- Muebles Sala -> Muebles Sala
(12, 12, TRUE), -- Muebles Dormitorio -> Muebles Dormitorio
(13, 13, TRUE); -- Decoración -> Decoración Hogar

-- 16. ACTUALIZAR STOCK TOTAL DE PRODUCTOS (suma de todas sus variantes)
UPDATE products SET stock = (
    SELECT COALESCE(SUM(pv.stock), 0)
    FROM product_variants pv
    WHERE pv.product_id = products.id AND pv.active = TRUE
);

-- 17. VERIFICACIÓN DE DATOS
-- Mostrar resumen de datos insertados
SELECT 'SUBCATEGORÍAS' as tabla, COUNT(*) as total FROM subcategories
UNION ALL
SELECT 'CATEGORÍAS', COUNT(*) FROM categories
UNION ALL
SELECT 'MARCAS', COUNT(*) FROM brands
UNION ALL
SELECT 'USUARIOS', COUNT(*) FROM "User"
UNION ALL
SELECT 'CUPONES', COUNT(*) FROM coupons
UNION ALL
SELECT 'PRODUCTOS', COUNT(*) FROM products
UNION ALL
SELECT 'VARIANTES', COUNT(*) FROM product_variants
UNION ALL
SELECT 'IMÁGENES', COUNT(*) FROM images
UNION ALL
SELECT 'DIRECCIONES', COUNT(*) FROM addresses
UNION ALL
SELECT 'CARRITOS', COUNT(*) FROM cart
UNION ALL
SELECT 'ITEMS CARRITO', COUNT(*) FROM cart_items
UNION ALL
SELECT 'ÓRDENES', COUNT(*) FROM orders
UNION ALL
SELECT 'ITEMS ÓRDENES', COUNT(*) FROM order_items
UNION ALL
SELECT 'LOGS ÓRDENES', COUNT(*) FROM order_logs
UNION ALL
SELECT 'FAVORITOS', COUNT(*) FROM favorites
UNION ALL
SELECT 'CAT-SUBCAT', COUNT(*) FROM category_subcategory;
