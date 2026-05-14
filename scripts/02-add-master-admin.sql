-- Optional: pgcrypto if you prefer server-side bcrypt in SQL later (app uses bcryptjs in Node).
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Role label for admin_users (app logic uses is_master_admin; role is optional metadata)
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'admin';

-- Do not insert default users here (avoids secrets in the repo).
-- Create the first master admin after deploy: POST /api/admin/setup or the /admin setup UI.
