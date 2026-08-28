import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_CONFIG } from '../config/api.config';

export interface AnalyticsFilters {
  start_date?: string | null;
  end_date?: string | null;
  period?: string | null;
  department?: string | null;
  category?: string | null;
}

export interface AnalyticsBreakdownItem {
  label: string;
  count: number;
}

export interface AnalyticsTimelinePoint {
  label: string;
  searches: number;
  views: number;
  saves: number;
  applications: number;
  feedback: number;
}

export interface AnalyticsSummaryResponse {
  total_policies: number;
  active_schemes: number;
  users: number | null;
  total_engagement: number;
  feedback: number;
  applications: number;
}

export interface PolicyStatsResponse {
  by_category: AnalyticsBreakdownItem[];
  by_status: AnalyticsBreakdownItem[];
  by_department: AnalyticsBreakdownItem[];
  trends: AnalyticsBreakdownItem[];
}

export interface EngagementSummaryResponse {
  views: number;
  saves: number;
  searches: number;
  applications: number;
  feedback: number;
  total_engagement: number;
  timeline: AnalyticsTimelinePoint[];
}

export interface EligibilityStatsResponse {
  age_groups: AnalyticsBreakdownItem[];
  gender_distribution: AnalyticsBreakdownItem[];
  social_categories: AnalyticsBreakdownItem[];
  disability: AnalyticsBreakdownItem[];
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${API_CONFIG.BASE_URL}/analytics`;

  getSummary(filters: AnalyticsFilters): Observable<AnalyticsSummaryResponse> {
    return this.http.get<AnalyticsSummaryResponse>(`${this.apiUrl}/summary`, this.options(filters));
  }

  getPolicyStats(filters: AnalyticsFilters): Observable<PolicyStatsResponse> {
    return this.http.get<PolicyStatsResponse>(`${this.apiUrl}/policy-stats`, this.options(filters));
  }

  getEngagementSummary(filters: AnalyticsFilters): Observable<EngagementSummaryResponse> {
    return this.http.get<EngagementSummaryResponse>(
      `${this.apiUrl}/engagement-summary`,
      this.options(filters),
    );
  }

  getEligibilityStats(filters: AnalyticsFilters): Observable<EligibilityStatsResponse> {
    return this.http.get<EligibilityStatsResponse>(
      `${this.apiUrl}/eligibility-stats`,
      this.options(filters),
    );
  }

  private options(filters: AnalyticsFilters): { headers: HttpHeaders; params: HttpParams } {
    const token = localStorage.getItem('access_token');
    let headers = new HttpHeaders();
    let params = new HttpParams();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value);
      }
    });

    return { headers, params };
  }
}
