CREATE TABLE IF NOT EXISTS engagement_events (
    event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL,
    policy_id UUID REFERENCES policies(policy_id) ON DELETE SET NULL,
    scheme_id UUID REFERENCES schemes(scheme_id) ON DELETE SET NULL,
    metadata JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_engagement_events_user_time ON engagement_events(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_engagement_events_type_time ON engagement_events(event_type, created_at DESC);
