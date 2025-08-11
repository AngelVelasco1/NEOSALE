-- Habilitar extensión para hash de contraseñas para admins
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
INSERT INTO brands (id, name, image_url) VALUES 
(1, 'Nike', 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/61734ec7-dad8-40f3-9b95-c7500939150a/dri-fit-miler-mens-running-top-M0D4QV.png'),
(2, 'Adidas', 'https://m.media-amazon.com/images/I/61pK9bZl+GL._AC_UF1000,1000_QL80_.jpg'),
(3, 'Puma', 'https://m.media-amazon.com/images/I/61v5ZtQ+1lL._AC_UF1000,1000_QL80_.jpg'),
(4, 'Under Armour', 'https://m.media-amazon.com/images/I/71v6i5p9ZTL._AC_UF1000,1000_QL80_.jpg'),
(5, 'Apple', 'https://m.media-amazon.com/images/I/71yzJoE7WlL._AC_UF1000,1000_QL80_.jpg'),
(6, 'Samsung', 'https://m.media-amazon.com/images/I/71w8c8AywJL._AC_UF1000,1000_QL80_.jpg'),
(7, 'Sony', 'https://m.media-amazon.com/images/I/61UxfXTUyvL._AC_UF1000,1000_QL80_.jpg'),
(8, 'LG', 'https://www.lg.com/content/dam/channel/wcms/latin/images/tvs/55up7750psb_awm_eail_latin_01.jpg'),
(9, 'IKEA', 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4'),
(10, 'Zara', 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f');

-- 4. USUARIOS
INSERT INTO "User" (name, email, email_verified, password, phone_number, identification, role) VALUES
-- Administradores
('María López', 'maria.admin@neosale.com', '2023-10-02 10:00:00', crypt('Admin123!', gen_salt('bf', 12)), '3012345678', '1098765432', 'admin'),
select * from cart;
select * from cart_items;
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

-- 5. PRODUCTOS
-- PRODUCTOS DEPORTIVOS
INSERT INTO products (name, description, price, stock, weight, sizes, active, category_id, brand_id, created_by, updated_by) VALUES
('Camiseta Dry-Fit Pro', 'Camiseta deportiva de alto rendimiento con tecnología de absorción de sudor.', 89000, 50, 0.25, 'XS,S,M,L,XL,XXL', TRUE, 1, 1, 1, 1),
('Pantaloneta Running Elite', 'Pantaloneta liviana para running con bolsillos laterales.', 75000, 35, 0.20, 'S,M,L,XL', TRUE, 2, 1, 1, 1),
('Camiseta Training Adidas', 'Camiseta de entrenamiento con diseño moderno.', 95000, 40, 0.30, 'S,M,L,XL,XXL', TRUE, 1, 2, 1, 1),
('Leggings Deportivos', 'Leggings de compresión para mujer.', 120000, 25, 0.35, 'XS,S,M,L,XL', TRUE, 2, 3, 1, 1),
('Chaqueta Deportiva Puma', 'Chaqueta resistente al viento con capucha.', 180000, 20, 0.80, 'S,M,L,XL', TRUE, 1, 3, 1, 1),

-- CALZADO DEPORTIVO
('Tenis Running Nike Air', 'Tenis de running con amortiguación avanzada.', 320000, 30, 0.90, '36,37,38,39,40,41,42,43,44', TRUE, 3, 1, 1, 1),
('Tenis Training Adidas', 'Tenis versátiles para entrenamiento.', 280000, 25, 0.85, '37,38,39,40,41,42,43', TRUE, 3, 2, 1, 1),

-- ELECTRÓNICOS
('iPhone 15 Pro', 'Smartphone Apple iPhone 15 Pro.', 4200000, 15, 0.19, 'Único', TRUE, 6, 5, 1, 1),
('Samsung Galaxy S24', 'Smartphone Samsung Galaxy S24.', 3800000, 20, 0.21, 'Único', TRUE, 6, 6, 1, 1),
('MacBook Air M2', 'Laptop Apple MacBook Air M2.', 5500000, 10, 1.24, 'Único', TRUE, 7, 5, 1, 1),
('AirPods Pro 2', 'Audífonos inalámbricos Apple.', 850000, 40, 0.05, 'Único', TRUE, 8, 5, 1, 1),
('PlayStation 5', 'Consola de videojuegos Sony PlayStation 5.', 2800000, 8, 4.5, 'Único', TRUE, 9, 7, 1, 1),

-- ELECTRODOMÉSTICOS Y HOGAR
('Smart TV LG 55"', 'Televisor LG 55 pulgadas 4K UHD.', 1800000, 12, 15.0, 'Único', TRUE, 8, 8, 1, 1),
('Sofá Modular IKEA', 'Sofá modular de 3 puestos en tela gris.', 1200000, 5, 45.0, 'Único', TRUE, 11, 9, 1, 1),
('Cama King Size', 'Cama matrimonial king size en madera.', 950000, 8, 60.0, 'Único', TRUE, 12, 9, 1, 1);

-- Actualizar productos con descuentos
UPDATE products SET discount = 15.0 WHERE name = 'Camiseta Dry-Fit Pro';
UPDATE products SET discount = 0.0 WHERE name = 'Pantaloneta Running Elite';
UPDATE products SET discount = 20.0 WHERE name = 'Camiseta Training Adidas';
UPDATE products SET discount = 10.0 WHERE name = 'Leggings Deportivos';
UPDATE products SET discount = 25.0 WHERE name = 'Chaqueta Deportiva Puma';

-- CALZADO DEPORTIVO
UPDATE products SET discount = 12.0 WHERE name = 'Tenis Running Nike Air';
UPDATE products SET discount = 18.0 WHERE name = 'Tenis Training Adidas';

-- ELECTRÓNICOS
UPDATE products SET discount = 5.0 WHERE name = 'iPhone 15 Pro';
UPDATE products SET discount = 8.0 WHERE name = 'Samsung Galaxy S24';
UPDATE products SET discount = 0.0 WHERE name = 'MacBook Air M2';
UPDATE products SET discount = 15.0 WHERE name = 'AirPods Pro 2';
UPDATE products SET discount = 0.0 WHERE name = 'PlayStation 5';

-- ELECTRODOMÉSTICOS Y HOGAR
UPDATE products SET discount = 30.0 WHERE name = 'Smart TV LG 55"';
UPDATE products SET discount = 22.0 WHERE name = 'Sofá Modular IKEA';
UPDATE products SET discount = 35.0 WHERE name = 'Cama King Size';
select * from products;-- 6. IMÁGENES DE PRODUCTOS
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
('https://via.placeholder.com/500x500/4ECDC4/FFFFFF?text=Producto+4', '#4ECDC4', 'Verde', 4),
('https://via.placeholder.com/500x500/45B7D1/FFFFFF?text=Producto+5', '#45B7D1', 'Azul', 5),
('https://via.placeholder.com/500x500/96CEB4/FFFFFF?text=Producto+7', '#96CEB4', 'Verde', 7),
('https://via.placeholder.com/500x500/FFEAA7/000000?text=Producto+10', '#FFEAA7', 'Amarillo', 10),
('https://via.placeholder.com/500x500/DDA0DD/000000?text=Producto+11', '#DDA0DD', 'Rosa', 11),
('https://via.placeholder.com/500x500/F0E68C/000000?text=Producto+14', '#F0E68C', 'Beige', 14),
('https://via.placeholder.com/500x500/CD853F/FFFFFF?text=Producto+15', '#CD853F', 'Café', 15);

-- 8. DIRECCIONES DE USUARIOS
INSERT INTO addresses (address, country, city, department, is_default, user_id) VALUES 
-- Direcciones para Angel García (admin)
('Carrera 27 #34-56, Cabecera', 'Colombia', 'Bucaramanga', 'Santander', TRUE, 1),
('Calle 48 #29-45, Provenza', 'Colombia', 'Bucaramanga', 'Santander', FALSE, 1),

-- Direcciones para María López (admin)
('Avenida El Poblado #12-34', 'Colombia', 'Medellín', 'Antioquia', TRUE, 8),

-- Direcciones para usuarios regulares
('Calle 26 #47-89, Zona Rosa', 'Colombia', 'Bogotá', 'Cundinamarca', TRUE, 9),
('Carrera 15 #45-67, Centro', 'Colombia', 'Bogotá', 'Cundinamarca', FALSE, 9),
('Avenida 6 #23-45, San Fernando', 'Colombia', 'Cali', 'Valle del Cauca', TRUE, 4),
('Calle 70 #11-89, Zona Norte', 'Colombia', 'Barranquilla', 'Atlántico', TRUE, 7),
('Carrera 50 #76-12, Laureles', 'Colombia', 'Medellín', 'Antioquia', FALSE, 7),
('Calle 85 #15-34, Chapinero', 'Colombia', 'Bogotá', 'Cundinamarca', TRUE, 8),
('Avenida Las Palmas #45-67', 'Colombia', 'Medellín', 'Antioquia', FALSE, 8),
('Carrera 7 #123-45, Zona T', 'Colombia', 'Bogotá', 'Cundinamarca', TRUE, 9),
('Calle 100 #89-12, Santa Bárbara', 'Colombia', 'Bogotá', 'Cundinamarca', TRUE, 10),
('Avenida Santander #67-89', 'Colombia', 'Bucaramanga', 'Santander', TRUE, 11),
('Carrera 43A #34-56, El Poblado', 'Colombia', 'Medellín', 'Antioquia', TRUE, 11);


-- Verificar usuarios creados
SELECT id, name, email, role, 
       CASE WHEN password LIKE '$2%' THEN 'Hasheada correctamente' ELSE 'Sin hashear' END as password_status
FROM "User" 
ORDER BY id;

-- Verificar productos con sus categorías y marcas
SELECT p.id, p.name as producto, p.price, p.stock, 
       c.name as categoria, b.name as marca
FROM products p
JOIN categories c ON p.category_id = c.id
JOIN brands b ON p.brand_id = b.id
ORDER BY p.id;

-- Verificar imágenes por producto
SELECT p.name as producto, i.color, i.imageurl
FROM products p
LEFT JOIN images i ON p.id = i.product_id
ORDER BY p.id, i.id;

-- Verificar direcciones por usuario
SELECT u.name as usuario, a.address, a.city, a.department
FROM "User" u
JOIN addresses a ON u.id = a.user_id
ORDER BY u.id;
