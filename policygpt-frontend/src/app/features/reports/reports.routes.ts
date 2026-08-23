import { Routes } from '@angular/router';

import { ReportsDashboard } from './pages/reports-dashboard/reports-dashboard';
import { roleGuard } from '../../core/guards/role-guard';

export const REPORTS_ROUTES: Routes = [
  {
    path: 'reports',
    component: ReportsDashboard,
    canActivate: [roleGuard],
    data: {
      roles: [
        'admin',
        'official',
        'citizen',
        'researcher',
        'organization',
      ],
    },
  },
];