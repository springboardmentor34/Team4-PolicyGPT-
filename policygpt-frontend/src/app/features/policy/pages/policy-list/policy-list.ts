import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import { PolicySearch } from '../../components/policy-search/policy-search';
import { PolicyFilterComponent } from '../../components/policy-filter/policy-filter';
import { PolicyToolbar } from '../../components/policy-toolbar/policy-toolbar';
import { PolicyCard } from '../../components/policy-card/policy-card';

import { Policy } from '../../models/policy.model';
import { PolicyFilter } from '../../models/policy-filter.model';

import { PolicyService } from '../../../../core/services/policy.service';
import { SearchService } from '../../../../core/services/search.service';
import { Auth } from '../../../../core/services/auth';
import { UsageEventService } from '../../../../core/services/usage-event.service';

@Component({
  selector: 'app-policy-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatPaginatorModule,
    PolicySearch,
    PolicyFilterComponent,
    PolicyToolbar,
    PolicyCard
  ],
  templateUrl: './policy-list.html',
  styleUrl: './policy-list.css',
})
export class PolicyList implements OnInit {

  policies: Policy[] = [];

  allPolicies: Policy[] = [];

  pagedPolicies: Policy[] = [];

  searchKeyword = '';

  sortBy = 'newest';

  pageSize = 5;

  currentPage = 0;

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
  private router: Router,
  private policyService: PolicyService,
  private searchService: SearchService,
  private cdr: ChangeDetectorRef,
  private auth: Auth,
  private usageEventService: UsageEventService
) {}

 canCreatePolicy(): boolean {

  const role = this.auth.getRoleFromToken()
    ?.toLowerCase()
    .trim();

  return (
    role === 'admin' ||
    role === 'administrator' ||
    role === 'official' ||
    role === 'officer' ||
    role === 'government_official' ||
    role === 'government official'
  );

}

  navigateToCreatePolicy(): void {
    this.router.navigate(['/policies/add']);
  }

  ngOnInit(): void {
  this.loadPolicies();
}

  loadPolicies(): void {

  this.policyService.getPolicies().subscribe({

    next: (data) => {

      console.log('Policies received:', data);

      this.allPolicies = data;

      this.applySearchAndFilters();

      // Force the view to update
      this.cdr.detectChanges();

    },

    error: (error) => {

      console.error('Failed to load policies', error);

      this.cdr.detectChanges();

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

  onSort(sort: string): void {

    this.sortBy = sort;

    this.applySearchAndFilters();

  }

  applySearchAndFilters(): void {

    let result = this.searchService.filterPolicies(
      this.allPolicies,
      this.searchKeyword,
      this.currentFilter
    );

    result = this.searchService.sortPolicies(
      result,
      this.sortBy
    );

    this.policies = result;
    
    this.usageEventService.trackSearch(this.searchKeyword, this.currentFilter);

    // Reset to first page after every search/filter/sort
    this.currentPage = 0;

    this.updatePagedPolicies();

  }

  onPageChange(event: PageEvent): void {

    this.pageSize = event.pageSize;

    this.currentPage = event.pageIndex;

    this.updatePagedPolicies();

  }

  updatePagedPolicies(): void {

    const startIndex = this.currentPage * this.pageSize;

    const endIndex = startIndex + this.pageSize;

    this.pagedPolicies = this.policies.slice(startIndex, endIndex);

  }
  clearFilters(): void {

  this.searchKeyword = '';

  this.sortBy = 'newest';

  this.currentFilter = {
    policyName: '',
    schemeName: '',
    department: '',
    ministry: '',
    state: '',
    sector: '',
    publicationDate: '',
    status: ''
  };

  this.applySearchAndFilters();

}

}