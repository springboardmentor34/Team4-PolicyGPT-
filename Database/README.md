# Database Setup (PostgreSQL)

## Overview

This folder contains the PostgreSQL database scripts for the PolicyGPT project.

The database scripts include:

* PostgreSQL extensions and custom enum types
* Table creation scripts
* Index creation
* Database initialization script

## Database Structure

```
Database/
│
├── 00_extensions_and_types.sql
├── run_all.sql
│
└── tables/
    ├── users.sql
    ├── schemes.sql
    ├── eligibility_rules.sql
    ├── notifications.sql
    ├── feedback.sql
    ├── reports.sql
    ├── audit_logs.sql
    ├── search_history.sql
    ├── applications.sql
    ├── policies.sql
    ├── policy_versions.sql
    └── saved_policies.sql
```

## Prerequisites

Install:

* PostgreSQL
* pgAdmin 4 (optional)
* PostgreSQL command line tools (`psql`)

## Create Database

Create a PostgreSQL database:

```sql
CREATE DATABASE government_scheme_portal;
```

Connect to the database:

```sql
\c government_scheme_portal
```

## Run Database Scripts

Navigate to the Database folder:

```bash
cd Database
```

Run the master script:

```bash
psql -U postgres -d government_scheme_portal -f run_all.sql
```

This will automatically:

1. Create required PostgreSQL extensions
2. Create enum types
3. Create all tables
4. Create indexes

## Database Tables

The database contains the following tables:

* Users
* Schemes
* Eligibility Rules
* Notifications
* Feedback
* Reports
* Audit Logs
* Search History
* Applications
* Policies
* Policy Versions
* Saved Policies


