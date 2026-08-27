import { Routes } from '@angular/router';

import { PolicyList } from './pages/policy-list/policy-list';
import { PolicyDetails } from './pages/policy-details/policy-details';
import { AddPolicy } from './pages/add-policy/add-policy';
import { EditPolicy } from './pages/edit-policy/edit-policy';
import { PolicyApproval } from './pages/policy-approval/policy-approval';
import { PolicyComparison } from './pages/policy-comparison/policy-comparison';
import { roleGuard } from '../../core/guards/role-guard';
export const POLICY_ROUTES: Routes = [
  {
    path: 'policies', //✅
    component: PolicyList,
  },
  {
    path: 'policies/add', //✅
    component: AddPolicy,
    canActivate: [roleGuard(['admin', 'official'])],
  },
  {
    path: 'policies/edit/:id', //✅
    component: EditPolicy,
    canActivate: [roleGuard(['admin', 'official'])],
  },
  {
  path: 'policies/approval', //✅
  component: PolicyApproval,
  canActivate: [roleGuard(['admin'])],
},
  {
  path: 'policies/comparison', //✅
  component: PolicyComparison,
  canActivate: [
      roleGuard([
        'admin',
        'official',
        'researcher',
        'organization',
      ]),
    ],
},
  {
    path: 'policies/:id', //✅
    component: PolicyDetails,
  },
];