import { Routes } from '@angular/router';
import { Feedback } from './feedback';
import { authGuard } from '../../core/guards/auth-guard';

export const FEEDBACK_ROUTES: Routes = [
  {
    path: 'feedback',
    component: Feedback
  }
];