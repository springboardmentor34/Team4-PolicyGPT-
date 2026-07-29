-- =========================================================
-- Table: reports
-- Depends on: users (generated_by)
-- =========================================================
DROP TABLE IF EXISTS reports CASCADE;

CREATE TABLE reports (
    report_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    generated_by UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    report_type  report_type NOT NULL,
    format       report_format NOT NULL,
    file_path    VARCHAR(500),
    created_at   TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_reports_generated_by ON reports(generated_by);