import { Routes } from '@angular/router';

import { UsageStatistics } from './pages/usage-statistics/usage-statistics';

import { roleGuard } from '../../core/guards/role-guard';

export const USAGE_STATISTICS_ROUTES: Routes = [
  {
    path: '',
    component: UsageStatistics,

    canActivate: [
      roleGuard([
        'admin',
        'official',
        'researcher',
      ])
    ]
  }
];