import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth-guard';
import { roleGuard } from '../../core/guards/role-guard';
import { EligibilityChecker } from './pages/eligibility-checker/eligibility-checker';
import { EligibilitySummary } from './pages/eligibility-summary/eligibility-summary';
import { RecommendedSchemes } from './pages/recommended-schemes/recommended-schemes';
import { ApplicationGuidance } from './pages/application-guidance/application-guidance';

const ELIGIBILITY_USERS = [
  'admin',
  'official',
  'citizen',
  'researcher',
  'organization',
];

export const ELIGIBILITY_ROUTES: Routes = [
  {
    path: 'eligibility', //✅
    component: EligibilityChecker,
     canActivate: [
      authGuard,
      roleGuard(ELIGIBILITY_USERS),
    ],
  },
  {
    path: 'eligibility/summary',
    component: EligibilitySummary,
     canActivate: [
      authGuard,
      roleGuard(ELIGIBILITY_USERS),
    ],
  },
  {
    path: 'eligibility/recommended',
    component: RecommendedSchemes,
     canActivate: [
      authGuard,
      roleGuard(ELIGIBILITY_USERS),
    ],
  },
  {
    path: 'eligibility/guidance',
    component: ApplicationGuidance,
     canActivate: [
      authGuard,
      roleGuard(ELIGIBILITY_USERS),
    ],
  },
];
