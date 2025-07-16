INSERT INTO IMAGES (imageurl, colorCode, color, productId) VALUES('https://th.bing.com/th/id/OIP.NtbXEGx2PNplzcgQa44REAHaEo?rs=1&pid=ImgDetMain', '#00A6CB', 'Blue', 1),
('https://th.bing.com/th/id/OIP.P9dxcum1kbgLaBdw2F_3EQHaE_?rs=1&pid=ImgDetMain', '#FF0000', 'Red', 1);

INSERT INTO subcategory (name) VALUES ('pantalones deportivos');

INSERT INTO categories (name, idsubcategory)
VALUES ('Ropa deportiva', 1);

INSERT INTO brands (id, name, imageurl)
VALUES (1, 'Nike', 'https://example.com/nike-logo.png');

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
