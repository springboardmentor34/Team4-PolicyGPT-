import { Routes } from '@angular/router';

import { PolicyList } from './pages/policy-list/policy-list';
import { PolicyDetails } from './pages/policy-details/policy-details';
import { AddPolicy } from './pages/add-policy/add-policy';
import { EditPolicy } from './pages/edit-policy/edit-policy';

export const POLICY_ROUTES: Routes = [
  {
    path: 'policies',
    component: PolicyList,
  },
  {
    path: 'policies/add',
    component: AddPolicy,
  },
  {
    path: 'policies/edit/:id',
    component: EditPolicy,
  },
  {
    path: 'policies/:id',
    component: PolicyDetails,
  },
];