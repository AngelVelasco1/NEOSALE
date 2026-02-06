DELETE FROM review_images;
DELETE FROM favorites;
DELETE FROM order_logs;
DELETE FROM order_items;
DELETE FROM cart_items;
DELETE FROM images;
DELETE FROM reviews;
DELETE FROM "Account";
DELETE FROM product_variants;
DELETE FROM payments;
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

-- REINICIAR SECUENCIAS
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
ALTER SEQUENCE payments_id_seq RESTART WITH 1;
ALTER SEQUENCE orders_id_seq RESTART WITH 1;
ALTER SEQUENCE order_items_id_seq RESTART WITH 1;
ALTER SEQUENCE order_logs_id_seq RESTART WITH 1;
ALTER SEQUENCE coupons_id_seq RESTART WITH 1;
ALTER SEQUENCE favorites_id_seq RESTART WITH 1;
ALTER SEQUENCE review_images_id_seq RESTART WITH 1;
ALTER SEQUENCE reviews_id_seq RESTART WITH 1;

-- HABILITAR EXTENSIÓN PARA HASH DE CONTRASEÑAS
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- SUBCATEGORÍAS
INSERT INTO subcategories (name, active) VALUES 
('Camisas deportivas', TRUE), ('Pantalones deportivos', TRUE), ('Calzado running', TRUE), ('Accesorios fitness', TRUE),
('Ropa casual', TRUE), ('Electrónicos móviles', TRUE), ('Computadores', TRUE), ('Audio y Video', TRUE),
('Gaming', TRUE), ('Electrodomésticos', TRUE), ('Muebles Sala', TRUE), ('Muebles Dormitorio', TRUE),
('Decoración Hogar', TRUE), ('Smartphones', TRUE), ('Tablets', TRUE);
-- CATEGORÍAS
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

-- RELACIONES CATEGORÍA-SUBCATEGORÍA
INSERT INTO category_subcategory (category_id, subcategory_id, active) VALUES
(1, 1, TRUE), (2, 2, TRUE), (3, 3, TRUE), (4, 4, TRUE), (5, 5, TRUE), (6, 6, TRUE),
(6, 14, TRUE), (6, 15, TRUE), (7, 7, TRUE), (8, 8, TRUE), (9, 9, TRUE), (10, 10, TRUE),
(11, 11, TRUE), (12, 12, TRUE), (13, 13, TRUE);

