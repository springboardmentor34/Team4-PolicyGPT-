-- =========================================================
-- Table: users
-- No foreign key dependencies — create this first.
-- =========================================================
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    user_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name      VARCHAR(255) NOT NULL,
    email          VARCHAR(255) NOT NULL UNIQUE,
    password_hash  VARCHAR(255) NOT NULL,
    role           user_role NOT NULL DEFAULT 'citizen',
    phone          VARCHAR(20),
    state          VARCHAR(100),
    created_at     TIMESTAMP NOT NULL DEFAULT now()
);