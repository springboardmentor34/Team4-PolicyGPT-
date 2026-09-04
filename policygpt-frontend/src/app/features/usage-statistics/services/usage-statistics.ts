import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API_CONFIG } from '../../../core/config/api.config';

export interface TrendItem {
  label: string;
  searches: number;
  views: number;
  saves: number;
}

export interface UserActivityItem {
  role?: string;
  total: number;
}

export interface RecentSearch {
  query: string;
  count?: number;
  searchedAt: string;
}

export interface UsageData {
  searches: number;
  policyViews: number;
  savedPolicies: number;
  engagement: number;
  trend: TrendItem[];
  userActivity: UserActivityItem[];
  recentSearches: RecentSearch[];
}

@Injectable({
  providedIn: 'root'
})
export class UsageStatisticsService {

  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${API_CONFIG.BASE_URL}/usage-statistics`;

  getUsageStatistics(
    role: string,
    period: string = '6m',
    userType: string = 'all'
  ): Observable<UsageData> {

    const token = localStorage.getItem('access_token');
    let headers = new HttpHeaders();
    if (token) headers = headers.set('Authorization', `Bearer ${token}`);
    const params = new HttpParams().set('period', period).set('user_type', userType);
    return this.http.get<any>(this.apiUrl, { headers, params }).pipe(
      map(data => ({
        searches: data.searches ?? 0,
        policyViews: data.policy_views ?? 0,
        savedPolicies: data.saved_policies ?? 0,
        engagement: data.engagement ?? 0,
        trend: data.trend ?? [],
        userActivity: data.user_activity ?? [],
        recentSearches: data.recent_searches ?? [],
      }))
    );
  }
}