-- MARCAS
INSERT INTO brands (name, description, image_url, active) VALUES 
('Nike', 'Marca líder mundial en ropa y calzado deportivo', 'https://example.com/nike-logo.png', TRUE),
('Adidas', 'Marca alemana de artículos deportivos y lifestyle', 'https://example.com/adidas-logo.png', TRUE),
('Puma', 'Marca alemana de ropa deportiva y calzado', 'https://example.com/puma-logo.png', TRUE),
('Apple', 'Compañía tecnológica líder en innovación', 'https://example.com/apple-logo.png', TRUE),
('Samsung', 'Conglomerado multinacional surcoreano de tecnología', 'https://example.com/samsung-logo.png', TRUE),
('Sony', 'Multinacional japonesa de electrónicos y entretenimiento', 'https://example.com/sony-logo.png', TRUE),
('LG', 'Conglomerado surcoreano de electrodomésticos', 'https://example.com/lg-logo.png', TRUE),
('IKEA', 'Empresa sueca de muebles y decoración', 'https://example.com/ikea-logo.png', TRUE);
-- USUARIOS
INSERT INTO "User" (name, email, email_verified, password, phone_number, identification, identification_type, role, active, email_notifications) VALUES
('Angel García', 'angel.admin@neosale.com', '2023-10-01 10:00:00', crypt('Admin123!', gen_salt('bf', 12)), '3001234567', '123456789', 'CC', 'admin', TRUE, TRUE),
('María López', 'maria.admin@neosale.com', '2023-10-02 10:00:00', crypt('Admin123!', gen_salt('bf', 12)), '3012345678', '987654321', 'CC', 'admin', TRUE, TRUE),
('Carlos Rodríguez', 'carlos.rodriguez@email.com', '2023-11-15 14:30:00', crypt('User123!', gen_salt('bf', 12)), '3023456789', '1087654321', 'CC', 'user', TRUE, TRUE),
('Ana Martínez', 'ana.martinez@email.com', '2023-11-20 09:15:00', crypt('User456!', gen_salt('bf', 12)), '3034567890', '1076543210', 'CC', 'user', TRUE, TRUE),
('Luis Fernández', 'luis.fernandez@email.com', '2023-12-01 16:45:00', crypt('User789!', gen_salt('bf', 12)), '3045678901', '1065432109', 'CE', 'user', TRUE, FALSE),
('Sofia Herrera', 'sofia.herrera@email.com', '2023-12-05 11:20:00', crypt('User101!', gen_salt('bf', 12)), '3056789012', '1054321098', 'CC', 'user', TRUE, TRUE),
('Diego Morales', 'diego.morales@email.com', '2023-12-10 13:10:00', crypt('User202!', gen_salt('bf', 12)), '3067890123', '1043210987', 'CC', 'user', TRUE, TRUE);
INSERT INTO "User" (name, email, email_verified, password, phone_number, identification, identification_type, role, active, email_notifications) VALUES ('Jose', 'jose@gmaiul.com', '2023-10-01 10:00:00', 'chupeta', '3115879778', '109875745', 'CC', 'user', TRUE, TRUE);
-- CUPONES
INSERT INTO coupons (code, name, discount_type, discount_value, min_purchase_amount, usage_limit, expires_at, created_by) VALUES
('WELCOME10', '10% Descuento de Bienvenida', 'percentage', 10.00, 50000, 1, '2026-12-31 23:59:59', 1),
('FREESHIP', 'Envío Gratis', 'fixed', 15000, 100000, 100, '2026-12-31 23:59:59', 1),
('TECH20', '20% en Tecnología', 'percentage', 20.00, 1000000, 50, '2026-12-11 23:59:59', 1),
('EXPIRED', 'Cupón Vencido', 'percentage', 50.00, 0, 10, '2026-12-12 00:00:00', 1);
-- PRODUCTOS
INSERT INTO products (name, description, price, stock, weight_grams, sizes, base_discount, category_id, brand_id, active, in_offer, offer_discount, offer_start_date, offer_end_date, created_by, updated_by) VALUES
('Camiseta Dry-Fit Pro', 'Camiseta deportiva de alto rendimiento', 89000, 0, 250, 'XS,S,M,L,XL,XXL', 0, 1, 1, TRUE, TRUE, 20.0, '2026-01-01 00:00:00', '2026-12-31 23:59:59', 1, 1),
('Pantaloneta Running Elite', 'Pantaloneta liviana para running', 75000, 0, 200, 'S,M,L,XL', 0, 2, 1, TRUE, FALSE, NULL, NULL, NULL, 1, 1),
('Camiseta Training Adidas', 'Camiseta de entrenamiento transpirable', 95000, 0, 300, 'S,M,L,XL,XXL', 0, 1, 2, TRUE, TRUE, 15.0, '2026-01-01 00:00:00', '2026-12-31 23:59:59', 1, 1),
('Leggings Deportivos', 'Leggings de compresión para mujer', 120000, 0, 350, 'XS,S,M,L,XL', 0, 2, 3, TRUE, FALSE, NULL, NULL, NULL, 1, 1),
('Chaqueta Deportiva Puma', 'Chaqueta resistente al viento', 180000, 0, 800, 'S,M,L,XL', 0, 1, 3, TRUE, TRUE, 30.0, '2026-01-01 00:00:00', '2026-12-31 23:59:59', 1, 1),
('Tenis Running Nike Air', 'Tenis de running con amortiguación Air Max', 320000, 0, 900, '36,37,38,39,40,41,42,43,44', 0, 3, 1, TRUE, FALSE, NULL, NULL, NULL, 1, 1),
('Tenis Training Adidas', 'Tenis versátiles para entrenamiento', 280000, 0, 850, '37,38,39,40,41,42,43', 0, 3, 2, TRUE, TRUE, 25.0, '2026-01-01 00:00:00', '2026-12-31 23:59:59', 1, 1),
('iPhone 15 Pro', 'Smartphone Apple con chip A17 Pro', 4200000, 0, 190, 'Único', 0, 6, 4, TRUE, TRUE, 10.0, '2026-01-01 00:00:00', '2026-12-31 23:59:59', 1, 1),
('Samsung Galaxy S24', 'Smartphone Samsung con Dynamic AMOLED 2X', 3800000, 0, 210, 'Único', 0, 6, 5, TRUE, FALSE, NULL, NULL, NULL, 1, 1),
('MacBook Air M2', 'Laptop Apple con pantalla Liquid Retina', 5500000, 0, 1240, 'Único', 0, 7, 4, TRUE, FALSE, NULL, NULL, NULL, 1, 1),
('AirPods Pro 2', 'Audífonos inalámbricos con cancelación de ruido', 850000, 0, 50, 'Único', 0, 8, 4, TRUE, TRUE, 20.0, '2026-01-01 00:00:00', '2026-12-31 23:59:59', 1, 1),
('PlayStation 5', 'Consola de videojuegos con SSD ultra-rápido', 2800000, 0, 4500, 'Único', 0, 9, 6, TRUE, FALSE, NULL, NULL, NULL, 1, 1),
('Smart TV LG 55"', 'Televisor LG 55" 4K UHD con webOS', 1800000, 0, 15000, 'Único', 0, 8, 7, TRUE, TRUE, 35.0, '2026-01-01 00:00:00', '2026-12-31 23:59:59', 1, 1),
('Sofá Modular IKEA', 'Sofá modular de 3 puestos en tela gris', 1200000, 0, 45000, 'Único', 0, 11, 8, TRUE, FALSE, NULL, NULL, NULL, 1, 1),
('Cama King Size', 'Cama king size en madera maciza', 950000, 0, 60000, 'Único', 0, 12, 8, TRUE, TRUE, 40.0, '2026-01-01 00:00:00', '2026-12-31 23:59:59', 1, 1),
('Producto Descontinuado', 'Este producto ya no está disponible', 50000, 0, 100, 'Único', 0, 5, 1, FALSE, FALSE, NULL, NULL, NULL, 1, 1);


