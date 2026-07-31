-- =========================================================
-- 00. Extensions & Enum Types
-- Run this FIRST, before any table file.
-- =========================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;   -- gives us gen_random_uuid()

-- Drop existing types if re-running (safe on fresh DB too)
DROP TYPE IF EXISTS user_role;
DROP TYPE IF EXISTS scheme_status;
DROP TYPE IF EXISTS notification_type;
DROP TYPE IF EXISTS notification_channel;
DROP TYPE IF EXISTS feedback_category;
DROP TYPE IF EXISTS feedback_status;
DROP TYPE IF EXISTS report_type;
DROP TYPE IF EXISTS report_format;
DROP TYPE IF EXISTS application_status;
DROP TYPE IF EXISTS policy_status;

-- Adjust these values to match what your app actually uses.
CREATE TYPE user_role AS ENUM (
    'administrator',
    'government_official',
    'citizen',
    'researcher',
    'organization',
    'guest_user'
);
CREATE TYPE scheme_status        AS ENUM ('draft', 'active', 'inactive', 'expired');
CREATE TYPE notification_type    AS ENUM ('info', 'alert', 'reminder', 'approval');
CREATE TYPE notification_channel AS ENUM ('in_app', 'email', 'sms');
CREATE TYPE feedback_category    AS ENUM ('bug', 'suggestion', 'complaint', 'query');
CREATE TYPE feedback_status      AS ENUM ('open', 'in_progress', 'resolved', 'closed');
CREATE TYPE report_type          AS ENUM ('usage', 'scheme_summary', 'audit', 'custom');
CREATE TYPE report_format        AS ENUM ('pdf', 'csv', 'xlsx');
CREATE TYPE application_status   AS ENUM ('submitted', 'under_review', 'approved', 'rejected');
CREATE TYPE policy_status        AS ENUM ('pending', 'approved', 'published', 'archived');