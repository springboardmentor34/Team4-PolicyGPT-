
import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit
} from '@angular/core';

import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import {
  OfficialService,
  OfficialDashboardResponse,
  DepartmentReport
} from '../../../core/services/official.service';

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
  styleUrl: './official.css'
})
export class Official implements OnInit {

  private readonly router = inject(Router);

  private readonly officialService =
    inject(OfficialService);

  private readonly cdr = inject(ChangeDetectorRef);


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

  dashboardLoaded = false;


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
      description:
        'View, search and manage government policies.',
      icon: 'policy',
      route: '/policies',
      label: 'View Policies'
    },

    {
      title: 'Add Policy',
      description:
        'Create and submit a new government policy.',
      icon: 'add_circle',
      route: '/policies/add',
      label: 'Add Policy'
    },

    {
      title: 'Policy Comparison',
      description:
        'Compare multiple policies side by side.',
      icon: 'compare_arrows',
      route: '/policies/comparison',
      label: 'Compare Policies'
    },

    {
      title: 'Scheme Management',
      description:
        'View, search and manage government schemes.',
      icon: 'account_balance',
      route: '/schemes',
      label: 'Manage Schemes'
    },

    {
      title: 'Create Scheme',
      description:
        'Add a new government scheme to the repository.',
      icon: 'add_business',
      route: '/schemes/create',
      label: 'Create Scheme'
    },

    {
      title: 'Eligibility Checker',
      description:
        'Check scheme eligibility and matching results.',
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

  departmentReports: DepartmentReport[] = [];


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

    this.officialService
      .getDashboardStats()
      .subscribe({

        next: (data) => {

          console.log(
            'Official dashboard response:',
            data
          );

          this.applyDashboardData(data);

          this.dashboardLoaded = true;

          this.loading = false;

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error(
            'Official dashboard API error:',
            error
          );

          this.dashboardLoaded = false;

          this.loading = false;

          this.errorMessage =
            this.getErrorMessage(error);
        }

      });
  }


  // =====================================================
  // APPLY DASHBOARD RESPONSE
  // =====================================================

  private applyDashboardData(
    data: OfficialDashboardResponse
  ): void {

    /*
     * Support both camelCase and snake_case
     * responses from FastAPI/backend.
     */

    this.totalPolicies =
      this.toNumber(
        data.totalPolicies ??
        data.total_policies
      );

    this.activeSchemes =
      this.toNumber(
        data.activeSchemes ??
        data.active_schemes
      );

    this.totalDepartments =
      this.toNumber(
        data.totalDepartments ??
        data.total_departments
      );

    this.notifications =
      this.toNumber(
        data.notifications
      );


    // ===================================================
    // POLICY STATUS
    // ===================================================

    this.policyStats = [

      {
        title: 'Approved Policies',

        count: this.toNumber(
          data.approvedPolicies ??
          data.approved_policies
        ),

        icon: 'check_circle',

        route: '/policies'
      },

      {
        title: 'Pending Policies',

        count: this.toNumber(
          data.pendingPolicies ??
          data.pending_policies
        ),

        icon: 'pending',

        route: '/policies/approval'
      },

      {
        title: 'Rejected Policies',

        count: this.toNumber(
          data.rejectedPolicies ??
          data.rejected_policies
        ),

        icon: 'cancel',

        route: '/policies'
      }

    ];


    // ===================================================
    // SCHEME USAGE
    // ===================================================

    this.schemeUsage =
      Array.isArray(data.schemeUsage)
        ? data.schemeUsage
        : Array.isArray(data.scheme_usage)
          ? data.scheme_usage
          : [];


    // ===================================================
    // RECENT ACTIVITY
    // ===================================================

    this.recentActivity =
      Array.isArray(data.recentActivity)
        ? data.recentActivity
        : Array.isArray(data.recent_activity)
          ? data.recent_activity
          : [];
  }


  // =====================================================
  // DEPARTMENT REPORTS
  // =====================================================

  loadDepartmentReports(): void {

    this.officialService
      .getDepartmentReports()
      .subscribe({

        next: (data) => {

          console.log(
            'Department reports response:',
            data
          );

          this.departmentReports =
            this.normalizeDepartmentReports(data);
        },

        error: (error) => {

          console.error(
            'Department reports API error:',
            error
          );

          this.departmentReports = [];
        }

      });
  }


  // =====================================================
  // NORMALIZE DEPARTMENT DATA
  // =====================================================

  private normalizeDepartmentReports(
    data: any
  ): DepartmentReport[] {

    if (!Array.isArray(data)) {
      return [];
    }

    return data.map(
      (item: any): DepartmentReport => ({

        departmentId: String(
          item.departmentId ??
          item.department_id ??
          item.id ??
          ''
        ),

        department:
          item.department ??
          item.departmentName ??
          item.department_name ??
          'Unknown Department',

        policies: this.toNumber(
          item.policies ??
          item.policy_count ??
          item.totalPolicies
        ),

        schemes: this.toNumber(
          item.schemes ??
          item.scheme_count ??
          item.totalSchemes
        )

      })
    );
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

    if (!route) {
      return;
    }

    this.router.navigateByUrl(route);
  }


  // =====================================================
  // HELPERS
  // =====================================================

  private toNumber(
    value: unknown
  ): number {

    const numberValue =
      Number(value);

    return Number.isFinite(numberValue)
      ? numberValue
      : 0;
  }


  private getErrorMessage(
    error: any
  ): string {

    if (error?.status === 401) {

      return 'Your session has expired. Please log in again.';
    }

    if (error?.status === 403) {

      return 'You do not have permission to access the government dashboard.';
    }

    if (error?.status === 404) {

      return 'Government dashboard API endpoint was not found.';
    }

    if (error?.status === 0) {

      return 'Unable to connect to the backend server.';
    }

    return (
      error?.error?.detail ??
      error?.error?.message ??
      'Unable to load government dashboard data.'
    );
  }

}
