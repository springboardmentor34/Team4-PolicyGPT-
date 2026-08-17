import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {

  return (route, state) => {

    const auth = inject(Auth);
    const router = inject(Router);

    const token = localStorage.getItem('access_token');

    // User is not logged in
    if (!token) {
      return router.createUrlTree(['/']);
    }

    const userRole = auth.getRoleFromToken()?.toLowerCase().trim();

    if (!userRole) {
      return router.createUrlTree(['/']);
    }

    const normalizedRole = normalizeRole(userRole);

    // Check whether user's role is allowed
    if (allowedRoles.includes(normalizedRole)) {
      return true;
    }

    // User doesn't have permission
    return router.createUrlTree(['/unauthorized']);
  };
};


function normalizeRole(role: string): string {

  switch (role) {

    case 'admin':
    case 'administrator':
      return 'admin';

    case 'official':
    case 'government official':
    case 'government_official':
      return 'official';

    case 'researcher':
      return 'researcher';

    case 'citizen':
      return 'citizen';

    case 'organization':
      return 'organization';

    case 'guest':
    case 'guest user':
    case 'guest_user':
      return 'guest';

    default:
      return 'guest';
  }
}