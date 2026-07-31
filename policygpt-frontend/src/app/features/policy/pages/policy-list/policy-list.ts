import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { PolicySearch } from '../../components/policy-search/policy-search';
import { PolicyFilter } from '../../components/policy-filter/policy-filter';
import { PolicyCard } from '../../components/policy-card/policy-card';

@Component({
  selector: 'app-policy-list',
  standalone: true,
  imports: [
    MatIconModule,
    PolicySearch,
    PolicyFilter,
    PolicyCard
  ],
  templateUrl: './policy-list.html',
  styleUrl: './policy-list.css',
})
export class PolicyList {

}
