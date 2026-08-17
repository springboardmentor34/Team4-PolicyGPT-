import { Routes } from '@angular/router';
import { SchemeList } from './pages/scheme-list/scheme-list';
import { SchemeCreate } from './pages/scheme-create/scheme-create';
import { EligibilityRuleManage } from './pages/eligibility-rule-manage/eligibility-rule-manage';

export const SCHEME_ROUTES: Routes = [
  {
    path: 'schemes', //✅
    component: SchemeList,
  },
  {
    path: 'schemes/create', //✅
    component: SchemeCreate,
  },
  {
    path: 'schemes/eligibility',
    component: EligibilityRuleManage,
  },
  {
    path: 'schemes/:schemeId/eligibility',
    component: EligibilityRuleManage,
  },
];