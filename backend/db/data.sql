INSERT INTO USERS (name, email, emailVerified, password, phoneNumber, roleId) VALUES
('Angel Perez', 'angel@example.com', TRUE, 'hashedpassword123', '3001234567', 1),
('Maria Gomez', 'maria@example.com', FALSE, 'hashedpassword456', '3129876543', 2),
('Carlos Lopez', 'carlos@example.com', TRUE, 'hashedpassword789', '3156543210', 2);

INSERT INTO IMAGES (imageurl, colorcode, color, productid) VALUES('https://th.bing.com/th/id/OIP.NtbXEGx2PNplzcgQa44REAHaEo?rs=1&pid=ImgDetMain', '#00A6CB', 'Blue', 1),
('https://th.bing.com/th/id/OIP.P9dxcum1kbgLaBdw2F_3EQHaE_?rs=1&pid=ImgDetMain', '#FF0000', 'Red', 2),
('https://th.bing.com/th/id/OIP.NtbXEGx2PNplzcgQa44REAHaEo?rs=1&pid=ImgDetMain', '#00FF00', 'Green', 2);
UPDATE IMAGES SET colorcode = '#FFF', color = 'Gray' WHERE id = 1;
INSERT INTO subcategory (name) VALUES ('pantalones deportivos');

INSERT INTO categories (name, idSubcategory)
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
  2,  -- ID categoría
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
  2,  -- ID categoría
  1,  -- ID marca
  1,  -- ID del usuario que crea
  1   -- ID del usuario que actualiza
);


SELECT * FROM products;