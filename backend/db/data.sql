CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO IMAGES (imageurl, colorCode, color, productId) VALUES('https://th.bing.com/th/id/OIP.NtbXEGx2PNplzcgQa44REAHaEo?rs=1&pid=ImgDetMain', '#000', 'black', 2);

INSERT INTO subcategory (name) VALUES ('camisas deportivas');

INSERT INTO categories (name, idsubcategory)
VALUES ('Ropa deportiva', 1);

INSERT INTO brands (id, name, imageurl)
VALUES (2, 'Adidas', 'https://example.com/nike-logo.png');
SELECT * from "User";
INSERT INTO "User" (name, email, "emailVerified", password, phonenumber, identification, role)
VALUES(
  'Angel',
  'angelgg@gmail.com',
  '2023-10-01 12:00:00',
  crypt('@Angel123', gen_salt('bf', 12)),  -- ✅ Hashea la contraseña con bcrypt
  '3001234567',
  '1098144574',
  'admin'
);

DELETE FROM "User" WHERE email = 'angelgg@gmail.com';
INSERT INTO PRODUCTS (
  name,
  description,
  price,
  stock,
  weight,
  sizes,
  isActive,
  categoryId,
  brandId,
  createdBy,
  updatedBy
)
VALUES (
  'Camisa ',
  'Camisaaaaa',
  95000,
  30,
  0.25,
  'S,M,L,XL',
  TRUE,
  2,  -- ID categoría
  2,  -- ID marca
  1,  -- ID del usuario que crea
  1   -- ID del usuario que actualiza
);


INSERT INTO PRODUCTS (
  name,
  description,
  price,
  stock,
  weight,
  sizes,
  isActive,
  categoryId,
  brandId,
  createdBy,
  updatedBy
)
VALUES (
  'Camiseta Dry-Fit',
  'Camiseta deportiva de alto rendimiento con tecnología de absorción de sudor.',
  95000,
  30,
  0.25,
  'XS ,S,M,L,XL',
  TRUE,
  1,  -- ID categoría
  1,  -- ID marca
  1,  -- ID del usuario que crea
  1   -- ID del usuario que actualiza
);

INSERT INTO PRODUCTS (
  name,
  description,
  price,
  stock,
  weight,
  sizes,
  isActive,
  categoryId,
  brandId,
  createdBy,
  updatedBy
)
VALUES (
  'Camiseta Dry-Fit',
  'Camiseta deportiva de alto rendimiento con tecnología de absorción de sudor.',
  95000,
  30,
  0.25,
  'S,M,L,XL',
  TRUE,
  4,  -- ID categoría
  1,  -- ID marca
  1,  -- ID del usuario que crea
  1   -- ID del usuario que actualiza
);

INSERT INTO PRODUCTS (
  name,
  description,
  price,
  stock,
  weight,
  sizes,
  isActive,
  categoryId,
  brandId,
  createdBy,
  updatedBy
)
VALUES (
  'Camiseta Dry-Fit',
  'Camiseta deportiva de alto rendimiento con tecnología de absorción de sudor.',
  95000,
  30,
  0.25,
  'S,M,L,XL',
  TRUE,
  4,  -- ID categoría
  1,  -- ID marca
  1,  -- ID del usuario que crea
  1   -- ID del usuario que actualiza
);



INSERT INTO PRODUCTS (
  name,
  description,
  price,
  stock,
  weight,
  sizes,
  isActive,
  categoryId,
  brandId,
  createdBy,
  updatedBy
)
VALUES (
  'Pantaloneta Dry-Fit',
  'la mejor pantaloneta',
  95000,
  30,
  0.25,
  'S,M,L,XL',
  TRUE,
  1,  -- ID categoría
  1,  -- ID marca
  2,  -- ID del usuario que crea
  2   -- ID del usuario que actualiza
);

INSERT INTO Addresses (address, country, city, department, userId) 
VALUES ('Calle Falsa 123', 'Colombia', 'Bucaramanga', 'Santander', 1),
('Avenida Siempre Viva 456', 'Colombia', 'Medellin', 'Antioquia', 1);
