import { Routes } from '@angular/router';

import { ReportsDashboard } from './pages/reports-dashboard/reports-dashboard';
import { roleGuard } from '../../core/guards/role-guard';

export const REPORTS_ROUTES: Routes = [
  {
    path: 'reports',
    component: ReportsDashboard,
    canActivate: [
      roleGuard([
        'admin',
        'official',
        'researcher',
        'organization',
      ]),
    ],
    data: {
      roles: [
        'admin',
        'official',
        'researcher',
        'organization',
      ],
    },
  },
];