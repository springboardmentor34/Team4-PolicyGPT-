import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { PolicySearch } from '../../components/policy-search/policy-search';
import { PolicyFilterComponent } from '../../components/policy-filter/policy-filter';
import { PolicyCard } from '../../components/policy-card/policy-card';

import { Policy } from '../../models/policy.model';
import { PolicyService } from '../../../../core/services/policy.service';
import { PolicyFilter } from '../../models/policy-filter.model';
import { SearchService } from '../../../../core/services/search.service';

@Component({
  selector: 'app-policy-list',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    PolicySearch,
    PolicyFilterComponent,
    PolicyCard
  ],
  templateUrl: './policy-list.html',
  styleUrl: './policy-list.css',
})
export class PolicyList implements OnInit {

  policies: Policy[] = [];

  allPolicies: Policy[] = [];

searchKeyword = '';

currentFilter: PolicyFilter = {
  policyName: '',
  schemeName: '',
  department: '',
  ministry: '',
  state: '',
  sector: '',
  publicationDate: '',
  status: ''
};

  constructor(
  private policyService: PolicyService,
  private searchService: SearchService
) {}
ngOnInit(): void {
  this.loadPolicies();
}

  loadPolicies(): void {
    this.policyService.getPolicies().subscribe({
      next: (data) => {
        this.allPolicies = data;
this.policies = data;
      },
      error: (error) => {
        console.error('Failed to load policies', error);
      }
    });
  }

  onSearch(keyword: string): void {

  this.searchKeyword = keyword;

  this.applySearchAndFilters();

}
onFilter(filter: PolicyFilter): void {

  this.currentFilter = filter;

  this.applySearchAndFilters();

}
applySearchAndFilters(): void {

  this.policies = this.searchService.filterPolicies(
    this.allPolicies,
    this.searchKeyword,
    this.currentFilter
  );

}

}