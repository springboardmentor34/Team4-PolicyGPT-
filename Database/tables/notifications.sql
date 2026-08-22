-- =========================================================
-- Table: notifications
-- Depends on: users (user_id)
-- =========================================================
DROP TABLE IF EXISTS notifications CASCADE;

CREATE TABLE notifications (
    notification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    title           VARCHAR(255) NOT NULL,
    message         TEXT,
    type            notification_type NOT NULL,
    channel         notification_channel NOT NULL,
    department      VARCHAR(150),
    is_read         BOOLEAN NOT NULL DEFAULT FALSE,
    read_at         TIMESTAMP,
    created_at      TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user              ON notifications(user_id);
CREATE INDEX idx_notifications_user_read_created ON notifications(user_id, is_read, created_at DESC);
CREATE INDEX idx_notifications_department        ON notifications(department);
CREATE INDEX idx_notifications_created_at        ON notifications(created_at DESC);