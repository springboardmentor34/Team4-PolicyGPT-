-- =========================================================
-- Table: policies
-- Depends on: users (uploaded_by, approved_by)
-- =========================================================
DROP TABLE IF EXISTS policies CASCADE;

CREATE TABLE policies (
    policy_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title          VARCHAR(255) NOT NULL,
    category       VARCHAR(100),
    department     VARCHAR(150),
    ministry       VARCHAR(150),
    state          VARCHAR(100),
    file_url       VARCHAR(500),
    status         policy_status NOT NULL DEFAULT 'pending',
    uploaded_by    UUID NOT NULL REFERENCES users(user_id) ON DELETE SET NULL,
    approved_by    UUID REFERENCES users(user_id) ON DELETE SET NULL,
    published_date DATE,
    created_at     TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_policies_uploaded_by ON policies(uploaded_by);
CREATE INDEX idx_policies_approved_by ON policies(approved_by);