import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: '',
    loadChildren: () =>
      import('./features/dashboard/dashboard.routes').then(
        (m) => m.DASHBOARD_ROUTES
      ),
  },
  {
    path: '',
    loadChildren: () =>
      import('./features/policy/policy.routes').then(
        (m) => m.POLICY_ROUTES
      ),
  },
  {
  path: '',
  loadChildren: () =>
    import('./features/eligibility/eligibility.routes').then(
      (m) => m.ELIGIBILITY_ROUTES
    ),
},
  {
    path: '**',
    redirectTo: '',
  },
];