-- =========================================================
-- Table: saved_policies
-- Depends on: users (user_id), policies (policy_id)
-- =========================================================
DROP TABLE IF EXISTS saved_policies CASCADE;

CREATE TABLE saved_policies (
    saved_id  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id   UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    policy_id UUID NOT NULL REFERENCES policies(policy_id) ON DELETE CASCADE,
    saved_at  TIMESTAMP NOT NULL DEFAULT now(),
    UNIQUE (user_id, policy_id)
);

CREATE INDEX idx_saved_policies_user   ON saved_policies(user_id);
CREATE INDEX idx_saved_policies_policy ON saved_policies(policy_id);