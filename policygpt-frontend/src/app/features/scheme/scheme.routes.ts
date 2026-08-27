import { Routes } from '@angular/router';

import { SchemeList } from './pages/scheme-list/scheme-list';
import { SchemeCreate } from './pages/scheme-create/scheme-create';
import { EligibilityRuleManage } from './pages/eligibility-rule-manage/eligibility-rule-manage';

import { roleGuard } from '../../core/guards/role-guard';

export const SCHEME_ROUTES: Routes = [

  // Public repository
  {
    path: 'schemes',
    component: SchemeList,
  },

  // Government Official only
  {
    path: 'schemes/create',
    component: SchemeCreate,
    canActivate: [
      roleGuard(['official', 'admin']),
    ],
  },

  // Government Official only
  {
    path: 'schemes/eligibility',
    component: EligibilityRuleManage,
    canActivate: [
      roleGuard(['official' , 'admin']),
    ],
  },

  // Government Official only
  {
    path: 'schemes/:schemeId/eligibility',
    component: EligibilityRuleManage,
    canActivate: [
      roleGuard(['official', 'admin']),
    ],
  },

];