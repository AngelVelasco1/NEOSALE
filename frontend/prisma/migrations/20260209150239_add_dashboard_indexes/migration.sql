-- CreateIndex
CREATE INDEX "idx_user_created_at" ON "User"("created_at");

-- CreateIndex
CREATE INDEX "idx_user_role_active" ON "User"("role", "active");

-- CreateIndex
CREATE INDEX "idx_user_created_at_role" ON "User"("created_at", "role");

-- CreateIndex
CREATE INDEX "idx_cart_created_at" ON "cart"("created_at");

-- CreateIndex
CREATE INDEX "idx_order_items_order_id" ON "order_items"("order_id");

-- CreateIndex
CREATE INDEX "idx_order_items_product_id" ON "order_items"("product_id");

-- CreateIndex
CREATE INDEX "idx_orders_created_at" ON "orders"("created_at");

-- CreateIndex
CREATE INDEX "idx_orders_status" ON "orders"("status");

-- CreateIndex
CREATE INDEX "idx_orders_created_at_status" ON "orders"("created_at", "status");

-- CreateIndex
CREATE INDEX "idx_products_category_id" ON "products"("category_id");