-- VARIANTES DE PRODUCTOS
INSERT INTO product_variants (product_id, color_code, color, size, stock, sku, price, weight_grams, active) VALUES
-- Camiseta Dry-Fit Pro (ID: 1) - Con oferta
(1, '#000000', 'Negro', 'M', 10, 'NIKE-DRYFIT-BLACK-M', 71200, 250, TRUE),
(1, '#FFFFFF', 'Blanco', 'M', 9, 'NIKE-DRYFIT-WHITE-M', 71200, 250, TRUE),
(1, '#FF0000', 'Rojo', 'L', 10, 'NIKE-DRYFIT-RED-L', 71200, 250, TRUE),
-- Pantaloneta Running Elite (ID: 2) - Sin oferta
(2, '#000000', 'Negro', 'M', 12, 'NIKE-SHORTS-BLACK-M', 75000, 200, TRUE),
(2, '#0066CC', 'Azul', 'L', 7, 'NIKE-SHORTS-BLUE-L', 75000, 200, TRUE),
-- Camiseta Training Adidas (ID: 3) - Con oferta
(3, '#FF6B6B', 'Rojo', 'M', 10, 'ADIDAS-TRAIN-RED-M', 80750, 300, TRUE),
-- Leggings Deportivos (ID: 4)
(4, '#4ECDC4', 'Verde Azulado', 'S', 7, 'PUMA-LEGGINGS-TEAL-S', 120000, 350, TRUE),
-- Chaqueta Deportiva Puma (ID: 5) - Con oferta
(5, '#45B7D1', 'Azul', 'M', 5, 'PUMA-JACKET-BLUE-M', 126000, 800, TRUE),
-- Tenis Running Nike Air (ID: 6)
(6, '#000000', 'Negro', '40', 6, 'NIKE-AIR-BLACK-40', 320000, 900, TRUE),
(6, '#FFFFFF', 'Blanco', '40', 5, 'NIKE-AIR-WHITE-40', 320000, 900, TRUE),
-- Tenis Training Adidas (ID: 7) - Con oferta
(7, '#96CEB4', 'Verde', '39', 5, 'ADIDAS-TRAIN-GREEN-39', 210000, 850, TRUE),
-- iPhone 15 Pro (ID: 8) - Con oferta
(8, '#8E8E93', 'Titanio Natural', 'Único', 5, 'IPHONE15-TITANIUM-NATURAL', 3780000, 190, TRUE),
-- Samsung Galaxy S24 (ID: 9)
(9, '#000000', 'Negro', 'Único', 8, 'GALAXY-S24-BLACK', 3800000, 210, TRUE),
-- MacBook Air M2 (ID: 10)
(10, '#FFEAA7', 'Dorado', 'Único', 10, 'MACBOOK-AIR-M2-GOLD', 5500000, 1240, TRUE),
-- AirPods Pro 2 (ID: 11) - Con oferta
(11, '#FFFFFF', 'Blanco', 'Único', 40, 'AIRPODS-PRO2-WHITE', 680000, 50, TRUE),
-- PlayStation 5 (ID: 12)
(12, '#FFFFFF', 'Blanco', 'Único', 8, 'PS5-WHITE', 2800000, 4500, TRUE),
-- Smart TV LG 55" (ID: 13) - Con oferta
(13, '#000000', 'Negro', 'Único', 12, 'LG-TV-55-BLACK', 1170000, 15000, TRUE),
-- Sofá Modular IKEA (ID: 14)
(14, '#F0E68C', 'Beige', 'Único', 5, 'IKEA-SOFA-BEIGE', 1200000, 45000, TRUE),
-- Cama King Size (ID: 15) - Con oferta
(15, '#CD853F', 'Café', 'Único', 8, 'IKEA-BED-BROWN', 570000, 60000, TRUE),
-- Producto Descontinuado (ID: 16) - Inactivo
(16, '#808080', 'Gris', 'Único', 0, 'DISCONTINUED-GRAY', 50000, 100, FALSE);

