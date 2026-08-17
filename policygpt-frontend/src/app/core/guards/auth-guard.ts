import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {

  const auth = inject(Auth);
  const router = inject(Router);

  const token = localStorage.getItem('access_token');

  // No token → go to login
  if (!token) {
    return router.createUrlTree(['/']);
  }

  return true;
};