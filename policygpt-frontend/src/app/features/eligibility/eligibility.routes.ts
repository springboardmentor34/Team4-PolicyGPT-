import { Routes } from '@angular/router';

import { EligibilityChecker } from './pages/eligibility-checker/eligibility-checker';
import { EligibilitySummary } from './pages/eligibility-summary/eligibility-summary';
import { RecommendedSchemes } from './pages/recommended-schemes/recommended-schemes';
import { ApplicationGuidance } from './pages/application-guidance/application-guidance';

export const ELIGIBILITY_ROUTES: Routes = [
  {
    path: 'eligibility',
    component: EligibilityChecker,
  },
  {
    path: 'eligibility/summary',
    component: EligibilitySummary,
  },
  {
    path: 'eligibility/recommended',
    component: RecommendedSchemes,
  },
  {
    path: 'eligibility/guidance',
    component: ApplicationGuidance,
  },
];