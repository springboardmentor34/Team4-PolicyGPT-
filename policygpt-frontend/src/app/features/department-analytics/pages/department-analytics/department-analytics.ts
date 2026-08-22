import {
  Component,
  OnInit,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { PolicyService } from '../../../../core/services/policy.service';
import {
  SchemeService,
  Scheme,
} from '../../../../core/services/scheme.service';

interface DepartmentAnalyticsRow {
  department: string;
  policies: number;
  activePolicies: number;
  schemes: number;
  activeSchemes: number;
  total: number;
}

interface AnalyticsData {
  policies: any[];
  schemes: Scheme[];
}

@Component({
  selector: 'app-department-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './department-analytics.html',
  styleUrl: './department-analytics.css',
})
export class DepartmentAnalytics implements OnInit {

  private readonly policyService = inject(PolicyService);
  private readonly schemeService = inject(SchemeService);
  private readonly cdr = inject(ChangeDetectorRef);

  loading = true;
  error = '';

  selectedDepartment = 'All Departments';
  selectedPeriod = 'All Time';

  departments: string[] = ['All Departments'];

  rows: DepartmentAnalyticsRow[] = [];

  private allData: AnalyticsData = {
    policies: [],
    schemes: [],
  };

  totalPolicies = 0;
  activePolicies = 0;

  totalSchemes = 0;
  activeSchemes = 0;

  totalDepartments = 0;

  ngOnInit(): void {
    this.loadAnalytics();
  }

  loadAnalytics(): void {
    this.loading = true;
    this.error = '';

    console.log('Loading department analytics...');

    this.policyService.getPolicies(0, 1000).subscribe({
      next: (policies) => {

        console.log('POLICIES RECEIVED:', policies);

        this.schemeService.getSchemes(0, 1000).subscribe({
          next: (schemeResponse) => {

            console.log('SCHEMES RECEIVED:', schemeResponse);

            const schemes = schemeResponse.items || [];

            /*
             * Store original API data.
             * This is required for period filtering.
             */
            this.allData = {
              policies: policies || [],
              schemes: schemes,
            };

            /*
             * Build initial All Time analytics.
             */
            this.selectedPeriod = 'All Time';
            this.selectedDepartment = 'All Departments';

            this.applyFilters();

            this.loading = false;

            /*
             * Force Angular to immediately update the UI.
             */
            this.cdr.detectChanges();

            console.log('ANALYTICS LOADED:', {
              policies: this.allData.policies.length,
              schemes: this.allData.schemes.length,
              rows: this.rows,
              loading: this.loading,
            });
          },

          error: (err) => {

            console.error(
              'SCHEMES ANGULAR ERROR:',
              err
            );

            /*
             * Keep policy data even if schemes fail.
             */
            this.allData = {
              policies: policies || [],
              schemes: [],
            };

            this.applyFilters();

            this.loading = false;

            this.cdr.detectChanges();
          },

          complete: () => {
            console.log(
              'Scheme request completed'
            );
          },
        });
      },

      error: (err) => {

        console.error(
          'POLICIES ANGULAR ERROR:',
          err
        );

        this.error =
          'Unable to load department analytics data. Please check that the backend is running.';

        this.loading = false;

        this.cdr.detectChanges();
      },

      complete: () => {
        console.log(
          'Policy request completed'
        );
      },
    });
  }

  private applyFilters(): void {

    const filteredPolicies =
      this.filterPoliciesByPeriod(
        this.allData.policies
      );

    const filteredSchemes =
      this.filterSchemesByPeriod(
        this.allData.schemes
      );

    this.buildAnalytics(
      filteredPolicies,
      filteredSchemes
    );

    this.cdr.detectChanges();
  }

  private filterPoliciesByPeriod(
    policies: any[]
  ): any[] {

    if (this.selectedPeriod === 'All Time') {
      return policies;
    }

    const now = new Date();

    let startDate: Date;
    let endDate: Date;

    if (this.selectedPeriod === 'This Year') {

      startDate = new Date(
        now.getFullYear(),
        0,
        1
      );

      endDate = new Date(
        now.getFullYear() + 1,
        0,
        1
      );

    } else {

      startDate = new Date(
        now.getFullYear() - 1,
        0,
        1
      );

      endDate = new Date(
        now.getFullYear(),
        0,
        1
      );
    }

    return policies.filter((policy) => {

      const rawDate =
        policy.published_date ||
        policy.publicationDate ||
        policy.created_at ||
        policy.createdAt;

      if (!rawDate) {
        return false;
      }

      const date = new Date(rawDate);

      return (
        date >= startDate &&
        date < endDate
      );
    });
  }

  private filterSchemesByPeriod(
    schemes: Scheme[]
  ): Scheme[] {

    if (this.selectedPeriod === 'All Time') {
      return schemes;
    }

    const now = new Date();

    let startDate: Date;
    let endDate: Date;

    if (this.selectedPeriod === 'This Year') {

      startDate = new Date(
        now.getFullYear(),
        0,
        1
      );

      endDate = new Date(
        now.getFullYear() + 1,
        0,
        1
      );

    } else {

      startDate = new Date(
        now.getFullYear() - 1,
        0,
        1
      );

      endDate = new Date(
        now.getFullYear(),
        0,
        1
      );
    }

    return schemes.filter((scheme) => {

      const rawDate =
        scheme.created_at ||
        scheme.application_start_date ||
        null;

      if (!rawDate) {
        return false;
      }

      const date = new Date(rawDate);

      return (
        date >= startDate &&
        date < endDate
      );
    });
  }

  private buildAnalytics(
    policies: any[],
    schemes: Scheme[]
  ): void {

    const departmentMap =
      new Map<
        string,
        DepartmentAnalyticsRow
      >();

    /*
     * ============================
     * POLICIES
     * ============================
     */

    for (const policy of policies) {

      const department =
        policy.department?.trim() ||
        'Unassigned';

      if (!departmentMap.has(department)) {

        departmentMap.set(
          department,
          {
            department,
            policies: 0,
            activePolicies: 0,
            schemes: 0,
            activeSchemes: 0,
            total: 0,
          }
        );
      }

      const row =
        departmentMap.get(department)!;

      row.policies++;
      row.total++;

      const status =
        String(
          policy.status || ''
        ).toLowerCase();

      if (
        status === 'active' ||
        status === 'approved' ||
        status === 'published'
      ) {
        row.activePolicies++;
      }
    }

    /*
     * ============================
     * SCHEMES
     * ============================
     */

    for (const scheme of schemes) {

      const department =
        scheme.department?.trim() ||
        'Unassigned';

      if (!departmentMap.has(department)) {

        departmentMap.set(
          department,
          {
            department,
            policies: 0,
            activePolicies: 0,
            schemes: 0,
            activeSchemes: 0,
            total: 0,
          }
        );
      }

      const row =
        departmentMap.get(department)!;

      row.schemes++;
      row.total++;

      if (
        String(
          scheme.status || ''
        ).toLowerCase() === 'active'
      ) {
        row.activeSchemes++;
      }
    }

    /*
     * ============================
     * ROWS
     * ============================
     */

    this.rows =
      Array.from(
        departmentMap.values()
      ).sort(
        (a, b) => b.total - a.total
      );

    /*
     * ============================
     * DEPARTMENT FILTER
     * ============================
     */

    this.departments = [
      'All Departments',

      ...this.rows
        .map(
          (row) => row.department
        )
        .filter(
          (department) =>
            department !== 'Unassigned'
        ),
    ];

    /*
     * Remove duplicate department names.
     */
    this.departments =
      Array.from(
        new Set(this.departments)
      );

    /*
     * ============================
     * GLOBAL TOTALS
     * ============================
     */

    this.totalPolicies =
      policies.length;

    this.activePolicies =
      policies.filter((policy) => {

        const status =
          String(
            policy.status || ''
          ).toLowerCase();

        return (
          status === 'active' ||
          status === 'approved' ||
          status === 'published'
        );

      }).length;

    this.totalSchemes =
      schemes.length;

    this.activeSchemes =
      schemes.filter(
        (scheme) =>
          String(
            scheme.status || ''
          ).toLowerCase() === 'active'
      ).length;

    this.totalDepartments =
      this.rows.length;
  }

  /*
   * ============================
   * FILTERED ROWS
   * ============================
   */

  get filteredRows(): DepartmentAnalyticsRow[] {

    if (
      this.selectedDepartment ===
      'All Departments'
    ) {
      return this.rows;
    }

    return this.rows.filter(
      (row) =>
        row.department ===
        this.selectedDepartment
    );
  }

  /*
   * ============================
   * DISPLAYED POLICIES
   * ============================
   */

  get displayedPolicies(): number {

    if (
      this.selectedDepartment ===
      'All Departments'
    ) {
      return this.totalPolicies;
    }

    return this.filteredRows.reduce(
      (total, row) =>
        total + row.policies,
      0
    );
  }

  /*
   * ============================
   * DISPLAYED ACTIVE POLICIES
   * ============================
   */

  get displayedActivePolicies(): number {

    if (
      this.selectedDepartment ===
      'All Departments'
    ) {
      return this.activePolicies;
    }

    return this.filteredRows.reduce(
      (total, row) =>
        total + row.activePolicies,
      0
    );
  }

  /*
   * ============================
   * DISPLAYED SCHEMES
   * ============================
   */

  get displayedSchemes(): number {

    if (
      this.selectedDepartment ===
      'All Departments'
    ) {
      return this.totalSchemes;
    }

    return this.filteredRows.reduce(
      (total, row) =>
        total + row.schemes,
      0
    );
  }

  /*
   * ============================
   * DISPLAYED ACTIVE SCHEMES
   * ============================
   */

  get displayedActiveSchemes(): number {

    if (
      this.selectedDepartment ===
      'All Departments'
    ) {
      return this.activeSchemes;
    }

    return this.filteredRows.reduce(
      (total, row) =>
        total + row.activeSchemes,
      0
    );
  }

  /*
   * ============================
   * DISPLAYED DEPARTMENTS
   * ============================
   */

  get displayedDepartments(): number {

    if (
      this.selectedDepartment ===
      'All Departments'
    ) {
      return this.totalDepartments;
    }

    return this.filteredRows.length;
  }

  /*
   * ============================
   * TOTAL ACTIVITY
   * ============================
   */

  get totalActivity(): number {

    return (
      this.displayedPolicies +
      this.displayedSchemes
    );
  }

  /*
   * ============================
   * MAX DEPARTMENT ACTIVITY
   * ============================
   */

  get maxDepartmentActivity(): number {

    if (
      !this.filteredRows.length
    ) {
      return 1;
    }

    return Math.max(
      ...this.filteredRows.map(
        (row) => row.total
      ),
      1
    );
  }

  /*
   * ============================
   * DEPARTMENT CHANGE
   * ============================
   */

  onDepartmentChange(
    event: Event
  ): void {

    const select =
      event.target as HTMLSelectElement;

    this.selectedDepartment =
      select.value;

    this.cdr.detectChanges();
  }

  /*
   * ============================
   * PERIOD CHANGE
   * ============================
   */

  onPeriodChange(
    event: Event
  ): void {

    const select =
      event.target as HTMLSelectElement;

    this.selectedPeriod =
      select.value;

    this.applyFilters();

    this.cdr.detectChanges();
  }
    /*
   * ============================
   * DEPARTMENT TREND COMPARISON
   * ============================
   */

  get departmentComparisonRows(): DepartmentAnalyticsRow[] {
    return [...this.filteredRows].sort(
      (a, b) => b.total - a.total
    );
  }

  get maxDepartmentPolicies(): number {
    if (!this.departmentComparisonRows.length) {
      return 1;
    }

    return Math.max(
      ...this.departmentComparisonRows.map(
        (row) => row.policies
      ),
      1
    );
  }

  get maxDepartmentSchemes(): number {
    if (!this.departmentComparisonRows.length) {
      return 1;
    }

    return Math.max(
      ...this.departmentComparisonRows.map(
        (row) => row.schemes
      ),
      1
    );
  }

  /*
   * ============================
   * REFRESH
   * ============================
   */

  refresh(): void {
    this.loadAnalytics();
  }
}