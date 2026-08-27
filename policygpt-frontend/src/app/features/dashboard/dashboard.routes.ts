import { Routes } from '@angular/router';

import { Admin } from './admin/admin';
import { Citizen } from './citizen/citizen';
import { Official } from './official/official';
import { Researcher } from './researcher/researcher';
import { Organization } from './organization/organization';

import { authGuard } from '../../core/guards/auth-guard';

import { roleGuard } from '../../core/guards/role-guard';

export const DASHBOARD_ROUTES: Routes = [

  // =========================
  // ADMIN
  // =========================
  {
  path: 'admin',
  component: Admin,
  canActivate: [
    authGuard,
    roleGuard(['admin']),
  ],
},

  // =========================
  // CITIZEN
  // =========================
  {
  path: 'citizen',
  component: Citizen,
  canActivate: [
    authGuard,
    roleGuard(['citizen']),
  ],
},


  // =========================
  // RESEARCHER
  // =========================
 {
  path: 'researcher',
  component: Researcher,
  canActivate: [
    authGuard,
    roleGuard(['researcher']),
  ],
},

  // =========================
  // OFFICIAL
  // =========================
  {
  path: 'official',
  component: Official,
  canActivate: [
    authGuard,
    roleGuard(['official']),
  ],
},
 // =========================
  // ORGANIZATION
  // =========================
  {
    path: 'organization',
    component: Organization,
    canActivate: [
      authGuard,
      roleGuard(['organization']),
    ],
  },
];