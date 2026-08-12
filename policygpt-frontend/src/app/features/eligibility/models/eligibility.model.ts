import { Scheme } from './scheme.model';
import { UserProfile } from './user-profile.model';

export type EligibilityStatus =
  | 'Eligible'
  | 'Potentially Eligible'
  | 'Not Eligible';

export interface SchemeEligibilityResult {
  scheme: Scheme;
  status: EligibilityStatus;
  score: number;
  reasons: string[];
  recommendationReason: string;
}

export interface EligibilityResult {
  profile: UserProfile;
  overallStatus: EligibilityStatus;
  eligibilityScore: number;
  confidence: 'High' | 'Medium' | 'Low';
  matchedSchemes: number;
  totalSchemes: number;
  results: SchemeEligibilityResult[];
}