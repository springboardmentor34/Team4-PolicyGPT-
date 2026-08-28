import { Routes } from '@angular/router';

import { authGuard } from '../../core/guards/auth-guard';
import { roleGuard } from '../../core/guards/role-guard';
import { AnalyticsDashboard } from './pages/analytics-dashboard/analytics-dashboard';

export const ANALYTICS_ROUTES: Routes = [
  {
    path: '',
    component: AnalyticsDashboard,
    canActivate: [
      authGuard,
      roleGuard([
        'admin',
        'official',
        'researcher',
        'organization',
      ]),
    ],
  },
];
