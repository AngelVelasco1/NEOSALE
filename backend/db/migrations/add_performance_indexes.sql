-- 🚀 OPTIMIZACIÓN DE ÍNDICES PARA NEOSALE
-- Este script agrega índices en campos frecuentemente consultados

-- Índices en tabla PRODUCTS (mejora búsquedas por categoría, oferta, etc)
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand_id ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);
CREATE INDEX IF NOT EXISTS idx_products_in_offer ON products(in_offer);
CREATE INDEX IF NOT EXISTS idx_products_offer_dates ON products(offer_start_date, offer_end_date);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

-- Índices en tabla ORDERS (mejora filtrado por usuario, estado, fecha)
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_payment_id ON orders(payment_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_status ON orders(user_id, status);

-- Índices en tabla USERS
CREATE INDEX IF NOT EXISTS idx_users_email ON "User"(email);
CREATE INDEX IF NOT EXISTS idx_users_active ON "User"(active);

-- Índices en tabla CATEGORIES (búsqueda por nombre)
CREATE INDEX IF NOT EXISTS idx_categories_name_active ON categories(name, active);

-- Índices en tabla IMAGES (relacion producto)
CREATE INDEX IF NOT EXISTS idx_images_product_id ON images(product_id);
CREATE INDEX IF NOT EXISTS idx_images_color_code ON images(color_code);

-- Índices en tabla CART
CREATE INDEX IF NOT EXISTS idx_cart_user_id ON cart(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_session_token ON cart(session_token);

-- Índices en tabla CART_ITEMS
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);

-- Índices en tabla PAYMENTS (soporte para estado y usuario)
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(payment_status);

-- Índices en tabla PRODUCT_VARIANTS
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_sku ON product_variants(sku);
CREATE INDEX IF NOT EXISTS idx_product_variants_color_size ON product_variants(product_id, color_code, size);

-- Índices en tabla REVIEWS
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

-- Índices en tabla NOTIFICATIONS
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(notification_type);

-- Índices compuestos para queries frecuentes
CREATE INDEX IF NOT EXISTS idx_products_category_active ON products(category_id, active);
CREATE INDEX IF NOT EXISTS idx_orders_user_created ON orders(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_product ON cart_items(cart_id, product_id);

COMMENT ON INDEX idx_products_category_id IS '📊 Búsqueda de productos por categoría';
COMMENT ON INDEX idx_products_offer_dates IS '🎁 Búsqueda de ofertas activas';
COMMENT ON INDEX idx_orders_user_status IS '📦 Búsqueda de órdenes por usuario y estado';
