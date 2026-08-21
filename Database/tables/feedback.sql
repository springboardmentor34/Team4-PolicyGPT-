-- =========================================================
-- Table: feedback
-- Depends on: users (user_id, resolved_by), policies (policy_id), schemes (scheme_id)
-- =========================================================
DROP TABLE IF EXISTS feedback CASCADE;

CREATE TABLE feedback (
    feedback_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    policy_id     UUID CONSTRAINT fk_feedback_policy REFERENCES policies(policy_id) ON DELETE SET NULL,
    scheme_id     UUID CONSTRAINT fk_feedback_scheme REFERENCES schemes(scheme_id) ON DELETE SET NULL,
    subject       VARCHAR(255),
    category      feedback_category NOT NULL,
    status        feedback_status NOT NULL DEFAULT 'open',
    feedback_text TEXT,
    response_text TEXT,
    resolved_by   UUID REFERENCES users(user_id) ON DELETE SET NULL,
    resolved_at   TIMESTAMP,
    created_at    TIMESTAMP NOT NULL DEFAULT now(),
    updated_at    TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_feedback_user        ON feedback(user_id);
CREATE INDEX idx_feedback_policy_id   ON feedback(policy_id);
CREATE INDEX idx_feedback_scheme_id   ON feedback(scheme_id);
CREATE INDEX idx_feedback_resolved_by ON feedback(resolved_by);
CREATE INDEX idx_feedback_created_at  ON feedback(created_at DESC);