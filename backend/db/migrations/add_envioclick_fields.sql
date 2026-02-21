-- Migración: Agregar campos de EnvioClick a la tabla orders
-- Ejecutar este script en la base de datos existente

-- Agregar nuevos campos para integración con EnvioClick
ALTER TABLE orders ADD COLUMN IF NOT EXISTS envioclick_guide_number VARCHAR(100);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS envioclick_shipment_id VARCHAR(100);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS envioclick_status VARCHAR(50);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS envioclick_tracking_url VARCHAR(500);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS envioclick_label_url VARCHAR(500);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS last_tracking_update TIMESTAMP(6);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_history JSONB DEFAULT '[]';

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_orders_envioclick_guide ON orders(envioclick_guide_number) WHERE envioclick_guide_number IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_orders_envioclick_status ON orders(envioclick_status) WHERE envioclick_status IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_orders_tracking_update ON orders(last_tracking_update DESC) WHERE last_tracking_update IS NOT NULL;

-- Comentarios para documentación
COMMENT ON COLUMN orders.envioclick_guide_number IS 'Número de guía de EnvioClick';
COMMENT ON COLUMN orders.envioclick_shipment_id IS 'ID del envío en EnvioClick';
COMMENT ON COLUMN orders.envioclick_status IS 'Estado actual según EnvioClick (CREATED, PICKED_UP, IN_TRANSIT, DELIVERED, etc.)';
COMMENT ON COLUMN orders.envioclick_tracking_url IS 'URL pública de rastreo del envío';
COMMENT ON COLUMN orders.envioclick_label_url IS 'URL de descarga de la etiqueta de envío';
COMMENT ON COLUMN orders.last_tracking_update IS 'Última actualización recibida del tracking';
COMMENT ON COLUMN orders.tracking_history IS 'Historial completo de eventos de tracking en formato JSON';

-- Verificar que se agregaron correctamente
SELECT column_name, data_type, character_maximum_length
FROM information_schema.columns
WHERE table_name = 'orders'
  AND column_name LIKE 'envioclick%' OR column_name IN ('last_tracking_update', 'tracking_history')
ORDER BY ordinal_position;
