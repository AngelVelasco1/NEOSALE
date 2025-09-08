CREATE DATABASE neosale;

DROP TABLE IF EXISTS review_images;
DROP TABLE IF EXISTS favorites;
DROP TABLE IF EXISTS order_logs;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS images;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS "Account";

-- 2. Tablas con dependencias intermedias
DROP TABLE IF EXISTS product_variants;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS cart;
DROP TABLE IF EXISTS addresses;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS coupons;
DROP TABLE IF EXISTS category_subcategory;

-- 3. Tablas base (referenciadas por otras)
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS subcategories;
DROP TABLE IF EXISTS brands;
DROP TABLE IF EXISTS "User";

-- 4. Tablas de NextAuth que no se usan en el esquema principal
DROP TABLE IF EXISTS "verificationtoken";

-- TIPOS ENUM
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_method_enum') THEN
        CREATE TYPE payment_method_enum AS ENUM ('paypal', 'efecty', 'pse', 'credit_card', 'debit_card', 'mercadopago');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'orders_status_enum') THEN
        CREATE TYPE orders_status_enum AS ENUM ('pending', 'confirmed', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'roles_enum') THEN
        CREATE TYPE roles_enum AS ENUM ('user', 'admin', 'super_admin');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_type_enum') THEN
        CREATE TYPE notification_type_enum AS ENUM (
            'order_confirmed',     -- Orden confirmada
            'order_shipped',       -- Orden enviada
            'order_delivered',     -- Orden entregada
            'price_drop',          -- Bajada de precio
            'back_in_stock',       -- Producto disponible
            'review_request',      -- Solicitud de review
            'promotion'            -- Promoción especial
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'return_status_enum') THEN
        CREATE TYPE return_status_enum AS ENUM ('requested', 'approved', 'rejected', 'processed', 'refunded');
    END IF;
END $$;



-- CREACION DE TABLAS EN ORDEN
CREATE TABLE "User" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified TIMESTAMP(6),
    password VARCHAR(255),
    image VARCHAR(255),
    phone_number VARCHAR(20) UNIQUE,
    identification VARCHAR(20) UNIQUE,
    identification_type VARCHAR(10),
    role roles_enum DEFAULT 'user' NOT NULL,
    active BOOLEAN DEFAULT TRUE NOT NULL,
    email_notifications BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP(6) DEFAULT NULL,
    
    CONSTRAINT chk_user_phone CHECK (phone_number ~ '^3\d{9}$' OR phone_number IS NULL),
    CONSTRAINT chk_user_identification CHECK (identification ~ '^\d{6,12}$' OR identification IS NULL),
    CONSTRAINT chk_user_identification_type CHECK (identification_type IN ('CC', 'CE', 'PP'))
);

