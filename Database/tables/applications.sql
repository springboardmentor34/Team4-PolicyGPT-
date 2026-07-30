-- =========================================================
-- Table: applications
-- Depends on: users (user_id), schemes (scheme_id)
-- =========================================================
DROP TABLE IF EXISTS applications CASCADE;

CREATE TABLE applications (
    application_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id        UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    scheme_id      UUID NOT NULL REFERENCES schemes(scheme_id) ON DELETE CASCADE,
    status         application_status NOT NULL DEFAULT 'submitted',
    remarks        TEXT,
    submitted_at   TIMESTAMP NOT NULL DEFAULT now(),
    updated_at     TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_applications_user   ON applications(user_id);
CREATE INDEX idx_applications_scheme ON applications(scheme_id);