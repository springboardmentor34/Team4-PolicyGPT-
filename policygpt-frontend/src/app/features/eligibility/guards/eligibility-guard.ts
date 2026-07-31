import { CanActivateFn } from '@angular/router';

export const eligibilityGuard: CanActivateFn = (route, state) => {
  return true;
};
