import { Routes } from '@angular/router';

import { MainLayout } from './features/layout/main-layout/main-layout';
import { AuthLayout } from './features/auth/auth-layout/auth-layout';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { ForgotPassword } from './features/auth/forgot-password/forgot-password';
import { Unauthorized } from './features/auth/unauthorized/unauthorized';

export const routes: Routes = [

  // ==========================================
  // LOGIN
  // ==========================================
  {
    path: 'login',
    component: AuthLayout,
    children: [
      {
        path: '',
        component: Login,
      },
    ],
  },

  // ==========================================
  // REGISTER
  // ==========================================
  {
    path: 'register',
    component: AuthLayout,
    children: [
      {
        path: '',
        component: Register,
      },
    ],
  },

  // ==========================================
  // FORGOT PASSWORD
  // ==========================================
  {
    path: 'forgot-password',
    component: AuthLayout,
    children: [
      {
        path: '',
        component: ForgotPassword,
      },
    ],
  },

  // ==========================================
  // MAIN APPLICATION
  // ==========================================
  {
    path: '',
    component: MainLayout,
    children: [

      // Guest
      {
        path: '',
        loadComponent: () =>
          import('./features/dashboard/guest/guest')
            .then(m => m.Guest),
      },

      // Policies
      {
        path: '',
        loadChildren: () =>
          import('./features/policy/policy.routes')
            .then(m => m.POLICY_ROUTES),
      },

      // Schemes
      {
        path: '',
        loadChildren: () =>
          import('./features/scheme/scheme.routes')
            .then(m => m.SCHEME_ROUTES),
      },

      // Dashboards
      {
        path: '',
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes')
            .then(m => m.DASHBOARD_ROUTES),
      },
    ],
  },

  // ==========================================
  // UNAUTHORIZED
  // ==========================================
  {
    path: 'unauthorized',
    component: Unauthorized,
  },

  // ==========================================
  // FALLBACK
  // ==========================================
  {
    path: '**',
    redirectTo: '',
  },
];