-- =========================================================
-- Table: audit_logs
-- Depends on: users (user_id)
-- Note: entity_id is polymorphic (can point to schemes, policies,
-- applications, etc. depending on entity_type) so it has no FK.
-- =========================================================
DROP TABLE IF EXISTS audit_logs CASCADE;

CREATE TABLE audit_logs (
    log_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    action      VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id   UUID,
    ip_address  VARCHAR(45),
    created_at  TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);