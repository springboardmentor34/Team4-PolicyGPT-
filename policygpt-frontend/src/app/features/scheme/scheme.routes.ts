import { Routes } from '@angular/router';
import { SchemeList } from './pages/scheme-list/scheme-list';
import { SchemeCreate } from './pages/scheme-create/scheme-create';

export const SCHEME_ROUTES: Routes = [
  {
    path: 'schemes',
    component: SchemeList,
  },
  {
    path: 'schemes/create',
    component: SchemeCreate,
  },
];