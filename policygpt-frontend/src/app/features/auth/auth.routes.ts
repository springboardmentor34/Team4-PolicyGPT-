import { Routes } from '@angular/router';

import { AuthLayout } from './auth-layout/auth-layout';
import { Login } from './login/login';
import { Register } from './register/register';
import { ForgotPassword } from './forgot-password/forgot-password';

export const AUTH_ROUTES: Routes = [
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
];