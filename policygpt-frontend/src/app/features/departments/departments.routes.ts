import { Routes } from '@angular/router';
import { Departments } from './departments';
import { roleGuard } from '../../core/guards/role-guard';

export const DEPARTMENT_ROUTES: Routes = [
  {
    path: '',
    component: Departments,
    canActivate: [
      roleGuard(['official']),
    ],
  },
];