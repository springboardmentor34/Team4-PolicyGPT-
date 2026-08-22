import { Routes } from '@angular/router';

import { MainLayout } from './features/layout/main-layout/main-layout';
import { Unauthorized } from './features/auth/unauthorized/unauthorized';

export const routes: Routes = [

  // ==========================================
  // PUBLIC APPLICATION
  // ==========================================

  {
    path: '',
    component: MainLayout,

    children: [

      // Guest home
      {
        path: '',
        loadComponent: () =>
          import('./features/dashboard/guest/guest')
            .then((m) => m.Guest),
      },

      // Public application pages
      {
        path: '',
        loadChildren: () =>
          import('./features/policy/policy.routes')
            .then((m) => m.POLICY_ROUTES),
      },

      {
        path: '',
        loadChildren: () =>
          import('./features/scheme/scheme.routes')
            .then((m) => m.SCHEME_ROUTES),
      },

      // Dashboard routes
      {
        path: '',
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes')
            .then((m) => m.DASHBOARD_ROUTES),
      },

    ],
  },


  // ==========================================
  // AUTHENTICATION
  // ==========================================

  {
    path: '',
    loadChildren: () =>
      import('./features/auth/auth.routes')
        .then((m) => m.AUTH_ROUTES),
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