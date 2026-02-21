-- CreateEnum
CREATE TYPE "orders_status_enum" AS ENUM ('pending', 'paid', 'processing', 'shipped', 'delivered');

-- CreateEnum
CREATE TYPE "roles_enum" AS ENUM ('user', 'admin');

-- CreateEnum
CREATE TYPE "return_status_enum" AS ENUM ('requested', 'approved', 'rejected', 'processed', 'refunded');

-- CreateEnum
CREATE TYPE "notification_type_enum" AS ENUM ('low_stock', 'out_of_stock', 'new_order', 'order_status_change', 'new_review', 'system_alert', 'promotion');

-- CreateEnum
CREATE TYPE "payment_method_enum" AS ENUM ('PSE', 'CARD', 'NEQUI', 'BANCOLOMBIA', 'BANCOLOMBIA_TRANSFER');

-- CreateEnum
CREATE TYPE "payment_status_enum" AS ENUM ('PENDING', 'APPROVED', 'DECLINED', 'VOIDED', 'ERROR');

-- CreateEnum
CREATE TYPE "orders_paymentmethod_enum" AS ENUM ('paypal', 'nequi', 'efecty');

-- CreateTable
CREATE TABLE "brands" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(500),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "image_url" VARCHAR(255),
    "deleted_at" TIMESTAMP(6),
    "deleted_by" INTEGER,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "session_token" UUID,
    "subtotal" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(6),

    CONSTRAINT "cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart_items" (
    "id" SERIAL NOT NULL,
    "cart_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" INTEGER NOT NULL,
    "color_code" VARCHAR(7) NOT NULL,
    "size" VARCHAR(25) NOT NULL,

    CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(500),
    "id_subcategory" INTEGER,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "deleted_at" TIMESTAMP(6),
    "deleted_by" INTEGER,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category_subcategory" (
    "category_id" INTEGER NOT NULL,
    "subcategory_id" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "category_subcategory_pkey" PRIMARY KEY ("category_id","subcategory_id")
);

