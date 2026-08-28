import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import Chart from 'chart.js/auto';
import { forkJoin } from 'rxjs';

import {
  AnalyticsService,
  AnalyticsSummaryResponse,
  EligibilityStatsResponse,
  EngagementSummaryResponse,
  PolicyStatsResponse,
} from '../../../../core/services/analytics.service';
import { Auth } from '../../../../core/services/auth';

interface KpiCard {
  label: string;
  value: number | string;
  badge: string;
  icon: string;
}

interface FilterOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-analytics-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './analytics-dashboard.html',
  styleUrl: './analytics-dashboard.css',
})
export class AnalyticsDashboard implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('policyChart') policyChartRef?: ElementRef<HTMLCanvasElement>;
  @ViewChild('engagementChart') engagementChartRef?: ElementRef<HTMLCanvasElement>;
  @ViewChild('eligibilityChart') eligibilityChartRef?: ElementRef<HTMLCanvasElement>;

  loading = false;
  error = '';
  viewReady = false;

  currentRole = 'guest';
  selectedPeriod = '30d';
  selectedDepartment = '';
  selectedCategory = '';
  customStartDate = '';
  customEndDate = '';

  summary: AnalyticsSummaryResponse | null = null;
  policyStats: PolicyStatsResponse | null = null;
  engagement: EngagementSummaryResponse | null = null;
  eligibility: EligibilityStatsResponse | null = null;

  departmentOptions: FilterOption[] = [];
  categoryOptions: FilterOption[] = [];

  readonly periods: FilterOption[] = [
    { label: 'Last 7 Days', value: '7d' },
    { label: 'Last 30 Days', value: '30d' },
    { label: 'Last 3 Months', value: '3m' },
    { label: 'Last 6 Months', value: '6m' },
    { label: 'Last Year', value: '1y' },
    { label: 'Custom Range', value: 'custom' },
  ];

  readonly defaultCategories: FilterOption[] = [
    { label: 'Agriculture', value: 'Agriculture' },
    { label: 'Education', value: 'Education' },
    { label: 'Healthcare', value: 'Healthcare' },
    { label: 'Employment', value: 'Employment' },
    { label: 'Housing', value: 'Housing' },
    { label: 'Social Welfare', value: 'Social Welfare' },
  ];

  private policyChart?: Chart;
  private engagementChart?: Chart;
  private eligibilityChart?: Chart;

  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly auth: Auth,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.currentRole = this.normalizeRole(this.auth.getRoleFromToken());
    if (this.isOfficial()) {
      this.selectedDepartment = this.getDepartmentFromToken() || 'Assigned department';
    }
    this.categoryOptions = this.defaultCategories;
    this.loadAnalytics();
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.renderCharts();
  }

  ngOnDestroy(): void {
    this.destroyCharts();
  }

  get kpis(): KpiCard[] {
    return [
      {
        label: 'Total Policies',
        value: this.summary?.total_policies ?? 0,
        badge: this.primaryPolicyStatus,
        icon: 'description',
      },
      {
        label: 'Active Schemes',
        value: this.summary?.active_schemes ?? 0,
        badge: 'Active',
        icon: 'verified',
      },
      {
        label: 'User Activity',
        value: this.summary?.users ?? this.engagement?.searches ?? 0,
        badge: this.isResearcher() ? 'Aggregated' : 'Scoped',
        icon: 'groups',
      },
      {
        label: 'Citizen Engagement',
        value: this.summary?.total_engagement ?? 0,
        badge: 'Interactions',
        icon: 'insights',
      },
    ];
  }

  get hasDashboardData(): boolean {
    return !!(
      this.summary?.total_policies ||
      this.summary?.active_schemes ||
      this.summary?.total_engagement ||
      this.policyStats?.by_category?.length ||
      this.engagement?.timeline?.length ||
      this.eligibility?.age_groups?.some((item) => item.count > 0)
    );
  }

  get isCustomRange(): boolean {
    return this.selectedPeriod === 'custom';
  }

  get departmentLocked(): boolean {
    return this.isOfficial();
  }

  get roleScopeLabel(): string {
    if (this.isAdmin()) return 'Platform-wide metrics';
    if (this.isOfficial()) return 'Assigned department scope';
    if (this.isResearcher()) return 'Read-only aggregate metrics';
    if (this.isOrganization()) return 'Organization policy engagement';
    return 'Restricted';
  }

  get primaryPolicyStatus(): string {
    const firstStatus = this.policyStats?.by_status?.[0];
    return firstStatus ? `${firstStatus.label}: ${firstStatus.count}` : 'All statuses';
  }

  loadAnalytics(): void {
    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();

    const filters = this.buildFilters();

    forkJoin({
      summary: this.analyticsService.getSummary(filters),
      policyStats: this.analyticsService.getPolicyStats(filters),
      engagement: this.analyticsService.getEngagementSummary(filters),
      eligibility: this.analyticsService.getEligibilityStats(filters),
    }).subscribe({
      next: (data) => {
        this.summary = data.summary;
        this.policyStats = data.policyStats;
        this.engagement = data.engagement;
        this.eligibility = data.eligibility;
        this.syncFilterOptions();
        this.loading = false;
        this.cdr.detectChanges();
        this.renderCharts();
      },
      error: () => {
        this.loading = false;
        this.error = 'Unable to load analytics dashboard data.';
        this.destroyCharts();
        this.cdr.detectChanges();
      },
    });
  }

  applyFilters(): void {
    this.loadAnalytics();
  }

  onPeriodChange(): void {
    if (!this.isCustomRange) {
      this.customStartDate = '';
      this.customEndDate = '';
    }
  }

  retry(): void {
    this.loadAnalytics();
  }

  private buildFilters() {
    return {
      period: this.isCustomRange ? null : this.selectedPeriod,
      start_date: this.isCustomRange ? this.customStartDate : null,
      end_date: this.isCustomRange ? this.customEndDate : null,
      department: this.departmentLocked ? null : this.selectedDepartment,
      category: this.selectedCategory,
    };
  }

  private renderCharts(): void {
    if (!this.viewReady || this.loading || this.error) {
      return;
    }

    this.destroyCharts();
    this.renderPolicyChart();
    this.renderEngagementChart();
    this.renderEligibilityChart();
  }

  private renderPolicyChart(): void {
    const canvas = this.policyChartRef?.nativeElement;
    const categories = this.policyStats?.by_category ?? [];
    const departments = this.policyStats?.by_department ?? [];
    if (!canvas || (!categories.length && !departments.length)) {
      return;
    }

    const labels = Array.from(new Set([...categories, ...departments].map((item) => item.label)));
    this.policyChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'By Category',
            data: labels.map((label) => categories.find((item) => item.label === label)?.count ?? 0),
            backgroundColor: '#2563eb',
            borderRadius: 4,
          },
          {
            label: 'By Department',
            data: labels.map((label) => departments.find((item) => item.label === label)?.count ?? 0),
            backgroundColor: '#14b8a6',
            borderRadius: 4,
          },
        ],
      },
      options: this.chartOptions('Policies'),
    });
  }

  private renderEngagementChart(): void {
    const canvas = this.engagementChartRef?.nativeElement;
    const timeline = this.engagement?.timeline ?? [];
    if (!canvas || !timeline.length) {
      return;
    }

    this.engagementChart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: timeline.map((item) => this.formatDateLabel(item.label)),
        datasets: [
          this.lineDataset('Searches', timeline.map((item) => item.searches), '#2563eb'),
          this.lineDataset('Views', timeline.map((item) => item.views), '#0f766e'),
          this.lineDataset('Saves', timeline.map((item) => item.saves), '#ca8a04'),
          this.lineDataset('Applications', timeline.map((item) => item.applications), '#dc2626'),
        ],
      },
      options: this.chartOptions('Engagement'),
    });
  }

  private renderEligibilityChart(): void {
    const canvas = this.eligibilityChartRef?.nativeElement;
    const ageGroups = this.eligibility?.age_groups?.filter((item) => item.count > 0) ?? [];
    if (!canvas || !ageGroups.length) {
      return;
    }

    this.eligibilityChart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ageGroups.map((item) => item.label),
        datasets: [
          {
            data: ageGroups.map((item) => item.count),
            backgroundColor: ['#2563eb', '#14b8a6', '#ca8a04', '#dc2626'],
            borderColor: '#ffffff',
            borderWidth: 3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 12,
              color: '#334155',
              font: { size: 12 },
            },
          },
        },
      },
    });
  }

  private chartOptions(title: string) {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom' as const,
          labels: {
            boxWidth: 12,
            color: '#334155',
            font: { size: 12 },
          },
        },
        tooltip: {
          mode: 'index' as const,
          intersect: false,
        },
        title: {
          display: false,
          text: title,
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#64748b' },
        },
        y: {
          beginAtZero: true,
          ticks: { color: '#64748b', precision: 0 },
          grid: { color: '#e2e8f0' },
        },
      },
    };
  }

  private lineDataset(label: string, data: number[], color: string) {
    return {
      label,
      data,
      borderColor: color,
      backgroundColor: `${color}22`,
      tension: 0.35,
      fill: false,
      pointRadius: 3,
      pointHoverRadius: 5,
    };
  }

  private destroyCharts(): void {
    this.policyChart?.destroy();
    this.engagementChart?.destroy();
    this.eligibilityChart?.destroy();
    this.policyChart = undefined;
    this.engagementChart = undefined;
    this.eligibilityChart = undefined;
  }

  private syncFilterOptions(): void {
    const departments = (this.policyStats?.by_department ?? [])
      .filter((item) => item.label !== 'Unspecified')
      .map((item) => ({ label: item.label, value: item.label }));
    const categories = (this.policyStats?.by_category ?? [])
      .filter((item) => item.label !== 'Unspecified')
      .map((item) => ({ label: item.label, value: item.label }));

    if (!this.departmentLocked) {
      this.departmentOptions = departments;
    }

    const mergedCategories = [...this.defaultCategories, ...categories];
    this.categoryOptions = mergedCategories.filter(
      (item, index, list) => list.findIndex((candidate) => candidate.value === item.value) === index,
    );
  }

  private getDepartmentFromToken(): string | null {
    const token = localStorage.getItem('access_token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.department_name ?? payload.department ?? null;
    } catch {
      return null;
    }
  }

  private formatDateLabel(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short' }).format(date);
  }

  private normalizeRole(role: string | null): string {
    if (!role) return 'guest';
    const normalized = role.toLowerCase().trim().replace(/[\s_-]+/g, '');
    switch (normalized) {
      case 'admin':
      case 'administrator':
        return 'admin';
      case 'official':
      case 'governmentofficial':
        return 'official';
      case 'researcher':
        return 'researcher';
      case 'organization':
      case 'organisation':
        return 'organization';
      default:
        return 'guest';
    }
  }

  isAdmin(): boolean {
    return this.currentRole === 'admin';
  }

  isOfficial(): boolean {
    return this.currentRole === 'official';
  }

  isResearcher(): boolean {
    return this.currentRole === 'researcher';
  }

  isOrganization(): boolean {
    return this.currentRole === 'organization';
  }
}