CREATE TABLE brands (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description VARCHAR(500),
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
    description VARCHAR(500),
    id_subcategory INTEGER REFERENCES subcategories(id) ON DELETE NO ACTION,
    active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE TABLE category_subcategory (
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE NO ACTION,
    subcategory_id INTEGER NOT NULL REFERENCES subcategories(id) ON DELETE NO ACTION,
    active BOOLEAN DEFAULT TRUE NOT NULL,
    PRIMARY KEY (category_id, subcategory_id)
);

CREATE TABLE coupons (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    discount_type VARCHAR(255) NOT NULL,
    discount_value DECIMAL(10,2) NOT NULL,
    min_purchase_amount DECIMAL(10,2) DEFAULT 0,
    usage_limit INTEGER,
    usage_count INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT TRUE NOT NULL,
    created_by INTEGER NOT NULL,
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    expires_at TIMESTAMP(6) NOT NULL,
    
    CONSTRAINT chk_coupon_discount_type CHECK (discount_type IN ('percentage', 'fixed')),
    CONSTRAINT chk_coupon_discount_value_positive CHECK (discount_value > 0),
    CONSTRAINT chk_coupon_discount_value_valid CHECK (
        (discount_type = 'percentage' AND discount_value > 0 AND discount_value <= 100) OR
        (discount_type = 'fixed' AND discount_value > 0)
    ),
    CONSTRAINT chk_coupon_dates CHECK (created_at < expires_at)
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(500) NOT NULL,
    price INTEGER NOT NULL,
    stock INTEGER NOT NULL,
    weight_grams INTEGER NOT NULL,
    sizes VARCHAR(255) NOT NULL,
    base_discount DECIMAL(8,2) DEFAULT 0 NOT NULL,
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE NO ACTION,
    brand_id INTEGER NOT NULL REFERENCES brands(id) ON DELETE NO ACTION,
    active BOOLEAN DEFAULT TRUE NOT NULL,
    in_offer BOOLEAN DEFAULT FALSE NOT NULL,
    offer_discount DECIMAL(10,2),
    offer_start_date TIMESTAMP(6),
    offer_end_date TIMESTAMP(6),
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by INTEGER NOT NULL,
    updated_at TIMESTAMP(6),
    updated_by INTEGER NOT NULL,
    
    CONSTRAINT chk_product_price CHECK (price > 0),
    CONSTRAINT chk_product_stock CHECK (stock >= 0),
    CONSTRAINT chk_product_weight CHECK (weight_grams > 0),
    CONSTRAINT chk_product_base_discount CHECK (base_discount >= 0 AND base_discount <= 100),
    CONSTRAINT chk_product_offer_discount CHECK (offer_discount > 0),
    CONSTRAINT chk_product_offer_dates CHECK (
        (in_offer = FALSE) OR
        (in_offer = TRUE AND 
         offer_start_date IS NOT NULL AND 
         offer_end_date IS NOT NULL AND 
         offer_start_date < offer_end_date AND
         offer_end_date > CURRENT_TIMESTAMP)
    )
);

CREATE TABLE product_variants (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    color_code VARCHAR(7) NOT NULL,
    size VARCHAR(25) NOT NULL,
    stock INTEGER NOT NULL,
    sku VARCHAR(100), 
    price INTEGER,
    weight_grams INTEGER,
    active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP(6),
    
    CONSTRAINT chk_variant_stock CHECK (stock >= 0),
    CONSTRAINT chk_variant_price CHECK (price > 0),
    CONSTRAINT chk_variant_weight CHECK (weight_grams > 0),
    CONSTRAINT unq_product_variant UNIQUE(product_id, color_code, size)
);

CREATE TABLE cart (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES "User"(id) ON DELETE CASCADE,
    session_token UUID UNIQUE,
    subtotal INTEGER NOT NULL,
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    expires_at TIMESTAMP(6),
    
    CONSTRAINT chk_cart_subtotal CHECK (subtotal >= 0),
    CONSTRAINT chk_cart_user_or_session CHECK (user_id IS NOT NULL OR session_token IS NOT NULL)
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    status orders_status_enum NOT NULL,
    subtotal INTEGER NOT NULL,
    discount INTEGER DEFAULT 0,
    shipping_cost INTEGER NOT NULL,
    taxes INTEGER NOT NULL,
    total INTEGER NOT NULL,
    payment_method payment_method_enum NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'pending',
    transaction_id VARCHAR(255),
    paid_at TIMESTAMP(6),
    shipping_address_id INTEGER NOT NULL,
    user_note VARCHAR(255),
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP(6),
    shipped_at TIMESTAMP(6),
    delivered_at TIMESTAMP(6),
    updated_by INTEGER NOT NULL,
    user_id INTEGER NOT NULL REFERENCES "User"(id) ON DELETE NO ACTION,
    coupon_id INTEGER REFERENCES coupons(id) ON DELETE NO ACTION,
    
    CONSTRAINT chk_order_subtotal CHECK (subtotal > 0),
    CONSTRAINT chk_order_discount CHECK (discount >= 0),
    CONSTRAINT chk_order_shipping_cost CHECK (shipping_cost >= 0),
    CONSTRAINT chk_order_taxes CHECK (taxes >= 0),
    CONSTRAINT chk_order_total CHECK (total > 0),
    CONSTRAINT chk_order_payment_status CHECK (payment_status IN ('pending', 'paid', 'failed'))
);

CREATE TABLE "Account" (
    user_id INTEGER NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
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
    PRIMARY KEY (provider, provider_account_id)
);

CREATE TABLE addresses (
    id SERIAL PRIMARY KEY,
    address VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    is_default BOOLEAN NOT NULL,
    user_id INTEGER NOT NULL REFERENCES "User"(id) ON DELETE NO ACTION,
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    cart_id INTEGER NOT NULL REFERENCES cart(id) ON DELETE NO ACTION,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE NO ACTION,
    quantity INTEGER NOT NULL,
    unit_price INTEGER NOT NULL,
    color_code VARCHAR(7) NOT NULL,
    size VARCHAR(25) NOT NULL,
    
    CONSTRAINT chk_cart_item_quantity CHECK (quantity > 0),
    CONSTRAINT chk_cart_item_price CHECK (unit_price >= 0)
);

CREATE TABLE images (
    id SERIAL PRIMARY KEY,
    image_url VARCHAR(255) NOT NULL,
    color_code VARCHAR(7) NOT NULL,
    color VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    variant_id INTEGER REFERENCES product_variants(id) ON DELETE CASCADE
);

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    price INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    subtotal INTEGER NOT NULL,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE NO ACTION,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE NO ACTION,
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP(6),
    
    CONSTRAINT chk_order_item_price CHECK (price >= 0),
    CONSTRAINT chk_order_item_quantity CHECK (quantity > 0),
    CONSTRAINT chk_order_item_subtotal CHECK (subtotal >= 0)
);