-- CreateTable
CREATE TABLE "coupons" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "discount_type" VARCHAR(255) NOT NULL,
    "discount_value" DECIMAL(10,2) NOT NULL,
    "min_purchase_amount" DECIMAL(10,2) DEFAULT 0,
    "usage_limit" INTEGER,
    "usage_count" INTEGER DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(6) NOT NULL,
    "deleted_at" TIMESTAMP(6),
    "deleted_by" INTEGER,

    CONSTRAINT "coupons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(500) NOT NULL,
    "price" INTEGER NOT NULL,
    "stock" INTEGER NOT NULL,
    "weight_grams" INTEGER NOT NULL,
    "sizes" VARCHAR(255) NOT NULL,
    "base_discount" DECIMAL(8,2) NOT NULL DEFAULT 0,
    "category_id" INTEGER NOT NULL,
    "brand_id" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "in_offer" BOOLEAN NOT NULL DEFAULT false,
    "offer_discount" DECIMAL(10,2),
    "offer_start_date" TIMESTAMP(6),
    "offer_end_date" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(6),
    "updated_by" INTEGER NOT NULL,
    "deleted_at" TIMESTAMP(6),
    "deleted_by" INTEGER,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "email" VARCHAR(255) NOT NULL,
    "email_verified" TIMESTAMP(6),
    "password" VARCHAR(255),
    "image" VARCHAR(255),
    "phone_number" VARCHAR(20),
    "identification" VARCHAR(20),
    "identification_type" VARCHAR(10),
    "role" "roles_enum" NOT NULL DEFAULT 'user',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "email_notifications" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" SERIAL NOT NULL,
    "payment_id" INTEGER NOT NULL,
    "status" "orders_status_enum" NOT NULL DEFAULT 'pending',
    "subtotal" INTEGER NOT NULL,
    "discount" INTEGER DEFAULT 0,
    "shipping_cost" INTEGER NOT NULL,
    "taxes" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "shipping_address_id" INTEGER NOT NULL,
    "user_note" VARCHAR(500),
    "admin_notes" TEXT,
    "coupon_id" INTEGER,
    "coupon_discount" INTEGER DEFAULT 0,
    "tracking_number" VARCHAR(100),
    "carrier" VARCHAR(50),
    "estimated_delivery_date" DATE,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "shipped_at" TIMESTAMP(6),
    "delivered_at" TIMESTAMP(6),
    "cancelled_at" TIMESTAMP(6),
    "user_id" INTEGER NOT NULL,
    "updated_by" INTEGER NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subcategories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "deleted_at" TIMESTAMP(6),
    "deleted_by" INTEGER,

    CONSTRAINT "subcategories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_variants" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "color_code" VARCHAR(7) NOT NULL,
    "color" VARCHAR(255) NOT NULL,
    "size" VARCHAR(25) NOT NULL,
    "stock" INTEGER NOT NULL,
    "sku" VARCHAR(100),
    "price" INTEGER,
    "weight_grams" INTEGER,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "deleted_at" TIMESTAMP(6),
    "deleted_by" INTEGER,

    CONSTRAINT "product_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "user_id" INTEGER NOT NULL,
    "type" VARCHAR(255) NOT NULL,
    "provider" VARCHAR(255) NOT NULL,
    "provider_account_id" VARCHAR(255) NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" VARCHAR(255),
    "scope" VARCHAR(255),
    "id_token" TEXT,
    "session_state" VARCHAR(255),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "account_pkey" PRIMARY KEY ("provider","provider_account_id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" SERIAL NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "country" VARCHAR(255) NOT NULL,
    "city" VARCHAR(255) NOT NULL,
    "department" VARCHAR(255) NOT NULL,
    "is_default" BOOLEAN NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorites" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "images" (
    "id" SERIAL NOT NULL,
    "image_url" VARCHAR(255) NOT NULL,
    "color_code" VARCHAR(7) NOT NULL,
    "color" VARCHAR(255) NOT NULL,
    "is_primary" BOOLEAN DEFAULT false,
    "product_id" INTEGER NOT NULL,
    "variant_id" INTEGER,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" SERIAL NOT NULL,
    "price" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "subtotal" INTEGER NOT NULL,
    "color_code" VARCHAR(7) NOT NULL,
    "size" VARCHAR(25) NOT NULL,
    "product_id" INTEGER NOT NULL,
    "order_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_logs" (
    "id" SERIAL NOT NULL,
    "previous_status" "orders_status_enum" NOT NULL,
    "new_status" "orders_status_enum" NOT NULL,
    "note" VARCHAR(500),
    "order_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "updated_by" INTEGER NOT NULL,
    "user_type" VARCHAR(20) DEFAULT 'admin',

    CONSTRAINT "order_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review_images" (
    "id" SERIAL NOT NULL,
    "review_id" INTEGER NOT NULL,
    "image_url" VARCHAR(500) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "review_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "order_id" INTEGER,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" SERIAL NOT NULL,
    "transaction_id" VARCHAR(255),
    "reference" VARCHAR(255) NOT NULL,
    "amount_in_cents" BIGINT NOT NULL,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'COP',
    "payment_status" "payment_status_enum" NOT NULL DEFAULT 'PENDING',
    "status_message" VARCHAR(500),
    "processor_response_code" VARCHAR(20),
    "payment_method" "payment_method_enum" NOT NULL,
    "payment_method_details" JSONB DEFAULT '{}',
    "card_token" VARCHAR(255),
    "acceptance_token" TEXT,
    "acceptance_token_auth" TEXT,
    "signature_used" VARCHAR(255),
    "redirect_url" VARCHAR(500),
    "checkout_url" VARCHAR(500),
    "customer_email" VARCHAR(255) NOT NULL,
    "customer_phone" VARCHAR(20),
    "customer_document_type" VARCHAR(10),
    "customer_document_number" VARCHAR(20),
    "cart_data" JSONB NOT NULL,
    "shipping_address" JSONB NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approved_at" TIMESTAMP(6),
    "failed_at" TIMESTAMP(6),
    "processor_response" JSONB DEFAULT '{}',

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" SERIAL NOT NULL,
    "staff_id" INTEGER NOT NULL,
    "type" "notification_type_enum" NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "message" TEXT NOT NULL,
    "link" VARCHAR(500),
    "related_entity_type" VARCHAR(50),
    "related_entity_id" INTEGER,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "read_at" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verificationToken" (
    "identifier" VARCHAR(255) NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "expires" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "verificationToken_pkey" PRIMARY KEY ("identifier","token")
);

-- CreateTable
CREATE TABLE "store_settings" (
    "id" SERIAL NOT NULL,
    "store_name" VARCHAR(255) NOT NULL DEFAULT 'NeoSale',
    "store_description" TEXT,
    "contact_email" VARCHAR(255) NOT NULL DEFAULT 'info@neosale.com',
    "contact_phone" VARCHAR(50) NOT NULL DEFAULT '+57 300 123 4567',
    "whatsapp_number" VARCHAR(50),
    "address" VARCHAR(500),
    "city" VARCHAR(100) NOT NULL DEFAULT 'Bogota',
    "country" VARCHAR(100) NOT NULL DEFAULT 'Colombia',
    "facebook_url" VARCHAR(255),
    "instagram_url" VARCHAR(255),
    "twitter_url" VARCHAR(255),
    "youtube_url" VARCHAR(255),
    "tiktok_url" VARCHAR(255),
    "logo_url" VARCHAR(255),
    "favicon_url" VARCHAR(255),
    "primary_color" VARCHAR(20) NOT NULL DEFAULT '#3B82F6',
    "secondary_color" VARCHAR(20) NOT NULL DEFAULT '#6366F1',
    "footer_text" TEXT,
    "newsletter_enabled" BOOLEAN NOT NULL DEFAULT true,
    "show_whatsapp_chat" BOOLEAN NOT NULL DEFAULT true,
    "business_hours" JSONB DEFAULT '{"monday":"8:00 AM - 6:00 PM","tuesday":"8:00 AM - 6:00 PM","wednesday":"8:00 AM - 6:00 PM","thursday":"8:00 AM - 6:00 PM","friday":"8:00 AM - 6:00 PM","saturday":"9:00 AM - 2:00 PM","sunday":"Closed"}',
    "shipping_info" JSONB DEFAULT '{"free_shipping_minimum":150000,"standard_shipping_cost":10000}',
    "seo_title" VARCHAR(255),
    "seo_description" VARCHAR(500),
    "seo_keywords" TEXT,
    "google_analytics_id" VARCHAR(50),
    "facebook_pixel_id" VARCHAR(50),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "updated_by" INTEGER,

    CONSTRAINT "store_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "brands_name_key" ON "brands"("name");

-- CreateIndex
CREATE UNIQUE INDEX "cart_session_token_key" ON "cart"("session_token");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_number_key" ON "User"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "User_identification_key" ON "User"("identification");

-- CreateIndex
CREATE UNIQUE INDEX "unq_product_variant" ON "product_variants"("product_id", "color_code", "size");

-- CreateIndex
CREATE UNIQUE INDEX "provider_provider_account_id" ON "account"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "unq_user_product_favorite" ON "favorites"("user_id", "product_id");

-- CreateIndex
CREATE UNIQUE INDEX "payments_transaction_id_key" ON "payments"("transaction_id");

-- CreateIndex
CREATE UNIQUE INDEX "payments_reference_key" ON "payments"("reference");

-- AddForeignKey
ALTER TABLE "brands" ADD CONSTRAINT "fk_brand_deleted_by" FOREIGN KEY ("deleted_by") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cart" ADD CONSTRAINT "cart_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "cart"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "fk_category_deleted_by" FOREIGN KEY ("deleted_by") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_id_subcategory_fkey" FOREIGN KEY ("id_subcategory") REFERENCES "subcategories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "category_subcategory" ADD CONSTRAINT "category_subcategory_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "category_subcategory" ADD CONSTRAINT "category_subcategory_subcategory_id_fkey" FOREIGN KEY ("subcategory_id") REFERENCES "subcategories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "coupons" ADD CONSTRAINT "fk_coupon_deleted_by" FOREIGN KEY ("deleted_by") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "fk_product_deleted_by" FOREIGN KEY ("deleted_by") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_coupon_id_fkey" FOREIGN KEY ("coupon_id") REFERENCES "coupons"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_shipping_address_id_fkey" FOREIGN KEY ("shipping_address_id") REFERENCES "addresses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "subcategories" ADD CONSTRAINT "fk_subcategory_deleted_by" FOREIGN KEY ("deleted_by") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_logs" ADD CONSTRAINT "order_logs_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_logs" ADD CONSTRAINT "order_logs_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "review_images" ADD CONSTRAINT "review_images_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
