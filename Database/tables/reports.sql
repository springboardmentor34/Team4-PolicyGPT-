-- =========================================================
-- Table: reports
-- Depends on: users (generated_by), policies (policy_id), schemes (scheme_id)
-- =========================================================
DROP TABLE IF EXISTS reports CASCADE;

CREATE TABLE reports (
    report_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    generated_by UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    policy_id    UUID CONSTRAINT fk_reports_policy REFERENCES policies(policy_id) ON DELETE SET NULL,
    scheme_id    UUID CONSTRAINT fk_reports_scheme REFERENCES schemes(scheme_id) ON DELETE SET NULL,
    report_type  report_type NOT NULL,
    format       report_format NOT NULL,
    department   VARCHAR(150),
    filters      JSONB,
    file_path    VARCHAR(500),
    created_at   TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_reports_generated_by ON reports(generated_by);
CREATE INDEX idx_reports_policy_id    ON reports(policy_id);
CREATE INDEX idx_reports_scheme_id    ON reports(scheme_id);
CREATE INDEX idx_reports_department   ON reports(department);
CREATE INDEX idx_reports_created_at   ON reports(created_at DESC);
CREATE INDEX idx_reports_type_created ON reports(report_type, created_at DESC);