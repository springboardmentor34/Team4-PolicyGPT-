import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import {
  MatPaginatorModule,
  PageEvent
} from '@angular/material/paginator';

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
    MatIconModule,
    MatPaginatorModule,
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

  sortBy = 'newest';

  pageSize = 5;

  currentPage = 0;

  currentFilter: PolicyFilter = {
    keyword: '',
    department: '',
    state: '',
    category: '',
    status: '',
    publicationDate: ''
  };


  constructor(
    private router: Router,
    private policyService: PolicyService,
    private searchService: SearchService,
    private auth: Auth,
    private usageEventService: UsageEventService,
    private changeDetector: ChangeDetectorRef
  ) {}


  canCreatePolicy(): boolean {

    const role = this.auth
      .getRoleFromToken()
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

  canApprovePolicies(): boolean {

  const role = this.auth
    .getRoleFromToken()
    ?.toLowerCase()
    .trim();

  return (
    role === 'admin' ||
    role === 'administrator'
  );

}


  navigateToCreatePolicy(): void {

    this.router.navigate(['/policies/add']);

  }
  navigateToPolicyApproval(): void {
  this.router.navigate(['/policies/approval']);
}


  ngOnInit(): void {

    this.loadPolicies();

  }


  loadPolicies(): void {

    this.policyService.getPolicies().subscribe({

      next: (data) => {

        console.log('Policies received:', data);

        this.allPolicies = data ?? [];

        this.applySearchAndFilters();

        this.changeDetector.detectChanges();

      },

      error: (error) => {

        console.error(
          'Failed to load policies',
          error
        );

        this.allPolicies = [];

        this.policies = [];

        this.pagedPolicies = [];

        this.changeDetector.detectChanges();

      }

    });

  }


  onFilter(filter: PolicyFilter): void {

    this.currentFilter = {
      ...filter
    };

    this.applySearchAndFilters();

  }


  onSort(sort: string): void {

    this.sortBy = sort;

    this.applySearchAndFilters();

  }


  applySearchAndFilters(): void {

    let result = this.searchService.filterPolicies(
      this.allPolicies,
      this.currentFilter
    );


    result = this.searchService.sortPolicies(
      result,
      this.sortBy
    );


    this.policies = result;


    this.usageEventService.trackSearch(
      this.currentFilter.keyword,
      this.currentFilter
    );


    this.currentPage = 0;

    this.updatePagedPolicies();

  }


  clearFilters(): void {

    this.currentFilter = {
      keyword: '',
      department: '',
      state: '',
      category: '',
      status: '',
      publicationDate: ''
    };

    this.sortBy = 'newest';

    this.currentPage = 0;

    this.applySearchAndFilters();

  }


  onPageChange(event: PageEvent): void {

    this.pageSize = event.pageSize;

    this.currentPage = event.pageIndex;

    this.updatePagedPolicies();

  }


  updatePagedPolicies(): void {

    const startIndex =
      this.currentPage * this.pageSize;

    const endIndex =
      startIndex + this.pageSize;

    this.pagedPolicies =
      this.policies.slice(
        startIndex,
        endIndex
      );

  }

}