
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin } from 'rxjs';

import { PolicyService } from '../../../core/services/policy.service';
import { SchemeService } from '../../../core/services/scheme.service';

interface ResearchPolicy {
  id: string;
  title: string;
  description: string;
  department: string;
  category: string;
  status: string;
  updated: string;
}

interface SectorStat {
  name: string;
  value: number;
  iconClass: string;
}

@Component({
  selector: 'app-researcher',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './researcher.html',
  styleUrl: './researcher.css',
})
export class Researcher implements OnInit {

  loading = true;
  errorMessage = '';

  // Real backend data
  policies: ResearchPolicy[] = [];
  sectors: SectorStat[] = [];

  totalPolicies = 0;
  totalSchemes = 0;

  constructor(
    private readonly router: Router,
    private readonly policyService: PolicyService,
    private readonly schemeService: SchemeService,
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  /**
   * Load everything required by the researcher dashboard.
   *
   * We intentionally use the existing policy/scheme APIs instead
   * of hardcoded dashboard values.
   */
  loadDashboard(): void {
    this.loading = true;
    this.errorMessage = '';

    forkJoin({
      policies: this.policyService.getPolicies(0, 1000),
      schemes: this.schemeService.getSchemes(0, 1000),
    }).subscribe({
      next: ({ policies, schemes }) => {
        this.totalPolicies = policies.length;
        this.totalSchemes = schemes.total ?? schemes.items.length;

        this.policies = policies
          .map((policy: any) => ({
            id: String(
              policy.id ??
              policy.policy_id ??
              ''
            ),

            title:
              policy.policyName ??
              policy.title ??
              'Untitled Policy',

            description:
              policy.description ??
              policy.title ??
              'Government policy',

            department:
              policy.department ??
              policy.ministry ??
              'Not specified',

            category:
              policy.category ??
              policy.sector ??
              'Other',

            status:
              policy.status ??
              'active',

            updated:
              this.formatDate(
                policy.updated_at ??
                policy.updatedAt ??
                policy.published_date ??
                policy.publicationDate
              ),
          }))
          .slice(0, 5);

        this.sectors =
          this.buildSectorStats(policies);

        this.loading = false;
      },

      error: (error) => {
        console.error(
          'Researcher dashboard API error:',
          error
        );

        this.loading = false;

        this.errorMessage =
          this.getErrorMessage(error);

        /*
         * Keep the dashboard usable even if one backend
         * request fails.
         */
        this.policies = [];
        this.sectors = [];
        this.totalPolicies = 0;
        this.totalSchemes = 0;
      },
    });
  }

  /**
   * Build sector/category counts from actual policies.
   */
  private buildSectorStats(
    policies: any[]
  ): SectorStat[] {

    const counts = new Map<string, number>();

    for (const policy of policies) {

      const category =
        String(
          policy.category ??
          policy.sector ??
          'Other'
        ).trim();

      if (!category) {
        continue;
      }

      counts.set(
        category,
        (counts.get(category) ?? 0) + 1
      );
    }

    const iconMap: Record<string, string> = {
      agriculture: 'agriculture',
      healthcare: 'health_and_safety',
      health: 'health_and_safety',
      education: 'school',
      employment: 'work_outline',
      'urban development': 'location_city',
    };

    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({
        name,
        value,
        iconClass:
          iconMap[name.toLowerCase()] ??
          'category',
      }));
  }

  /**
   * Format backend date values for the dashboard.
   */
  private formatDate(
    value: unknown
  ): string {

    if (!value) {
      return '—';
    }

    const date = new Date(String(value));

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return date.toLocaleDateString(
      'en-IN',
      {
        month: 'short',
        year: 'numeric',
      }
    );
  }

  /**
   * Navigate to another module.
   */
  navigate(route: string): void {

    if (!route) {
      return;
    }

    this.router.navigateByUrl(route);
  }

  /**
   * Open a particular policy.
   */
  openPolicy(policy: ResearchPolicy): void {

    if (!policy.id) {
      this.navigate('/policies');
      return;
    }

    this.router.navigate([
      '/policies',
      policy.id,
    ]);
  }

  /**
   * Retry failed API calls.
   */
  retry(): void {
    this.loadDashboard();
  }

  private getErrorMessage(
    error: any
  ): string {

    if (error?.status === 0) {
      return 'Unable to connect to the backend server.';
    }

    if (error?.status === 401) {
      return 'Your session has expired. Please log in again.';
    }

    if (error?.status === 403) {
      return 'You do not have permission to view this dashboard.';
    }

    return (
      error?.error?.detail ??
      error?.error?.message ??
      'Unable to load researcher dashboard data.'
    );
  }
}
