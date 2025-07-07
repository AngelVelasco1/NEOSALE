CREATE DATABASE neosale;
-- Tipos ENUM
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'orders_paymentmethod_enum') THEN
        CREATE TYPE orders_paymentmethod_enum AS ENUM ('paypal', 'nequi', 'efecty');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'orders_status_enum') THEN
        CREATE TYPE orders_status_enum AS ENUM ('pending', 'paid', 'processing', 'shipped', 'delivered');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'roles_enum') THEN
        CREATE TYPE roles_enum AS ENUM ('user', 'admin');
    END IF;
END $$;
select * from users;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS order_logs;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS images;
DROP TABLE IF EXISTS addresses;
DROP TABLE IF EXISTS category_subcategory;
DROP TABLE IF EXISTS "Account";
DROP TABLE IF EXISTS cart;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS coupons;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS subcategory;
DROP TABLE IF EXISTS brands;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    emailverified BOOLEAN,
    password VARCHAR(255),
    phonenumber VARCHAR(255) UNIQUE NOT NULL,
    identification VARCHAR(255) UNIQUE,
    role roles_enum DEFAULT 'user' NOT NULL,
    "createdAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Tabla brands
CREATE TABLE brands (
    id INTEGER PRIMARY KEY NOT NULL,
    name VARCHAR(255) NOT NULL,
    imageurl VARCHAR(255)
);

-- Tabla subcategory
CREATE TABLE subcategory (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Tabla categories (actualizada)
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    idsubcategory INTEGER NOT NULL,
    FOREIGN KEY (idsubcategory) REFERENCES subcategory(id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Tabla category_subcategory
CREATE TABLE category_subcategory (
    categoryid INTEGER NOT NULL,
    subcategoryid INTEGER NOT NULL,
    PRIMARY KEY (categoryid, subcategoryid),
    FOREIGN KEY (categoryid) REFERENCES categories(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    FOREIGN KEY (subcategoryid) REFERENCES subcategory(id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Tabla coupons
CREATE TABLE coupons (
    id SERIAL PRIMARY KEY,
    code VARCHAR(255) NOT NULL,
    discount DECIMAL(8,2) NOT NULL,
    createdat TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    expiresat TIMESTAMP(6) NOT NULL
);

-- Tabla products
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price INTEGER NOT NULL,
    stock INTEGER NOT NULL,
    weight DECIMAL(8,2) NOT NULL,
    sizes VARCHAR(255) NOT NULL,
    isactive BOOLEAN NOT NULL,
    categoryid INTEGER NOT NULL,
    brandid INTEGER NOT NULL,
    createdat TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    createdby INTEGER NOT NULL,
    updatedat TIMESTAMP(6),
    updatedby INTEGER NOT NULL,
    FOREIGN KEY (categoryid) REFERENCES categories(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    FOREIGN KEY (brandid) REFERENCES brands(id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Tabla cart
CREATE TABLE cart (
    id SERIAL PRIMARY KEY,
    userid INTEGER,
    sessiontoken UUID,
    totalprice INTEGER NOT NULL,
    createdat TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    expiresat TIMESTAMP(6),
    FOREIGN KEY (userid) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Tabla orders
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    status orders_status_enum NOT NULL,
    total INTEGER NOT NULL,
    paymentmethod orders_paymentmethod_enum NOT NULL,
    paymentstatus BOOLEAN NOT NULL,
    transactionid VARCHAR(255) NOT NULL,
    userid INTEGER NOT NULL,
    couponid INTEGER,
    createdat TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updatedat TIMESTAMP(6),
    updatedby INTEGER NOT NULL,
    FOREIGN KEY (userid) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    FOREIGN KEY (couponid) REFERENCES coupons(id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Tabla Account (para Auth js)
CREATE TABLE "Account" (
    "userId" INTEGER NOT NULL,
    type VARCHAR(255) NOT NULL,
    provider VARCHAR(255) NOT NULL,
    "providerAccountId" VARCHAR(255) NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at INTEGER,
    token_type VARCHAR(255),
    scope VARCHAR(255),
    id_token TEXT,
    session_state VARCHAR(255),
    "createdAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (provider, "providerAccountId"),
    FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla addresses
CREATE TABLE addresses (
    id SERIAL PRIMARY KEY,
    address VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    userid INTEGER NOT NULL,
    createdat TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (userid) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Tabla cart_items
CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    cartid INTEGER NOT NULL,
    productid INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    unitprice INTEGER NOT NULL,
    expiresat TIMESTAMP(6) NOT NULL,
    FOREIGN KEY (cartid) REFERENCES cart(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    FOREIGN KEY (productid) REFERENCES products(id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Tabla images
CREATE TABLE images (
    id SERIAL PRIMARY KEY,
    imageurl VARCHAR(255) NOT NULL,
    colorcode VARCHAR(7) NOT NULL,
    color VARCHAR(255) NOT NULL,
    productid INTEGER NOT NULL,
    FOREIGN KEY (productid) REFERENCES products(id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Tabla order_items
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    price INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    subtotal INTEGER GENERATED ALWAYS AS (price * quantity) STORED,
    productid INTEGER NOT NULL,
    orderid INTEGER NOT NULL,
    createdat TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updatedat TIMESTAMP(6),
    FOREIGN KEY (productid) REFERENCES products(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    FOREIGN KEY (orderid) REFERENCES orders(id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Tabla order_logs
CREATE TABLE order_logs (
    id SERIAL PRIMARY KEY,
    previousstatus orders_status_enum NOT NULL,
    newstatus orders_status_enum NOT NULL,
    note VARCHAR(255),
    ipaddress VARCHAR(45) NOT NULL,
    orderid INTEGER NOT NULL,
    updatedat TIMESTAMP(6),
    updatedby INTEGER NOT NULL,
    FOREIGN KEY (orderid) REFERENCES orders(id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Tabla reviews
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    rating INTEGER NOT NULL,
    comment TEXT,
    userid INTEGER NOT NULL,
    productid INTEGER NOT NULL,
    createdat TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (userid) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    FOREIGN KEY (productid) REFERENCES products(id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Indices para optimización
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_products_categoryid ON products(categoryid);
CREATE INDEX idx_products_brandid ON products(brandid);
CREATE INDEX idx_cart_userid ON cart(userid);
CREATE INDEX idx_orders_userid ON orders(userid);
CREATE INDEX idx_reviews_productid ON reviews(productid);
CREATE INDEX idx_images_productid ON images(productid);


