-- =========================================================
-- Table: policy_versions
-- Depends on: policies (policy_id), users (edited_by)
-- =========================================================
DROP TABLE IF EXISTS policy_versions CASCADE;

CREATE TABLE policy_versions (
    version_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_id      UUID NOT NULL REFERENCES policies(policy_id) ON DELETE CASCADE,
    version_number INT NOT NULL,
    file_url       VARCHAR(500),
    change_summary VARCHAR(500),
    edited_by      UUID REFERENCES users(user_id) ON DELETE SET NULL,
    created_at     TIMESTAMP NOT NULL DEFAULT now(),
    UNIQUE (policy_id, version_number)
);

CREATE INDEX idx_policy_versions_policy ON policy_versions(policy_id);