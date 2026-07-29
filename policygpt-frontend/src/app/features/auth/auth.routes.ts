import { Routes } from '@angular/router';
import { AuthLayout } from './auth-layout/auth-layout';
import { Login } from './login/login';
import { Register } from './register/register';
import { ForgotPassword } from './forgot-password/forgot-password';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    component: AuthLayout,
    children: [
      {
        path: '',
        component: Login,
      },
      {
        path: 'register',
        component: Register,
      },
      {
        path: 'forgot-password',
        component: ForgotPassword,
      },
    ],
  },
];