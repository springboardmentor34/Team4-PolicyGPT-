import { Routes } from '@angular/router';
import { MainLayout } from './features/layout/main-layout/main-layout';
import { Unauthorized } from './features/auth/unauthorized/unauthorized';

export const routes: Routes = [
  // Authentication routes - NO NAVBAR
  {
    path: '',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  // Application routes - WITH NAVBAR
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
      },

      {
        path: '',
        loadChildren: () => import('./features/policy/policy.routes').then((m) => m.POLICY_ROUTES),
      },

      {
        path: '',
        loadChildren: () =>
          import('./features/eligibility/eligibility.routes').then((m) => m.ELIGIBILITY_ROUTES),
      },
      {
        path: '',
        loadChildren: () => import('./features/scheme/scheme.routes').then((m) => m.SCHEME_ROUTES),
      },
      {
        path: '',
        loadChildren: () =>
          import('./features/feedback/feedback.routes').then((m) => m.FEEDBACK_ROUTES),
      },
      {
        path: '',
        loadChildren: () =>
          import('./features/notifications/notifications.routes').then(
            (m) => m.NOTIFICATION_ROUTES,
          ),
      },
      {
        path: '',
      loadChildren: () =>
        import('./features/reports/reports.routes').then(
          (m) => m.REPORTS_ROUTES,
        ),
      },
    ],
  },

  {
    path: 'unauthorized',
    component: Unauthorized,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
