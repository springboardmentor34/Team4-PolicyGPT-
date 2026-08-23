import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import {
  UsageStatisticsService,
  UsageData,
  TrendItem,
  UserActivityItem,
  RecentSearch
} from '../../services/usage-statistics';

import { Auth } from '../../../../core/services/auth';

@Component({
  selector: 'app-usage-statistics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usage-statistics.html',
  styleUrl: './usage-statistics.css',
})
export class UsageStatistics implements OnInit {

  loading = false;
  error = '';

  selectedPeriod = '6m';
  selectedUserType = 'all';

  displayedSearches = 0;
  displayedPolicyViews = 0;
  displayedSavedPolicies = 0;
  totalEngagement = 0;

  trendPeriodLabel = 'Last 6 months';

  trendData: TrendItem[] = [];
  userActivity: UserActivityItem[] = [];
  recentSearches: RecentSearch[] = [];

  maxTrendValue = 0;
  halfTrendValue = 0;
  maxUserActivity = 0;

  private currentRole = 'guest';

  constructor(
    private usageService: UsageStatisticsService,
    private auth: Auth
  ) {}

  ngOnInit(): void {
    this.currentRole = this.normalizeRole(
      this.auth.getRoleFromToken()
    );

    if (this.currentRole === 'guest') {
      this.error = 'You do not have access to Usage Statistics.';
      return;
    }

    this.loadUsageStatistics();
  }

  // =========================
  // ROLE HELPERS
  // =========================

  isAdmin(): boolean {
    return this.currentRole === 'admin';
  }

  isOfficial(): boolean {
    return this.currentRole === 'official';
  }

  isCitizen(): boolean {
    return this.currentRole === 'citizen';
  }

  isResearcher(): boolean {
    return this.currentRole === 'researcher';
  }

  isOrganization(): boolean {
    return this.currentRole === 'organization';
  }

  showPlatformKpis(): boolean {
    return this.isAdmin();
  }

  showUserActivity(): boolean {
    return this.isAdmin() || this.isOfficial();
  }

  showRecentSearches(): boolean {
    return this.isAdmin() || this.isOfficial() || this.isOrganization();
  }

  // =========================
  // LOAD DATA
  // =========================

  loadUsageStatistics(): void {
    if (this.currentRole === 'guest') {
      return;
    }

    this.loading = true;
    this.error = '';

    this.usageService
      .getUsageStatistics(
        this.currentRole,
        this.selectedPeriod,
        this.selectedUserType
      )
      .subscribe({
        next: (data: UsageData) => {

          this.displayedSearches = data.searches;
          this.displayedPolicyViews = data.policyViews;
          this.displayedSavedPolicies = data.savedPolicies;
          this.totalEngagement = data.engagement;

          this.trendData = data.trend ?? [];
          this.userActivity = data.userActivity ?? [];
          this.recentSearches = data.recentSearches ?? [];

          this.calculateTrendValues();
          this.calculateUserActivity();

          this.loading = false;
        },

        error: () => {
          this.error = 'Unable to load usage statistics.';
          this.loading = false;
        }
      });
  }

  refresh(): void {
    this.loadUsageStatistics();
  }

  // =========================
  // PERIOD FILTER
  // =========================

  onPeriodChange(event: Event): void {
    const select = event.target as HTMLSelectElement;

    this.selectedPeriod = select.value;

    switch (this.selectedPeriod) {

      case '7d':
        this.trendPeriodLabel = 'Last 7 days';
        break;

      case '30d':
        this.trendPeriodLabel = 'Last 30 days';
        break;

      case '3m':
        this.trendPeriodLabel = 'Last 3 months';
        break;

      case '6m':
        this.trendPeriodLabel = 'Last 6 months';
        break;

      case '1y':
        this.trendPeriodLabel = 'Last year';
        break;

      default:
        this.selectedPeriod = '6m';
        this.trendPeriodLabel = 'Last 6 months';
    }

    this.loadUsageStatistics();
  }

  // =========================
  // USER TYPE FILTER
  // =========================

  onUserTypeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;

    this.selectedUserType = select.value;

    this.loadUsageStatistics();
  }

  // =========================
  // CHART CALCULATIONS
  // =========================

  private calculateTrendValues(): void {

    if (!this.trendData.length) {
      this.maxTrendValue = 0;
      this.halfTrendValue = 0;
      return;
    }

    const values = this.trendData.flatMap(item => [
      item.searches,
      item.views,
      item.saves
    ]);

    this.maxTrendValue = Math.max(...values);

    this.halfTrendValue = Math.round(
      this.maxTrendValue / 2
    );
  }

  private calculateUserActivity(): void {

    if (!this.userActivity.length) {
      this.maxUserActivity = 0;
      return;
    }

    this.maxUserActivity = Math.max(
      ...this.userActivity.map(item => item.total)
    );
  }

  // =========================
  // ROLE NORMALIZATION
  // =========================

  private normalizeRole(role: string | null): string {

    if (!role) {
      return 'guest';
    }

    const normalized = role
      .toLowerCase()
      .trim()
      .replace(/[\s_-]+/g, '');

    switch (normalized) {

      case 'admin':
      case 'administrator':
        return 'admin';

      case 'official':
      case 'governmentofficial':
        return 'official';

      case 'citizen':
      case 'publicuser':
      case 'user':
        return 'citizen';

      case 'researcher':
        return 'researcher';

      case 'organization':
      case 'organisation':
        return 'organization';

      case 'guest':
        return 'guest';

      default:
        return 'guest';
    }
  }
}