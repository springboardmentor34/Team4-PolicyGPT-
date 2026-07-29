-- =========================================================
-- Table: search_history
-- Depends on: users (user_id)
-- =========================================================
DROP TABLE IF EXISTS search_history CASCADE;

CREATE TABLE search_history (
    search_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    query_text   VARCHAR(500),
    filters_json JSONB,
    searched_at  TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_search_history_user ON search_history(user_id);