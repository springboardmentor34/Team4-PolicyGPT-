import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth-guard';

import { EligibilityChecker } from './pages/eligibility-checker/eligibility-checker';
import { EligibilitySummary } from './pages/eligibility-summary/eligibility-summary';
import { RecommendedSchemes } from './pages/recommended-schemes/recommended-schemes';
import { ApplicationGuidance } from './pages/application-guidance/application-guidance';

export const ELIGIBILITY_ROUTES: Routes = [
  {
    path: 'eligibility', //✅
    component: EligibilityChecker,
    // canActivate: [authGuard]
  },
  {
    path: 'eligibility/summary',
    component: EligibilitySummary,
    // canActivate: [authGuard]
  },
  {
    path: 'eligibility/recommended',
    component: RecommendedSchemes,
    // canActivate: [authGuard]
  },
  {
    path: 'eligibility/guidance',
    component: ApplicationGuidance,
    // canActivate: [authGuard]
  },
];
