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
DROP TABLE IF EXISTS "User";

CREATE TABLE "User" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified TIMESTAMP(6),
    password VARCHAR(255),
    image VARCHAR(255),
    phone_number VARCHAR(20) UNIQUE CHECK (
        phone_number ~ '^3\d{9}$' -- Inicia en 3 y 10 dígitos
        OR phone_number IS NULL
    ),
    identification VARCHAR(20) UNIQUE CHECK (
        identification ~ '^\d{6,12}$' -- Cédula/RUT: 6 a 12 dígitos
        OR identification IS NULL
    ),
    role roles_enum DEFAULT 'user' NOT NULL,
    active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP(6) DEFAULT NULL
);


CREATE TABLE brands (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    active BOOLEAN DEFAULT TRUE NOT NULL,
    image_url VARCHAR(255)
);

CREATE TABLE subcategories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    active BOOLEAN DEFAULT TRUE NOT NULL

);


CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    id_subcategory INTEGER,
    active BOOLEAN DEFAULT TRUE NOT NULL,
    FOREIGN KEY (id_subcategory) REFERENCES subcategories(id) ON DELETE NO ACTION ON UPDATE NO ACTION
);


CREATE TABLE category_subcategory (
    category_id INTEGER NOT NULL,
    subcategory_id INTEGER NOT NULL,
    PRIMARY KEY (category_id, subcategory_id),
    active BOOLEAN DEFAULT TRUE NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    FOREIGN KEY (subcategory_id) REFERENCES subcategories(id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE coupons (
    id SERIAL PRIMARY KEY,
    code VARCHAR(255) NOT NULL,
    discount DECIMAL(8,2) NOT NULL CHECK (discount >= 0 AND discount <= 100),
    active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    expires_at TIMESTAMP(6) NOT NULL
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price INTEGER NOT NULL CHECK (price >= 0),
    stock INTEGER NOT NULL CHECK (stock >= 0),
    weight DECIMAL(8,2) NOT NULL CHECK (weight >= 0),
    sizes VARCHAR(255) NOT NULL,
    discount DECIMAL(8,2) DEFAULT 0 NOT NULL CHECK (discount >= 0 AND discount <= 100),
    category_id INTEGER NOT NULL,
    brand_id INTEGER NOT NULL,
    active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by INTEGER NOT NULL,
    updated_at TIMESTAMP(6),
    updated_by INTEGER NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE cart (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    session_token UUID,
    total_price INTEGER NOT NULL CHECK (total_price >= 0),
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    expires_at TIMESTAMP(6),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    status orders_status_enum NOT NULL,
    total INTEGER NOT NULL CHECK (total >= 0),
    payment_method orders_paymentmethod_enum NOT NULL,
    payment_status BOOLEAN NOT NULL,
    transaction_id VARCHAR(255) NOT NULL,
    user_id INTEGER NOT NULL,
    coupon_id INTEGER,
    shipping_address_id INTEGER NOT NULL,
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP(6),
    updated_by INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE "Account" (
    user_id INTEGER NOT NULL,
    type VARCHAR(255) NOT NULL,
    provider VARCHAR(255) NOT NULL,
    provider_account_id VARCHAR(255) NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at INTEGER,
    token_type VARCHAR(255),
    scope VARCHAR(255),
    id_token TEXT,
    session_state VARCHAR(255),
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (provider, provider_account_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE addresses (
    id SERIAL PRIMARY KEY,
    address VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    is_default BOOLEAN NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    cart_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price INTEGER NOT NULL CHECK (unit_price >= 0),
    expires_at TIMESTAMP(6) NOT NULL,
    FOREIGN KEY (cart_id) REFERENCES cart(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE images (
    id SERIAL PRIMARY KEY,
    image_url VARCHAR(255) NOT NULL,
    color_code VARCHAR(7) NOT NULL,
    color VARCHAR(255) NOT NULL,
    product_id INTEGER NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE NO ACTION ON UPDATE NO ACTION
);



CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    price INTEGER NOT NULL CHECK (price >= 0),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    subtotal INTEGER NOT NULL CHECK (subtotal >= 0),
    product_id INTEGER NOT NULL,
    order_id INTEGER NOT NULL,
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP(6),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE order_logs (
    id SERIAL PRIMARY KEY,
    previous_status orders_status_enum NOT NULL,
    new_status orders_status_enum NOT NULL,
    note VARCHAR(255),
    ip_address VARCHAR(45) NOT NULL,
    order_id INTEGER NOT NULL,
    updated_at TIMESTAMP(6),
    updated_by INTEGER NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5)    comment TEXT,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Indices para optimización
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_brand_id ON products(brand_id);
CREATE INDEX idx_cart_user_id ON cart(user_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_images_product_id ON images(product_id);