CREATE TABLE order_logs (
    id SERIAL PRIMARY KEY,
    previous_status orders_status_enum NOT NULL,
    new_status orders_status_enum NOT NULL,
    note VARCHAR(500),
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE NO ACTION,
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP(6),
    updated_by INTEGER NOT NULL REFERENCES "User"(id) ON DELETE NO ACTION,
    user_type VARCHAR(20) DEFAULT 'admin',
    
    CONSTRAINT chk_order_log_user_type CHECK (user_type IN ('admin', 'system'))
);

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL,
    comment TEXT,
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP(6),
    
    CONSTRAINT chk_review_rating CHECK (rating >= 1 AND rating <= 5)
);

CREATE TABLE review_images (
    id SERIAL PRIMARY KEY,
    review_id INTEGER NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    CONSTRAINT unq_user_product_favorite UNIQUE(user_id, product_id)
);

-- Para otra version
/* CREATE TABLE returns (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE NO ACTION,
    user_id INTEGER NOT NULL REFERENCES "User"(id) ON DELETE NO ACTION,
    reason VARCHAR(255) NOT NULL,
    description VARCHAR(500),
    status return_status_enum DEFAULT 'requested' NOT NULL,
    refund_amount INTEGER,
    admin_response TEXT,
    images VARCHAR(255)[],
    requested_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    processed_at TIMESTAMP(6),
    refunded_at TIMESTAMP(6),
    processed_by INTEGER REFERENCES "User"(id) ON DELETE NO ACTION,
    
    CONSTRAINT chk_return_refund_amount CHECK (refund_amount >= 0)
);

CREATE TABLE return_items (
    id SERIAL PRIMARY KEY,
    return_id INTEGER NOT NULL REFERENCES returns(id) ON DELETE CASCADE,
    order_item_id INTEGER NOT NULL REFERENCES order_items(id) ON DELETE NO ACTION,
    quantity INTEGER NOT NULL,
    reason VARCHAR(255),
    
    CONSTRAINT chk_return_item_quantity CHECK (quantity > 0)
); */
select * from products;
-- INDICES