-- IMÁGENES DE PRODUCTOS
INSERT INTO images (image_url, color_code, color, is_primary, product_id, variant_id) VALUES
('https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/61734ec7-dad8-40f3-9b95-c7500939150a/dri-fit-miler-mens-running-top-M0D4QV.png', '#000000', 'Negro', TRUE, 1, 1),
('https://via.placeholder.com/500x500/FFFFFF/000000?text=Nike+Dry-Fit+White', '#FFFFFF', 'Blanco', FALSE, 1, 2),
('https://via.placeholder.com/500x500/FF0000/FFFFFF?text=Nike+Dry-Fit+Red', '#FF0000', 'Rojo', FALSE, 1, 3),
('https://via.placeholder.com/500x500/000000/FFFFFF?text=Nike+Shorts+Black', '#000000', 'Negro', TRUE, 2, 4),
('https://via.placeholder.com/500x500/0066CC/FFFFFF?text=Nike+Shorts+Blue', '#0066CC', 'Azul', FALSE, 2, 5),
('https://via.placeholder.com/500x500/FF6B6B/FFFFFF?text=Adidas+Training', '#FF6B6B', 'Rojo', TRUE, 3, 6),
('https://via.placeholder.com/500x500/4ECDC4/FFFFFF?text=Puma+Leggings', '#4ECDC4', 'Verde Azulado', TRUE, 4, 7),
('https://via.placeholder.com/500x500/45B7D1/FFFFFF?text=Puma+Jacket', '#45B7D1', 'Azul', TRUE, 5, 8),
('https://via.placeholder.com/500x500/000000/FFFFFF?text=Nike+Air+Black', '#000000', 'Negro', TRUE, 6, 9),
('https://via.placeholder.com/500x500/FFFFFF/000000?text=Nike+Air+White', '#FFFFFF', 'Blanco', FALSE, 6, 10),
('https://via.placeholder.com/500x500/96CEB4/FFFFFF?text=Adidas+Training', '#96CEB4', 'Verde', TRUE, 7, 11),
('https://images.unsplash.com/photo-1511707171634-5f897ff02aa9', '#8E8E93', 'Titanio Natural', TRUE, 8, 12),
('https://via.placeholder.com/500x500/000000/FFFFFF?text=Galaxy+S24', '#000000', 'Negro', TRUE, 9, 13),
('https://via.placeholder.com/500x500/FFEAA7/000000?text=MacBook+Air', '#FFEAA7', 'Dorado', TRUE, 10, 14),
('https://m.media-amazon.com/images/I/61UxfXTUyvL._AC_UF1000,1000_QL80_.jpg', '#FFFFFF', 'Blanco', TRUE, 11, 15),
('https://m.media-amazon.com/images/I/61UxfXTUyvL._AC_UF1000,1000_QL80_.jpg', '#FFFFFF', 'Blanco', TRUE, 12, 16),
('https://via.placeholder.com/500x500/000000/FFFFFF?text=LG+TV+55', '#000000', 'Negro', TRUE, 13, 17),
('https://via.placeholder.com/500x500/F0E68C/000000?text=IKEA+Sofa', '#F0E68C', 'Beige', TRUE, 14, 18),
('https://via.placeholder.com/500x500/CD853F/FFFFFF?text=IKEA+Bed', '#CD853F', 'Café', TRUE, 15, 19),
('https://via.placeholder.com/500x500/808080/FFFFFF?text=Discontinued+Product', '#808080', 'Gris', TRUE, 16, 20);



