-- ============================================================================
-- LOAD ALL STORED PROCEDURES AND FUNCTIONS
-- ============================================================================
-- This file loads all stored procedures, functions, and triggers.
-- It's designed to be idempotent (safe to run multiple times).
-- 
-- All procedures use CREATE OR REPLACE, so they won't cause errors if
-- they already exist - they'll just be updated.

-- Create a tracking table to log when procedures were last loaded
CREATE TABLE IF NOT EXISTS _schema_version (
    id SERIAL PRIMARY KEY,
    script_name VARCHAR(255) UNIQUE NOT NULL,
    loaded_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Insert version record for this script (or update if exists)
INSERT INTO _schema_version (script_name, loaded_at)
VALUES ('load-all-procedures', NOW())
ON CONFLICT (script_name) DO UPDATE SET updated_at = NOW();

-- ============================================================================
-- LOAD ALL TRANSACTION PROCEDURES AND FUNCTIONS
-- ============================================================================

-- Users procedures
\i backend/db/transactions/users/funtions.sql

-- Orders procedures and functions
\i backend/db/transactions/orders/functions.sql

-- Addresses procedures and functions
\i backend/db/transactions/addresses/functions.sql

-- Payments functions
\i backend/db/transactions/payments/functions.sql

-- Cart functions and triggers
\i backend/db/transactions/cart/functions.sql
\i backend/db/transactions/cart/triggers.sql

-- Products triggers
\i backend/db/transactions/products/triggers.sql

-- Reviews functions
\i backend/db/transactions/reviews/functions.sql

-- ============================================================================
-- MIGRATIONS AND FIXES
-- ============================================================================

-- Stock recalculation fix
\i backend/db/migrations/stock_recalculation_fix.sql

-- ============================================================================
-- FINAL VERIFICATION
-- ============================================================================

-- Verify that key procedures exist
DO $$
BEGIN
    -- Check users procedures
    IF NOT EXISTS (
        SELECT 1 FROM pg_proc WHERE proname = 'sp_create_user'
    ) THEN
        RAISE WARNING 'sp_create_user not found';
    END IF;
    
    -- Check orders procedures
    IF NOT EXISTS (
        SELECT 1 FROM pg_proc WHERE proname = 'fn_create_order'
    ) THEN
        RAISE WARNING 'fn_create_order not found';
    END IF;
    
    -- Check addresses procedures
    IF NOT EXISTS (
        SELECT 1 FROM pg_proc WHERE proname = 'fn_create_address'
    ) THEN
        RAISE WARNING 'fn_create_address not found';
    END IF;
    
    RAISE NOTICE 'All procedures and functions loaded successfully';
END $$;
