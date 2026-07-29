import { Routes } from '@angular/router';
import { Admin } from './admin/admin';
import { Citizen } from './citizen/citizen';
import { Official } from './official/official';
import { Researcher } from './researcher/researcher';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: 'admin',
    component: Admin,
  },
  {
    path: 'citizen',
    component: Citizen,
  },
  {
    path: 'official',
    component: Official,
  },
  {
    path: 'researcher',
    component: Researcher,
  },
];