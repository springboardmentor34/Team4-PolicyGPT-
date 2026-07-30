-- =========================================================
-- Table: notifications
-- Depends on: users (user_id)
-- =========================================================
DROP TABLE IF EXISTS notifications CASCADE;

CREATE TABLE notifications (
    notification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    title           VARCHAR(255) NOT NULL,
    type            notification_type NOT NULL,
    channel         notification_channel NOT NULL,
    is_read         BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);