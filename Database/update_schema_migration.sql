-- =============================================================================
-- Migration Script: Safe PostgreSQL Schema Update
-- Description: Adds 11 new columns, foreign key constraints, and performance indexes
--              across notifications, feedback, reports, schemes, and policies tables.
-- Idempotency: Fully safe to run multiple times without data loss or duplication.
-- =============================================================================

BEGIN;

-- =============================================================================
-- 1. NOTIFICATIONS TABLE UPDATES (3 new fields)
-- =============================================================================

ALTER TABLE notifications ADD COLUMN IF NOT EXISTS message TEXT;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS department VARCHAR(150);
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS read_at TIMESTAMP;


-- =============================================================================
-- 2. FEEDBACK TABLE UPDATES (4 new fields)
-- =============================================================================

ALTER TABLE feedback ADD COLUMN IF NOT EXISTS policy_id UUID;
ALTER TABLE feedback ADD COLUMN IF NOT EXISTS scheme_id UUID;
ALTER TABLE feedback ADD COLUMN IF NOT EXISTS feedback_text TEXT;
ALTER TABLE feedback ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT now();


-- =============================================================================
-- 3. REPORTS TABLE UPDATES (4 new fields)
-- =============================================================================

ALTER TABLE reports ADD COLUMN IF NOT EXISTS policy_id UUID;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS scheme_id UUID;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS department VARCHAR(150);
ALTER TABLE reports ADD COLUMN IF NOT EXISTS filters JSONB;


-- =============================================================================
-- 4. FOREIGN KEY CONSTRAINTS (Safely checked before adding)
-- =============================================================================

-- feedback.policy_id -> policies.policy_id
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_feedback_policy'
    ) THEN
        ALTER TABLE feedback
        ADD CONSTRAINT fk_feedback_policy
        FOREIGN KEY (policy_id) REFERENCES policies(policy_id) ON DELETE SET NULL;
    END IF;
END $$;

-- feedback.scheme_id -> schemes.scheme_id
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_feedback_scheme'
    ) THEN
        ALTER TABLE feedback
        ADD CONSTRAINT fk_feedback_scheme
        FOREIGN KEY (scheme_id) REFERENCES schemes(scheme_id) ON DELETE SET NULL;
    END IF;
END $$;

-- reports.policy_id -> policies.policy_id
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_reports_policy'
    ) THEN
        ALTER TABLE reports
        ADD CONSTRAINT fk_reports_policy
        FOREIGN KEY (policy_id) REFERENCES policies(policy_id) ON DELETE SET NULL;
    END IF;
END $$;

-- reports.scheme_id -> schemes.scheme_id
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_reports_scheme'
    ) THEN
        ALTER TABLE reports
        ADD CONSTRAINT fk_reports_scheme
        FOREIGN KEY (scheme_id) REFERENCES schemes(scheme_id) ON DELETE SET NULL;
    END IF;
END $$;


-- =============================================================================
-- 5. INDEXES (Add new non-duplicate indexes for filtering & retrieval)
-- =============================================================================

-- Notification Retrieval & Filtering
CREATE INDEX IF NOT EXISTS idx_notifications_user_read_created ON notifications(user_id, is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_department ON notifications(department);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- Feedback Lookups & Date Filtering
CREATE INDEX IF NOT EXISTS idx_feedback_policy_id ON feedback(policy_id);
CREATE INDEX IF NOT EXISTS idx_feedback_scheme_id ON feedback(scheme_id);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at DESC);

-- Report Lookups, Filtering & Generation Queries
CREATE INDEX IF NOT EXISTS idx_reports_policy_id ON reports(policy_id);
CREATE INDEX IF NOT EXISTS idx_reports_scheme_id ON reports(scheme_id);
CREATE INDEX IF NOT EXISTS idx_reports_department ON reports(department);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_type_created ON reports(report_type, created_at DESC);

-- Department & Date Filtering on Schemes & Policies
CREATE INDEX IF NOT EXISTS idx_schemes_department ON schemes(department);
CREATE INDEX IF NOT EXISTS idx_schemes_created_at ON schemes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_policies_department ON policies(department);
CREATE INDEX IF NOT EXISTS idx_policies_created_at ON policies(created_at DESC);

COMMIT;
