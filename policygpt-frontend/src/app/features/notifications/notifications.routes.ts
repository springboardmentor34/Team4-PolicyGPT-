import { Routes } from '@angular/router';
import { Notifications } from './notifications';
import { authGuard } from '../../core/guards/auth-guard';

export const NOTIFICATION_ROUTES: Routes = [
  {
    path: 'notifications',
    component: Notifications,
    // canActivate: [authGuard]
  },
];
