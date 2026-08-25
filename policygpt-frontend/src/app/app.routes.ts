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
      // ==========================================
      // GUEST DASHBOARD
      // ==========================================
      {
        path: '',
        loadComponent: () => import('./features/dashboard/guest/guest').then((m) => m.Guest),
      },

      // ==========================================
      // POLICIES
      // ==========================================
      {
        path: '',
        loadChildren: () => import('./features/policy/policy.routes').then((m) => m.POLICY_ROUTES),
      },

      // ==========================================
      // ELIGIBILITY
      // ==========================================
      {
        path: '',
        loadChildren: () =>
          import('./features/eligibility/eligibility.routes').then((m) => m.ELIGIBILITY_ROUTES),
      },

      // ==========================================
      // SCHEMES
      // ==========================================
      {
        path: '',
        loadChildren: () => import('./features/scheme/scheme.routes').then((m) => m.SCHEME_ROUTES),
      },

      // ==========================================
      // DASHBOARDS
      // ==========================================
      {
        path: '',
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
      },

      // ==========================================
      // FEEDBACK
      // ==========================================
      {
        path: '',
        loadChildren: () =>
          import('./features/feedback/feedback.routes').then((m) => m.FEEDBACK_ROUTES),
      },

      // ==========================================
      // NOTIFICATIONS
      // ==========================================
      {
        path: '',
        loadChildren: () =>
          import('./features/notifications/notifications.routes').then(
            (m) => m.NOTIFICATION_ROUTES,
          ),
      },

      // ==========================================
      // REPORTS
      // ==========================================
      {
        path: '',
        loadChildren: () =>
          import('./features/reports/reports.routes').then((m) => m.REPORTS_ROUTES),
      },

      // ==========================================
      // DEPARTMENT ANALYTICS
      // ==========================================
      {
        path: 'department-analytics',
        loadChildren: () =>
          import('./features/department-analytics/department-analytics.routes').then(
            (m) => m.DEPARTMENT_ANALYTICS_ROUTES,
          ),
      },

      {
        path: 'departments',
        loadChildren: () =>
          import('./features/departments/departments.routes').then((m) => m.DEPARTMENT_ROUTES),
      },

      // ==========================================
      // USAGE STATISTICS
      // ==========================================
      {
        path: 'usage-statistics',
        loadChildren: () =>
          import('./features/usage-statistics/usage-statistics.routes').then(
            (m) => m.USAGE_STATISTICS_ROUTES,
          ),
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
