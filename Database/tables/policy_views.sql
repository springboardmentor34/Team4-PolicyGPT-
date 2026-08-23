CREATE TABLE IF NOT EXISTS policy_views (
    view_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    policy_id UUID NOT NULL REFERENCES policies(policy_id) ON DELETE CASCADE,
    viewed_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_policy_views_user_time ON policy_views(user_id, viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_policy_views_policy_time ON policy_views(policy_id, viewed_at DESC);
