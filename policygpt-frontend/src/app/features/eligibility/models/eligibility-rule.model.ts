export interface EligibilityRule {
  rule_id: string;
  scheme_id: string;
  min_age?: number | null;
  max_age?: number | null;
  gender?: string | null;
  max_income?: number | null;
  occupation?: string | null;
  education_level?: string | null;
  location?: string | null;
  social_category?: string | null;
  disability_status?: boolean | null;
}

export interface EligibilityRuleCreate {
  min_age?: number | null;
  max_age?: number | null;
  gender?: string | null;
  max_income?: number | null;
  occupation?: string | null;
  education_level?: string | null;
  location?: string | null;
  social_category?: string | null;
  disability_status?: boolean | null;
}

export interface EligibilityRuleUpdate {
  min_age?: number | null;
  max_age?: number | null;
  gender?: string | null;
  max_income?: number | null;
  occupation?: string | null;
  education_level?: string | null;
  location?: string | null;
  social_category?: string | null;
  disability_status?: boolean | null;
}
