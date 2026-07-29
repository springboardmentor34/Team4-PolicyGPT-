-- =========================================================
-- Table: schemes
-- Depends on: users (created_by)
-- =========================================================
DROP TABLE IF EXISTS schemes CASCADE;

CREATE TABLE schemes (
    scheme_id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name                   VARCHAR(255) NOT NULL,
    category               VARCHAR(100),
    department             VARCHAR(150),
    state                  VARCHAR(100),
    benefits               TEXT,
    application_start_date DATE,
    application_end_date   DATE,
    status                 scheme_status NOT NULL DEFAULT 'draft',
    created_by             UUID REFERENCES users(user_id) ON DELETE SET NULL,
    created_at             TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_schemes_created_by ON schemes(created_by);