import { Routes } from '@angular/router';

import { Admin } from './admin/admin';
import { Citizen } from './citizen/citizen';
import { Official } from './official/official';
import { Researcher } from './researcher/researcher';

import { roleGuard } from '../../core/guards/role-guard';

export const DASHBOARD_ROUTES: Routes = [

  // =========================
  // ADMIN
  // =========================
  {
    path: 'admin',
    component: Admin,
    // canActivate: [
    //   roleGuard(['admin'])
    // ],
  },

  // =========================
  // CITIZEN
  // =========================
  {
    path: 'citizen',
    component: Citizen,
    // canActivate: [
    //   roleGuard(['citizen'])
    // ],
  },

  // =========================
  // GOVERNMENT OFFICIAL
  // =========================
  {
    path: 'official',
    component: Official,
    // canActivate: [
    //   roleGuard(['official'])
    // ],
  },

  // =========================
  // RESEARCHER
  // =========================
  {
    path: 'researcher',
    component: Researcher,
    // canActivate: [
    //   roleGuard(['researcher'])
    // ],
  },
];