-- DIRECCIONES DE USUARIOS
INSERT INTO addresses (address, country, city, department, is_default, user_id) VALUES 
('Carrera 27 #34-56, Cabecera', 'Colombia', 'Bucaramanga', 'Santander', TRUE, 1),
('Avenida El Poblado #12-34', 'Colombia', 'Medellín', 'Antioquia', TRUE, 2),
('Calle 100 #25-50, Zona Rosa', 'Colombia', 'Bogotá', 'Cundinamarca', TRUE, 3),
('Calle 26 #47-89, Zona Rosa', 'Colombia', 'Bogotá', 'Cundinamarca', TRUE, 4),
('Avenida 6 #23-45, San Fernando', 'Colombia', 'Cali', 'Valle del Cauca', TRUE, 5),
('Calle 70 #11-89, Zona Norte', 'Colombia', 'Barranquilla', 'Atlántico', TRUE, 6),
('Calle 85 #15-34, Chapinero', 'Colombia', 'Bogotá', 'Cundinamarca', TRUE, 7);

-- CARRITOS DE COMPRAS
INSERT INTO cart (user_id, session_token, subtotal, expires_at) VALUES
(4, NULL, 391200, '2025-09-30 23:59:59'), -- Carlos Rodríguez
(5, NULL, 3900000, '2025-09-30 23:59:59'); -- Ana Martínez
select * from "User";
-- ITEMS EN CARRITOS
INSERT INTO cart_items (cart_id, product_id, quantity, unit_price, color_code, size) VALUES
(1, 1, 1, 71200, '#000000', 'M'),
(1, 6, 1, 320000, '#000000', '40'),
(2, 4, 1, 120000, '#4ECDC4', 'S'),
(2, 8, 1, 3780000, '#8E8E93', 'Único');

-- PAGOS (Nueva tabla payments)
INSERT INTO payments (
    transaction_id, reference, amount_in_cents, currency, 
    payment_status, status_message, 
    payment_method, payment_method_details,
    checkout_url, customer_email, customer_phone, 
    customer_document_type, customer_document_number,
    cart_data, shipping_address, user_id,
    created_at, updated_at, approved_at
) VALUES
-- Pago aprobado para orden 1
('WOMPI-12345678901', 'NEOSALE_20240825_001', 43133280, 'COP',
 'APPROVED', 'Transacción aprobada',
 'CARD', '{"brand": "VISA", "last_four": "1234", "installments": 1}',
 'https://checkout.wompi.co/p/12345', 'carlos.rodriguez@email.com', '3023456789',
 'CC', '1087654321',
 '[{"product_id": 1, "quantity": 1, "price": 71200, "color": "#000000", "size": "M"}, {"product_id": 6, "quantity": 1, "price": 320000, "color": "#000000", "size": "40"}]',
 '{"address_line_1": "Calle 26 #47-89, Zona Rosa", "city": "Bogotá", "region": "Cundinamarca", "country": "Colombia", "postal_code": "110001"}',
 4, '2024-08-25 14:00:00', '2024-08-25 14:30:00', '2024-08-25 14:30:00'),

-- Pago aprobado para orden 2
('WOMPI-98765432109', 'NEOSALE_20240828_002', 15120000, 'COP',
 'APPROVED', 'Transacción aprobada',
 'PSE', '{"bank": "BANCOLOMBIA", "user_type": "0"}',
 'https://checkout.wompi.co/p/98765', 'ana.martinez@email.com', '3034567890',
 'CC', '1076543210',
 '[{"product_id": 4, "quantity": 1, "price": 120000, "color": "#4ECDC4", "size": "S"}]',
 '{"address_line_1": "Avenida 6 #23-45, San Fernando", "city": "Cali", "region": "Valle del Cauca", "country": "Colombia", "postal_code": "760001"}',
 5, '2024-08-28 09:00:00', '2024-08-28 09:15:00', '2024-08-28 09:15:00'),