-- Usuarios
CREATE INDEX idx_user_email ON "User"(email);
CREATE INDEX idx_user_phone ON "User"(phone_number);
CREATE INDEX idx_user_active ON "User"(active);

-- Productos
CREATE INDEX idx_product_category ON products(category_id);
CREATE INDEX idx_product_brand ON products(brand_id);
CREATE INDEX idx_product_active ON products(active);
CREATE INDEX idx_product_status ON products(active, in_offer);
CREATE INDEX idx_product_price ON products(price);

-- Variantes de productos
CREATE INDEX idx_variant_product ON product_variants(product_id);
CREATE INDEX idx_variant_sku ON product_variants(sku) WHERE sku IS NOT NULL;
CREATE INDEX idx_variant_stock ON product_variants(stock) WHERE stock > 0;

-- Categorías
CREATE INDEX idx_category_active ON categories(active);
CREATE INDEX idx_category_subcategory ON categories(id_subcategory);

-- Subcategorías
CREATE INDEX idx_subcategory_active ON subcategories(active);

-- Marcas
CREATE INDEX idx_brand_active ON brands(active);
CREATE INDEX idx_brand_name ON brands(name);

-- Cupones
CREATE INDEX idx_coupon_code ON coupons(code); 
CREATE INDEX idx_coupon_valid ON coupons(active, expires_at) WHERE active = TRUE;
CREATE INDEX idx_coupon_usage ON coupons(usage_count, usage_limit) WHERE active = TRUE;

-- Carrito
CREATE INDEX idx_cart_user ON cart(user_id);

-- Items del carrito
CREATE INDEX idx_cart_item_cart ON cart_items(cart_id);
CREATE INDEX idx_cart_item_product ON cart_items(product_id);

-- Órdenes
CREATE INDEX idx_order_user ON orders(user_id);
CREATE INDEX idx_order_status ON orders(status);
CREATE INDEX idx_order_payment_status ON orders(payment_status);
CREATE INDEX idx_order_updated ON orders(updated_at);
CREATE INDEX idx_order_address ON orders(shipping_address_id);

-- Items de órdenes
CREATE INDEX idx_order_item_order ON order_items(order_id);
CREATE INDEX idx_order_item_product ON order_items(product_id);

-- Logs de órdenes
CREATE INDEX idx_order_log_order ON order_logs(order_id);
CREATE INDEX idx_order_log_status ON order_logs(new_status);

-- Direcciones
CREATE INDEX idx_address_user ON addresses(user_id);
CREATE INDEX idx_address_default ON addresses(user_id) WHERE is_default = TRUE;

-- Imágenes
CREATE INDEX idx_image_product ON images(product_id);
CREATE INDEX idx_image_primary ON images(product_id) WHERE is_primary = TRUE;

-- Reviews
CREATE INDEX idx_review_product ON reviews(product_id);
CREATE INDEX idx_review_user ON reviews(user_id);
CREATE INDEX idx_review_rating ON reviews(rating);

-- Review Images
CREATE INDEX idx_review_image_review ON review_images(review_id);

-- Favoritos
CREATE INDEX idx_favorite_user ON favorites(user_id);
CREATE INDEX idx_favorite_product ON favorites(product_id);

-- Devoluciones (comentado porque las tablas están comentadas)
-- CREATE INDEX idx_return_order ON returns(order_id);
-- CREATE INDEX idx_return_user ON returns(user_id);
-- CREATE INDEX idx_return_status ON returns(status) WHERE status IN ('requested', 'approved');

-- Items de devoluciones (comentado porque las tablas están comentadas)
-- CREATE INDEX idx_return_item_return ON return_items(return_id);
-- CREATE INDEX idx_return_item_order_item ON return_items(order_item_id);

-- Variantes disponibles (con stock)
CREATE INDEX idx_variant_available ON product_variants(product_id, active, stock) 
WHERE active = TRUE AND stock > 0;

-- Búsqueda de productos por nombre
CREATE INDEX idx_product_name_search ON products USING gin(to_tsvector('spanish', name));
