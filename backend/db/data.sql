DELETE FROM cart_items;
DELETE FROM cart;
DELETE FROM product_variants;
DELETE FROM images;
DELETE FROM addresses;
DELETE FROM products;
DELETE FROM categories;
DELETE FROM subcategories;
DELETE FROM brands;
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

-- Habilitar extensión para hash de contraseñas
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. SUBCATEGORÍAS
INSERT INTO subcategories (name) VALUES 
('Camisas deportivas'),
('Pantalones deportivos'),
('Calzado running'),
('Accesorios fitness'),
('Ropa casual'),
('Electrónicos móviles'),
('Computadores'),
('Audio'),
('Gaming'),
('Cocina'),
('Sala'),
('Dormitorio'),
('Decoración');

-- 2. CATEGORÍAS
INSERT INTO categories (name, id_subcategory) VALUES 
('Ropa Deportiva', 1),
('Ropa Deportiva', 2),
('Calzado Deportivo', 3),
('Accesorios Deportivos', 4),
('Ropa Casual', 5),
('Smartphones', 6),
('Laptops', 7),
('Audio y Video', 8),
('Gaming', 9),
('Electrodomésticos', 10),
('Muebles Sala', 11),
('Muebles Dormitorio', 12),
('Decoración Hogar', 13);

