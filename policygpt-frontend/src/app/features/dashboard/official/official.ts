import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { OfficialService } from '../../../core/services/official.service';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-official',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './official.html',
  styleUrl: './official.css',
})
export class Official implements OnInit {

  private router = inject(Router);
  private officialService = inject(OfficialService);


  // =====================================================
  // BASIC INFORMATION
  // =====================================================

  officialName = 'Government Official';

  totalPolicies = 0;
  activeSchemes = 0;
  totalDepartments = 0;
  notifications = 0;


  // =====================================================
  // LOADING / ERROR
  // =====================================================

  loading = true;
  errorMessage = '';


  // =====================================================
  // POLICY STATUS
  // =====================================================

  policyStats = [
    {
      title: 'Approved Policies',
      count: 0,
      icon: 'check_circle',
      route: '/policies'
    },
    {
      title: 'Pending Policies',
      count: 0,
      icon: 'pending',
      route: '/policies/approval'
    },
    {
      title: 'Rejected Policies',
      count: 0,
      icon: 'cancel',
      route: '/policies'
    }
  ];


  // =====================================================
  // MANAGEMENT ACTIONS
  // =====================================================

  managementActions = [
    {
      title: 'Policy Repository',
      description: 'View, search and manage government policies.',
      icon: 'policy',
      route: '/policies',
      label: 'View Policies'
    },
    {
      title: 'Add Policy',
      description: 'Create and submit a new government policy.',
      icon: 'add_circle',
      route: '/policies/add',
      label: 'Add Policy'
    },
    {
      title: 'Policy Approval',
      description: 'Review and process pending policy submissions.',
      icon: 'fact_check',
      route: '/policies/approval',
      label: 'Review Policies'
    },
    {
      title: 'Policy Comparison',
      description: 'Compare multiple policies side by side.',
      icon: 'compare_arrows',
      route: '/policies/comparison',
      label: 'Compare Policies'
    },
    {
      title: 'Scheme Management',
      description: 'View, search and manage government schemes.',
      icon: 'account_balance',
      route: '/schemes',
      label: 'Manage Schemes'
    },
    {
      title: 'Create Scheme',
      description: 'Add a new government scheme to the repository.',
      icon: 'add_business',
      route: '/schemes/create',
      label: 'Create Scheme'
    },
    {
      title: 'Eligibility Checker',
      description: 'Check scheme eligibility and matching results.',
      icon: 'verified',
      route: '/eligibility',
      label: 'Open Checker'
    }
  ];


  // =====================================================
  // SCHEME USAGE
  // =====================================================

  schemeUsage: any[] = [];


  // =====================================================
  // DEPARTMENT REPORTS
  // =====================================================

  departmentReports: any[] = [];


  // =====================================================
  // RECENT ACTIVITY
  // =====================================================

  recentActivity: any[] = [];


  // =====================================================
  // INITIALIZATION
  // =====================================================

  ngOnInit(): void {
    this.loadDashboardStats();
    this.loadDepartmentReports();
  }


  // =====================================================
  // DASHBOARD STATISTICS
  // =====================================================

  loadDashboardStats(): void {

    this.loading = true;
    this.errorMessage = '';

    this.officialService.getDashboardStats().subscribe({

      next: (data) => {

        console.log('Official dashboard response:', data);

        this.totalPolicies =
          data.totalPolicies ?? 0;

        this.activeSchemes =
          data.activeSchemes ?? 0;

        this.totalDepartments =
          data.totalDepartments ?? 0;

        this.notifications =
          data.notifications ?? 0;


        // Policy statistics

        this.policyStats = [
          {
            title: 'Approved Policies',
            count: data.approvedPolicies ?? 0,
            icon: 'check_circle',
            route: '/policies'
          },
          {
            title: 'Pending Policies',
            count: data.pendingPolicies ?? 0,
            icon: 'pending',
            route: '/policies/approval'
          },
          {
            title: 'Rejected Policies',
            count: data.rejectedPolicies ?? 0,
            icon: 'cancel',
            route: '/policies'
          }
        ];


        // Scheme usage

        this.schemeUsage =
          data.schemeUsage ?? [];


        // Recent activity

        this.recentActivity =
          data.recentActivity ?? [];


        this.loading = false;
      },

      error: (error) => {

        console.error(
          'Failed to load official dashboard:',
          error
        );

        this.errorMessage =
          'Unable to load government dashboard data.';

        this.loading = false;
      }

    });
  }


  // =====================================================
  // DEPARTMENT REPORTS
  // =====================================================

  loadDepartmentReports(): void {

    this.officialService.getDepartmentReports().subscribe({

      next: (data) => {

        console.log(
          'Department reports response:',
          data
        );

        this.departmentReports =
          data ?? [];

      },

      error: (error) => {

        console.error(
          'Failed to load department reports:',
          error
        );

        this.departmentReports = [];

      }

    });
  }


  // =====================================================
  // DEPARTMENT ANALYTICS
  // =====================================================

  openDepartmentAnalytics(
    departmentId: string
  ): void {

    if (!departmentId) {
      return;
    }

    this.router.navigate(
      ['/department-analytics'],
      {
        queryParams: {
          department: departmentId
        }
      }
    );
  }


  // =====================================================
  // RETRY
  // =====================================================

  retry(): void {

    this.loadDashboardStats();
    this.loadDepartmentReports();

  }


  // =====================================================
  // NAVIGATION
  // =====================================================

  navigate(route: string): void {

    this.router.navigateByUrl(route);

  }

}