-- Pago pendiente para orden 3
('WOMPI-56789012345', 'NEOSALE_20240830_003', 9059200, 'COP',
 'PENDING', 'Esperando confirmación del banco',
 'PSE', '{"bank": "BANCOLOMBIA", "user_type": "0"}',
 'https://checkout.wompi.co/p/56789', 'diego.morales@email.com', '3067890123',
 'CC', '1043210987',
 '[{"product_id": 1, "quantity": 1, "price": 71200, "color": "#000000", "size": "M"}]',
 '{"address_line_1": "Calle 85 #15-34, Chapinero", "city": "Bogotá", "region": "Cundinamarca", "country": "Colombia", "postal_code": "110001"}',
 7, '2024-08-30 16:00:00', '2024-08-30 16:00:00', NULL);

-- ÓRDENES (Actualizada estructura)
INSERT INTO orders (
    payment_id, status, subtotal, discount, shipping_cost, taxes, total,
    shipping_address_id, coupon_id, coupon_discount,
    user_id, updated_by, created_at, updated_at
) VALUES
-- Orden 1 - Entregada
(1, 'delivered', 391200, 39120, 15000, 64252, 431332, 4, 1, 39120, 4, 1, '2024-08-25 14:30:00', '2024-08-27 10:00:00'),

-- Orden 2 - En procesamiento
(2, 'processing', 120000, 0, 12000, 19200, 151200, 5, NULL, 0, 5, 1, '2024-08-28 09:15:00', '2024-08-28 15:00:00'),

-- Orden 3 - Pendiente
(3, 'pending', 71200, 0, 8000, 11392, 90592, 7, NULL, 0, 7, 7, '2024-08-30 16:00:00', '2024-08-30 16:00:00');

INSERT INTO orders (
    payment_id, status, subtotal, discount, shipping_cost, taxes, total,
    shipping_address_id, coupon_id, coupon_discount,
    user_id, updated_by, created_at, updated_at
) VALUES
-- Orden 1 - Entregada
(3, 'delivered', 391200, 39120, 15000, 64252, 431332, 4, 1, 39120, 4, 1, '2025-08-25 14:30:00', '2025-08-27 10:00:00');
-- ITEMS DE ÓRDENES
INSERT INTO order_items (price, quantity, subtotal, color_code, size, product_id, order_id) VALUES
(71200, 1, 71200, '#000000', 'M', 1, 4),
(320000, 1, 320000, '#000000', '40', 6, 4),
(120000, 1, 120000, '#4ECDC4', 'S', 4, 4),
(71200, 1, 71200, '#000000', 'M', 1, 4);

-- LOGS DE ÓRDENES
INSERT INTO order_logs (previous_status, new_status, note, order_id, updated_by, user_type) VALUES
('pending', 'paid', 'Pago aprobado automáticamente por Wompi', 1, 1, 'system'),
('paid', 'processing', 'Iniciando preparación del pedido', 1, 1, 'admin'),
('processing', 'shipped', 'Pedido enviado con transportadora TCC', 1, 1, 'admin'),
('shipped', 'delivered', 'Pedido entregado exitosamente', 1, 1, 'system'),
('pending', 'paid', 'Pago PSE confirmado', 2, 1, 'system'),
('paid', 'processing', 'Orden en preparación', 2, 1, 'admin');

-- FAVORITOS DE USUARIOS
INSERT INTO favorites (user_id, product_id) VALUES
(4, 8), (4, 12), (5, 1), (6, 6), (7, 4);

-- REVIEWS DE PRODUCTOS
INSERT INTO reviews (user_id, product_id, rating, comment, active, order_id) VALUES
(4, 1, 5, 'Excelente camiseta, muy cómoda para correr', TRUE, 4),
(4, 6, 4, 'Buenos tenis, aunque un poco pesados', TRUE, 4),
(5, 4, 4, 'Leggings cómodos pero un poco caros', TRUE, 3),
(6, 8, 5, 'El iPhone 15 Pro es increíble, muy rápido y con gran cámara', TRUE, NULL),   
(5, 4, 5, 'Perfectos leggings, gran calidad', FALSE, NULL);

-- IMÁGENES DE REVIEWS
INSERT INTO review_images (review_id, image_url) VALUES
(1, 'https://via.placeholder.com/300x300/000000/FFFFFF?text=Review+Image+1'),
(2, 'https://via.placeholder.com/300x300/000000/FFFFFF?text=Review+Image+2');


/* Se debe hacer en un tigger cuando en el admin añadan productos */
UPDATE products SET stock = (
    SELECT COALESCE(SUM(pv.stock), 0)
    FROM product_variants pv
    WHERE pv.product_id = products.id AND pv.active = TRUE
);


