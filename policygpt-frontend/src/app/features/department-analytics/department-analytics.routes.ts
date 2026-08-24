import { Routes } from '@angular/router';

import { DepartmentAnalytics } from './pages/department-analytics/department-analytics';

import { roleGuard } from '../../core/guards/role-guard';

export const DEPARTMENT_ANALYTICS_ROUTES: Routes = [
  {
    path: '',
    component: DepartmentAnalytics,
    canActivate: [roleGuard(['admin', 'official', 'researcher'])],
  },
];