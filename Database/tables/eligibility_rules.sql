-- =========================================================
-- Table: eligibility_rules
-- Depends on: schemes (scheme_id)
-- =========================================================
DROP TABLE IF EXISTS eligibility_rules CASCADE;

CREATE TABLE eligibility_rules (
    rule_id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scheme_id          UUID NOT NULL REFERENCES schemes(scheme_id) ON DELETE CASCADE,
    min_age            INT,
    max_age            INT,
    gender             VARCHAR(20),
    max_income         DECIMAL(14,2),
    occupation         VARCHAR(100),
    education_level    VARCHAR(100),
    location           VARCHAR(150),
    social_category    VARCHAR(100),
    disability_status  BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_eligibility_rules_scheme ON eligibility_rules(scheme_id);