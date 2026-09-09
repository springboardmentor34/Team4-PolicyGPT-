# PolicyGPT Project Summary

PolicyGPT is an Angular 21 frontend backed by FastAPI, SQLAlchemy, and PostgreSQL. The current implementation provides role-aware authentication, policy and scheme workflows, eligibility matching, dashboards, analytics, notifications, reports, feedback, usage tracking, and department-aware government-official operations.

## 1. Authentication & API Integration

### Frontend & Backend API Route Connections

* **Login Flow (`/login`):** The Angular login form calls `POST /auth/login`, stores the returned JWT as `access_token`, and routes by the token role claim.
* **Registration Flow (`/register`):** The Angular registration form calls `POST /auth/register`. Government officials select a database-backed department from `GET /auth/departments`, and the selected UUID is persisted as `users.department_id`.
* **Authorization:** The frontend `auth.interceptor.ts` adds the bearer token to protected HTTP requests. `api.config.ts` supplies the centralized local backend base URL.

---

## 2. Database Schema & Migration Updates

### Updated Database Enum Types

* Modified the custom PostgreSQL enum `user_role` in `Database/00_extensions_and_types.sql` to align with the new role taxonomy.
* **Updated SQL Definition:**
```sql
CREATE TYPE user_role AS ENUM (
    'administrator',
    'government_official',
    'citizen',
    'researcher',
    'organization',
    'guest_user'
);

```



### Data Migration for Existing Users

* Updated legacy role records in the `users` table to maintain compatibility with updated role schemas:
```sql
UPDATE users SET role = 'administrator' WHERE role = 'admin';
UPDATE users SET role = 'government_official' WHERE role = 'officer';

```



---

## 3. Recent Runtime Fixes

* Analytics dashboard responses now refresh first-load state correctly.
* Government official dashboard statistics are resolved from the authenticated official's assigned department; admin data remains global.
* Researcher dashboard loading and first-load state handling were corrected.
* The policies page now renders the initial API response without requiring Search or Refresh.
* Department access now permits administrators to view all seeded departments while officials remain department-scoped.

## 4. Current Implementation Notes

### Unstyled Routes & Missing CSS Root Cause

Identified why `/official`, `/policies`, `/policies/1`, and `/eligibility` lacked styling:

* The application uses Angular Material, Tailwind/PostCSS, and feature-local CSS; Bootstrap is not a runtime dependency.
* **Placeholder Components:** `/policies/1` contained placeholder strings; `/eligibility` had an empty CSS file.
* **Fix Strategy:** Plan to standardize all unstyled pages using Tailwind CSS + Angular Material (matching the setup on `/login` and `/register`).

### Milestone 1 Wireframe Audit

* Current feature routes include `/login`, `/register`, `/citizen`, `/official`, `/admin`, `/researcher`, `/organization`, `/policies`, `/schemes`, `/eligibility`, `/notifications`, `/reports`, `/analytics`, `/department-analytics`, `/departments`, `/feedback`, and `/usage-statistics`.
* Password recovery UI exists, but matching backend forgot/reset endpoints are not implemented.



---