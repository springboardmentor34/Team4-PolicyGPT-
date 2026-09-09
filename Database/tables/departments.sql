CREATE TABLE IF NOT EXISTS departments (
    department_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL UNIQUE,
    ministry VARCHAR(150),
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_departments_name ON departments(name);

INSERT INTO departments (name, ministry)
VALUES
    ('Education', 'Ministry of Education'),
    ('Healthcare', 'Ministry of Health and Family Welfare'),
    ('Agriculture', 'Ministry of Agriculture and Farmers Welfare'),
    ('Finance', 'Ministry of Finance')
ON CONFLICT (name) DO NOTHING;
