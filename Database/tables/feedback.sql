-- =========================================================
-- Table: feedback
-- Depends on: users (user_id, resolved_by)
-- =========================================================
DROP TABLE IF EXISTS feedback CASCADE;

CREATE TABLE feedback (
    feedback_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    subject       VARCHAR(255),
    category      feedback_category NOT NULL,
    status        feedback_status NOT NULL DEFAULT 'open',
    response_text TEXT,
    resolved_by   UUID REFERENCES users(user_id) ON DELETE SET NULL,
    resolved_at   TIMESTAMP,
    created_at    TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_feedback_user        ON feedback(user_id);
CREATE INDEX idx_feedback_resolved_by ON feedback(resolved_by);