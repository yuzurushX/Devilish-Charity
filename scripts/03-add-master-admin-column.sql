ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS is_master_admin BOOLEAN DEFAULT FALSE;

-- First master admin is created by the app (POST /api/admin/setup) with is_master_admin = true.