-- 3. MARCAS
INSERT INTO brands (name, image_url) VALUES 
('Nike', 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/61734ec7-dad8-40f3-9b95-c7500939150a/dri-fit-miler-mens-running-top-M0D4QV.png'),
('Adidas', 'https://m.media-amazon.com/images/I/61pK9bZl+GL._AC_UF1000,1000_QL80_.jpg'),
('Puma', 'https://m.media-amazon.com/images/I/61v5ZtQ+1lL._AC_UF1000,1000_QL80_.jpg'),
('Under Armour', 'https://m.media-amazon.com/images/I/71v6i5p9ZTL._AC_UF1000,1000_QL80_.jpg'),
('Apple', 'https://m.media-amazon.com/images/I/71yzJoE7WlL._AC_UF1000,1000_QL80_.jpg'),
('Samsung', 'https://m.media-amazon.com/images/I/71w8c8AywJL._AC_UF1000,1000_QL80_.jpg'),
('Sony', 'https://m.media-amazon.com/images/I/61UxfXTUyvL._AC_UF1000,1000_QL80_.jpg'),
('LG', 'https://www.lg.com/content/dam/channel/wcms/latin/images/tvs/55up7750psb_awm_eail_latin_01.jpg'),
('IKEA', 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4'),
('Zara', 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f');

-- 4. USUARIOS
INSERT INTO "User" (name, email, email_verified, password, phone_number, identification, role) VALUES
-- Administradores
('Angel García', 'angel.admin@neosale.com', '2023-10-01 10:00:00', crypt('Admin123!', gen_salt('bf', 12)), '3001234567', '1234567890', 'admin'),
('María López', 'maria.admin@neosale.com', '2023-10-02 10:00:00', crypt('Admin123!', gen_salt('bf', 12)), '3012345678', '1098765432', 'admin'),

-- Usuarios regulares
('Carlos Rodríguez', 'carlos.rodriguez@email.com', '2023-11-15 14:30:00', crypt('User123!', gen_salt('bf', 12)), '3023456789', '1087654321', 'user'),
('Ana Martínez', 'ana.martinez@email.com', '2023-11-20 09:15:00', crypt('User456!', gen_salt('bf', 12)), '3034567890', '1076543210', 'user'),
('Luis Fernández', 'luis.fernandez@email.com', '2023-12-01 16:45:00', crypt('User789!', gen_salt('bf', 12)), '3045678901', '1065432109', 'user'),
('Sofia Herrera', 'sofia.herrera@email.com', '2023-12-05 11:20:00', crypt('User101!', gen_salt('bf', 12)), '3056789012', '1054321098', 'user'),
('Diego Morales', 'diego.morales@email.com', '2023-12-10 13:10:00', crypt('User202!', gen_salt('bf', 12)), '3067890123', '1043210987', 'user'),
('Valentina Cruz', 'valentina.cruz@email.com', '2023-12-15 15:30:00', crypt('User303!', gen_salt('bf', 12)), '3078901234', '1032109876', 'user'),
('Andrés Vargas', 'andres.vargas@email.com', '2023-12-20 08:45:00', crypt('User404!', gen_salt('bf', 12)), '3089012345', '1021098765', 'user'),
('Isabella Reyes', 'isabella.reyes@email.com', '2023-12-25 12:00:00', crypt('User505!', gen_salt('bf', 12)), '3090123456', '1010987654', 'user'),
('Mateo Jiménez', 'mateo.jimenez@email.com', '2024-01-01 10:00:00', crypt('User606!', gen_salt('bf', 12)), '3101234567', '1009876543', 'user'),
('Camila Torres', 'camila.torres@email.com', '2024-01-05 14:20:00', crypt('User707!', gen_salt('bf', 12)), '3112345678', '1008765432', 'user');

-- 5. PRODUCTOS (stock será calculado automáticamente desde variants)
INSERT INTO products (name, description, price, stock, weight, sizes, discount, active, category_id, brand_id, created_by, updated_by) VALUES
-- PRODUCTOS DEPORTIVOS
('Camiseta Dry-Fit Pro', 'Camiseta deportiva de alto rendimiento con tecnología de absorción de sudor.', 89000, 0, 0.25, 'XS,S,M,L,XL,XXL', 15.0, TRUE, 1, 1, 1, 1),
('Pantaloneta Running Elite', 'Pantaloneta liviana para running con bolsillos laterales.', 75000, 0, 0.20, 'S,M,L,XL', 0.0, TRUE, 2, 1, 1, 1),
('Camiseta Training Adidas', 'Camiseta de entrenamiento con diseño moderno.', 95000, 0, 0.30, 'S,M,L,XL,XXL', 20.0, TRUE, 1, 2, 1, 1),
('Leggings Deportivos', 'Leggings de compresión para mujer.', 120000, 0, 0.35, 'XS,S,M,L,XL', 10.0, TRUE, 2, 3, 1, 1),
('Chaqueta Deportiva Puma', 'Chaqueta resistente al viento con capucha.', 180000, 0, 0.80, 'S,M,L,XL', 25.0, TRUE, 1, 3, 1, 1),

-- CALZADO DEPORTIVO
('Tenis Running Nike Air', 'Tenis de running con amortiguación avanzada.', 320000, 0, 0.90, '36,37,38,39,40,41,42,43,44', 12.0, TRUE, 3, 1, 1, 1),
('Tenis Training Adidas', 'Tenis versátiles para entrenamiento.', 280000, 0, 0.85, '37,38,39,40,41,42,43', 18.0, TRUE, 3, 2, 1, 1),

-- ELECTRÓNICOS (estos no tienen variantes de color/size tradicionales)
('iPhone 15 Pro', 'Smartphone Apple iPhone 15 Pro.', 4200000, 0, 0.19, 'Único', 5.0, TRUE, 6, 5, 1, 1),
('Samsung Galaxy S24', 'Smartphone Samsung Galaxy S24.', 3800000, 0, 0.21, 'Único', 8.0, TRUE, 6, 6, 1, 1),
('MacBook Air M2', 'Laptop Apple MacBook Air M2.', 5500000, 0, 1.24, 'Único', 0.0, TRUE, 7, 5, 1, 1),
('AirPods Pro 2', 'Audífonos inalámbricos Apple.', 850000, 0, 0.05, 'Único', 15.0, TRUE, 8, 5, 1, 1),
('PlayStation 5', 'Consola de videojuegos Sony PlayStation 5.', 2800000, 0, 4.5, 'Único', 0.0, TRUE, 9, 7, 1, 1),

-- ELECTRODOMÉSTICOS Y HOGAR
('Smart TV LG 55"', 'Televisor LG 55 pulgadas 4K UHD.', 1800000, 0, 15.0, 'Único', 30.0, TRUE, 8, 8, 1, 1),
('Sofá Modular IKEA', 'Sofá modular de 3 puestos en tela gris.', 1200000, 0, 45.0, 'Único', 22.0, TRUE, 11, 9, 1, 1),
('Cama King Size', 'Cama matrimonial king size en madera.', 950000, 0, 60.0, 'Único', 35.0, TRUE, 12, 9, 1, 1);

-- 6. VARIANTES DE PRODUCTOS
INSERT INTO product_variants (product_id, color_code, size, stock, sku) VALUES
-- Camiseta Dry-Fit Pro (ID: 1)
(1, '#000000', 'XS', 5, 'NIKE-DRYFIT-BLACK-XS'),
(1, '#000000', 'S', 8, 'NIKE-DRYFIT-BLACK-S'),
(1, '#000000', 'M', 10, 'NIKE-DRYFIT-BLACK-M'),
(1, '#000000', 'L', 12, 'NIKE-DRYFIT-BLACK-L'),
(1, '#000000', 'XL', 8, 'NIKE-DRYFIT-BLACK-XL'),
(1, '#000000', 'XXL', 5, 'NIKE-DRYFIT-BLACK-XXL'),
(1, '#FFFFFF', 'XS', 4, 'NIKE-DRYFIT-WHITE-XS'),
(1, '#FFFFFF', 'S', 7, 'NIKE-DRYFIT-WHITE-S'),
(1, '#FFFFFF', 'M', 9, 'NIKE-DRYFIT-WHITE-M'),
(1, '#FFFFFF', 'L', 11, 'NIKE-DRYFIT-WHITE-L'),
(1, '#FFFFFF', 'XL', 6, 'NIKE-DRYFIT-WHITE-XL'),
(1, '#FFFFFF', 'XXL', 3, 'NIKE-DRYFIT-WHITE-XXL'),
(1, '#FF0000', 'XS', 3, 'NIKE-DRYFIT-RED-XS'),
(1, '#FF0000', 'S', 6, 'NIKE-DRYFIT-RED-S'),
(1, '#FF0000', 'M', 8, 'NIKE-DRYFIT-RED-M'),
(1, '#FF0000', 'L', 10, 'NIKE-DRYFIT-RED-L'),
(1, '#FF0000', 'XL', 5, 'NIKE-DRYFIT-RED-XL'),
(1, '#FF0000', 'XXL', 2, 'NIKE-DRYFIT-RED-XXL'),

-- Pantaloneta Running Elite (ID: 2)
(2, '#000000', 'S', 8, 'NIKE-SHORTS-BLACK-S'),
(2, '#000000', 'M', 12, 'NIKE-SHORTS-BLACK-M'),
(2, '#000000', 'L', 10, 'NIKE-SHORTS-BLACK-L'),
(2, '#000000', 'XL', 6, 'NIKE-SHORTS-BLACK-XL'),
(2, '#0066CC', 'S', 5, 'NIKE-SHORTS-BLUE-S'),
(2, '#0066CC', 'M', 8, 'NIKE-SHORTS-BLUE-M'),
(2, '#0066CC', 'L', 7, 'NIKE-SHORTS-BLUE-L'),
(2, '#0066CC', 'XL', 4, 'NIKE-SHORTS-BLUE-XL'),

-- Camiseta Training Adidas (ID: 3)
(3, '#FF6B6B', 'S', 6, 'ADIDAS-TRAIN-RED-S'),
(3, '#FF6B6B', 'M', 10, 'ADIDAS-TRAIN-RED-M'),
(3, '#FF6B6B', 'L', 8, 'ADIDAS-TRAIN-RED-L'),
(3, '#FF6B6B', 'XL', 5, 'ADIDAS-TRAIN-RED-XL'),
(3, '#FF6B6B', 'XXL', 3, 'ADIDAS-TRAIN-RED-XXL'),

-- Leggings Deportivos (ID: 4)
(4, '#4ECDC4', 'XS', 4, 'PUMA-LEGGINGS-TEAL-XS'),
(4, '#4ECDC4', 'S', 7, 'PUMA-LEGGINGS-TEAL-S'),
(4, '#4ECDC4', 'M', 9, 'PUMA-LEGGINGS-TEAL-M'),
(4, '#4ECDC4', 'L', 6, 'PUMA-LEGGINGS-TEAL-L'),
(4, '#4ECDC4', 'XL', 4, 'PUMA-LEGGINGS-TEAL-XL'),

-- Chaqueta Deportiva Puma (ID: 5)
(5, '#45B7D1', 'S', 3, 'PUMA-JACKET-BLUE-S'),
(5, '#45B7D1', 'M', 5, 'PUMA-JACKET-BLUE-M'),
(5, '#45B7D1', 'L', 4, 'PUMA-JACKET-BLUE-L'),
(5, '#45B7D1', 'XL', 2, 'PUMA-JACKET-BLUE-XL'),

-- Tenis Running Nike Air (ID: 6)
(6, '#000000', '36', 2, 'NIKE-AIR-BLACK-36'),
(6, '#000000', '37', 3, 'NIKE-AIR-BLACK-37'),
(6, '#000000', '38', 4, 'NIKE-AIR-BLACK-38'),
(6, '#000000', '39', 5, 'NIKE-AIR-BLACK-39'),
(6, '#000000', '40', 6, 'NIKE-AIR-BLACK-40'),
(6, '#000000', '41', 5, 'NIKE-AIR-BLACK-41'),
(6, '#000000', '42', 4, 'NIKE-AIR-BLACK-42'),
(6, '#000000', '43', 3, 'NIKE-AIR-BLACK-43'),
(6, '#000000', '44', 2, 'NIKE-AIR-BLACK-44'),
(6, '#FFFFFF', '36', 1, 'NIKE-AIR-WHITE-36'),
(6, '#FFFFFF', '37', 2, 'NIKE-AIR-WHITE-37'),
(6, '#FFFFFF', '38', 3, 'NIKE-AIR-WHITE-38'),
(6, '#FFFFFF', '39', 4, 'NIKE-AIR-WHITE-39'),
(6, '#FFFFFF', '40', 5, 'NIKE-AIR-WHITE-40'),
(6, '#FFFFFF', '41', 4, 'NIKE-AIR-WHITE-41'),
(6, '#FFFFFF', '42', 3, 'NIKE-AIR-WHITE-42'),
(6, '#FFFFFF', '43', 2, 'NIKE-AIR-WHITE-43'),
(6, '#FFFFFF', '44', 1, 'NIKE-AIR-WHITE-44'),

-- Tenis Training Adidas (ID: 7)
(7, '#96CEB4', '37', 3, 'ADIDAS-TRAIN-GREEN-37'),
(7, '#96CEB4', '38', 4, 'ADIDAS-TRAIN-GREEN-38'),
(7, '#96CEB4', '39', 5, 'ADIDAS-TRAIN-GREEN-39'),
(7, '#96CEB4', '40', 6, 'ADIDAS-TRAIN-GREEN-40'),
(7, '#96CEB4', '41', 5, 'ADIDAS-TRAIN-GREEN-41'),
(7, '#96CEB4', '42', 4, 'ADIDAS-TRAIN-GREEN-42'),
(7, '#96CEB4', '43', 3, 'ADIDAS-TRAIN-GREEN-43'),

-- Electrónicos con variantes de color
-- iPhone 15 Pro (ID: 8)
(8, '#8E8E93', 'Único', 5, 'IPHONE15-TITANIUM-NATURAL'),
(8, '#5E5CE6', 'Único', 4, 'IPHONE15-TITANIUM-BLUE'),
(8, '#F2F2F7', 'Único', 6, 'IPHONE15-TITANIUM-WHITE'),

-- Samsung Galaxy S24 (ID: 9)
(9, '#000000', 'Único', 8, 'GALAXY-S24-BLACK'),
(9, '#800080', 'Único', 6, 'GALAXY-S24-VIOLET'),

-- MacBook Air M2 (ID: 10)
(10, '#FFEAA7', 'Único', 10, 'MACBOOK-AIR-M2-GOLD'),

-- AirPods Pro 2 (ID: 11)
(11, '#DDA0DD', 'Único', 40, 'AIRPODS-PRO2-WHITE'),

-- PlayStation 5 (ID: 12)
(12, '#FFFFFF', 'Único', 8, 'PS5-WHITE'),

-- Smart TV LG 55" (ID: 13)
(13, '#000000', 'Único', 12, 'LG-TV-55-BLACK'),

-- Sofá Modular IKEA (ID: 14)
(14, '#F0E68C', 'Único', 5, 'IKEA-SOFA-BEIGE'),

-- Cama King Size (ID: 15)
(15, '#CD853F', 'Único', 8, 'IKEA-BED-BROWN');

-- 7. IMÁGENES DE PRODUCTOS
INSERT INTO images (image_url, color_code, color, product_id) VALUES
-- Camiseta Dry-Fit Pro
('https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/61734ec7-dad8-40f3-9b95-c7500939150a/dri-fit-miler-mens-running-top-M0D4QV.png', '#000000', 'Negro', 1),
('https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/2a8eb628-e25b-4b1b-9b1a-7b5c3d4e5f6g/dri-fit-miler-mens-running-top-M0D4QV.png', '#FFFFFF', 'Blanco', 1),
('https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/3c9fc639-f36c-5c2c-ac2b-8c6d4e5f6g7h/dri-fit-miler-mens-running-top-M0D4QV.png', '#FF0000', 'Rojo', 1),

-- Pantaloneta Running Elite
('https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/shorts-example-1.png', '#000000', 'Negro', 2),
('https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/shorts-example-2.png', '#0066CC', 'Azul', 2),

-- iPhone 15 Pro
('https://images.unsplash.com/photo-1511707171634-5f897ff02aa9', '#8E8E93', 'Titanio Natural', 8),
('https://images.unsplash.com/photo-1510557880182-3d4d3c1b9021', '#5E5CE6', 'Titanio Azul', 8),
('https://images.unsplash.com/photo-1519125323398-675f0ddb6308', '#F2F2F7', 'Titanio Blanco', 8),

-- Samsung Galaxy S24
('https://images.unsplash.com/photo-1517336714731-489689fd1ca8', '#000000', 'Negro', 9),
('https://images.unsplash.com/photo-1465101046530-73398c7f28ca', '#800080', 'Violeta', 9),

-- Tenis Nike
('https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/air-max-example.png', '#000000', 'Negro', 6),
('https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/air-max-example-white.png', '#FFFFFF', 'Blanco', 6),

-- PlayStation 5
('https://m.media-amazon.com/images/I/61UxfXTUyvL._AC_UF1000,1000_QL80_.jpg', '#FFFFFF', 'Blanco', 12),

-- Smart TV
('https://www.lg.com/content/dam/channel/wcms/latin/images/tvs/55up7750psb_awm_eail_latin_01.jpg', '#000000', 'Negro', 13),

-- Productos adicionales (imágenes genéricas)
('https://via.placeholder.com/500x500/FF6B6B/FFFFFF?text=Producto+3', '#FF6B6B', 'Rojo', 3),
('https://via.placeholder.com/500x500/4ECDC4/FFFFFF?text=Producto+4', '#4ECDC4', 'Verde Agua', 4),
('https://via.placeholder.com/500x500/45B7D1/FFFFFF?text=Producto+5', '#45B7D1', 'Azul', 5),
('https://via.placeholder.com/500x500/96CEB4/FFFFFF?text=Producto+7', '#96CEB4', 'Verde', 7),
('https://via.placeholder.com/500x500/FFEAA7/000000?text=Producto+10', '#FFEAA7', 'Dorado', 10),
('https://via.placeholder.com/500x500/DDA0DD/000000?text=Producto+11', '#DDA0DD', 'Blanco', 11),
('https://via.placeholder.com/500x500/F0E68C/000000?text=Producto+14', '#F0E68C', 'Beige', 14),
('https://via.placeholder.com/500x500/CD853F/FFFFFF?text=Producto+15', '#CD853F', 'Café', 15);

-- 8. DIRECCIONES DE USUARIOS
INSERT INTO addresses (address, country, city, department, is_default, user_id) VALUES 
-- Direcciones para Angel García (admin)
('Carrera 27 #34-56, Cabecera', 'Colombia', 'Bucaramanga', 'Santander', TRUE, 1),
('Calle 48 #29-45, Provenza', 'Colombia', 'Bucaramanga', 'Santander', FALSE, 1),

-- Direcciones para María López (admin)
('Avenida El Poblado #12-34', 'Colombia', 'Medellín', 'Antioquia', TRUE, 2),

-- Direcciones para usuarios regulares
('Calle 26 #47-89, Zona Rosa', 'Colombia', 'Bogotá', 'Cundinamarca', TRUE, 3),
('Carrera 15 #45-67, Centro', 'Colombia', 'Bogotá', 'Cundinamarca', FALSE, 3),
('Avenida 6 #23-45, San Fernando', 'Colombia', 'Cali', 'Valle del Cauca', TRUE, 4),
('Calle 70 #11-89, Zona Norte', 'Colombia', 'Barranquilla', 'Atlántico', TRUE, 5),
('Carrera 50 #76-12, Laureles', 'Colombia', 'Medellín', 'Antioquia', FALSE, 5),
('Calle 85 #15-34, Chapinero', 'Colombia', 'Bogotá', 'Cundinamarca', TRUE, 6),
('Avenida Las Palmas #45-67', 'Colombia', 'Medellín', 'Antioquia', FALSE, 6),
('Carrera 7 #123-45, Zona T', 'Colombia', 'Bogotá', 'Cundinamarca', TRUE, 7),
('Calle 100 #89-12, Santa Bárbara', 'Colombia', 'Bogotá', 'Cundinamarca', TRUE, 8),
('Avenida Santander #67-89', 'Colombia', 'Bucaramanga', 'Santander', TRUE, 9),
('Carrera 43A #34-56, El Poblado', 'Colombia', 'Medellín', 'Antioquia', TRUE, 10);

-- 9. CREAR CARRITOS DE EJEMPLO Y ACTUALIZAR STOCK TOTAL DE PRODUCTOS
INSERT INTO cart (user_id, total_price) VALUES
(3, 0), 
(4, 0), 
(5, 0); 

INSERT INTO cart_items (cart_id, product_id, quantity, unit_price, color_code, size) VALUES
(1, 1, 2, 89000, '#000000', 'M'), 
(1, 6, 1, 320000, '#FFFFFF', '40');

INSERT INTO cart_items (cart_id, product_id, quantity, unit_price, color_code, size) VALUES
(2, 4, 1, 120000, '#4ECDC4', 'S'),
(2, 8, 1, 4200000, '#8E8E93', 'Único'); 

-- 10. ACTUALIZAR STOCK TOTAL DE PRODUCTOS (suma de todas sus variantes)
UPDATE products SET stock = (
    SELECT COALESCE(SUM(pv.stock), 0)
    FROM product_variants pv
    WHERE pv.product_id = products.id
);
