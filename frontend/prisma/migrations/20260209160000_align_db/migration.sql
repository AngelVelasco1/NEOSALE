-- Align orders columns that may already exist
ALTER TABLE "orders"
  ADD COLUMN IF NOT EXISTS "envioclick_guide_number" VARCHAR(100),
  ADD COLUMN IF NOT EXISTS "envioclick_label_url" VARCHAR(500),
  ADD COLUMN IF NOT EXISTS "envioclick_shipment_id" VARCHAR(100),
  ADD COLUMN IF NOT EXISTS "envioclick_status" VARCHAR(50),
  ADD COLUMN IF NOT EXISTS "envioclick_tracking_url" VARCHAR(500),
  ADD COLUMN IF NOT EXISTS "last_tracking_update" TIMESTAMP(6),
  ADD COLUMN IF NOT EXISTS "tracking_history" JSONB DEFAULT '[]';

-- Align store settings default
ALTER TABLE "store_settings"
  ALTER COLUMN "city" SET DEFAULT 'Bogotá';
