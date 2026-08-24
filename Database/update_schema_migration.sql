-- =============================================================================
-- Migration Script: Safe PostgreSQL Schema Update
-- Description: Adds 11 new columns, foreign key constraints, and performance indexes
--              across notifications, feedback, reports, schemes, and policies tables.
-- Idempotency: Fully safe to run multiple times without data loss or duplication.
-- =============================================================================

ALTER TYPE report_type ADD VALUE IF NOT EXISTS 'policy_summary';
ALTER TYPE report_type ADD VALUE IF NOT EXISTS 'department_summary';
ALTER TYPE report_type ADD VALUE IF NOT EXISTS 'user_summary';

BEGIN;

CREATE TABLE IF NOT EXISTS departments (
    department_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL UNIQUE,
    ministry VARCHAR(150),
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS organizations (
    organization_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

ALTER TABLE users ADD COLUMN IF NOT EXISTS department_id UUID;
ALTER TABLE users ADD COLUMN IF NOT EXISTS organization_id UUID;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_department_id_fkey') THEN
        ALTER TABLE users ADD CONSTRAINT users_department_id_fkey
            FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE SET NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_organization_id_fkey') THEN
        ALTER TABLE users ADD CONSTRAINT users_organization_id_fkey
            FOREIGN KEY (organization_id) REFERENCES organizations(organization_id) ON DELETE SET NULL;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_users_department_id ON users(department_id);
CREATE INDEX IF NOT EXISTS idx_users_organization_id ON users(organization_id);

CREATE TABLE IF NOT EXISTS applications (
    application_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    scheme_id UUID NOT NULL REFERENCES schemes(scheme_id) ON DELETE CASCADE,
    status application_status NOT NULL DEFAULT 'submitted',
    remarks TEXT,
    submitted_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_applications_user ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_scheme ON applications(scheme_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_submitted_at ON applications(submitted_at DESC);

CREATE TABLE IF NOT EXISTS policy_views (
    view_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    policy_id UUID NOT NULL REFERENCES policies(policy_id) ON DELETE CASCADE,
    viewed_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS engagement_events (
    event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL,
    policy_id UUID REFERENCES policies(policy_id) ON DELETE SET NULL,
    scheme_id UUID REFERENCES schemes(scheme_id) ON DELETE SET NULL,
    metadata JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_policy_views_user_time ON policy_views(user_id, viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_policy_views_policy_time ON policy_views(policy_id, viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_engagement_events_user_time ON engagement_events(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_engagement_events_type_time ON engagement_events(event_type, created_at DESC);

CREATE TABLE IF NOT EXISTS reports (
    report_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    generated_by UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    policy_id UUID REFERENCES policies(policy_id) ON DELETE SET NULL,
    scheme_id UUID REFERENCES schemes(scheme_id) ON DELETE SET NULL,
    report_type report_type NOT NULL,
    format report_format NOT NULL,
    department VARCHAR(150),
    filters JSONB,
    file_path VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS search_history (
    search_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    query_text VARCHAR(500),
    filters_json JSONB,
    searched_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS saved_policies (
    saved_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    policy_id UUID NOT NULL REFERENCES policies(policy_id) ON DELETE CASCADE,
    saved_at TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT uq_saved_policies_user_policy UNIQUE (user_id, policy_id)
);

CREATE TABLE IF NOT EXISTS audit_logs (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID,
    ip_address VARCHAR(45),
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reports_generated_by ON reports(generated_by);
CREATE INDEX IF NOT EXISTS idx_reports_department ON reports(department);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_type_created ON reports(report_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_search_history_user_time ON search_history(user_id, searched_at DESC);
CREATE INDEX IF NOT EXISTS idx_saved_policies_user_time ON saved_policies(user_id, saved_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_time ON audit_logs(user_id, created_at DESC);

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
