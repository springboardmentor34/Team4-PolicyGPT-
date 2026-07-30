-- =========================================================
-- Master script — runs every file in correct dependency order.
-- Usage:  psql -U your_username -d your_database -f run_all.sql
-- (must be run from inside the db/ folder, or use full paths)
-- =========================================================

\i 00_extensions_and_types.sql
\i tables/users.sql
\i tables/schemes.sql
\i tables/eligibility_rules.sql
\i tables/notifications.sql
\i tables/feedback.sql
\i tables/reports.sql
\i tables/audit_logs.sql
\i tables/search_history.sql
\i tables/applications.sql
\i tables/policies.sql
\i tables/policy_versions.sql
\i tables/saved_policies.sql