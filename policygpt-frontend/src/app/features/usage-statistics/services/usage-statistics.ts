import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

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

  getUsageStatistics(
    role: string,
    period: string = '6m',
    userType: string = 'all'
  ): Observable<UsageData> {

    const data = this.getRoleBasedData(
      role,
      period,
      userType
    );

    return of(data);
  }

  private getRoleBasedData(
    role: string,
    period: string,
    userType: string
  ): UsageData {

    // =====================================
    // ADMIN
    // Full platform analytics
    // =====================================

    if (role === 'admin') {

      let data: UsageData = {
        searches: 1284,
        policyViews: 3426,
        savedPolicies: 486,
        engagement: 5196,

        trend: [
          { label: 'Jan', searches: 120, views: 280, saves: 42 },
          { label: 'Feb', searches: 180, views: 410, saves: 58 },
          { label: 'Mar', searches: 165, views: 360, saves: 51 },
          { label: 'Apr', searches: 240, views: 520, saves: 76 },
          { label: 'May', searches: 285, views: 640, saves: 94 },
          { label: 'Jun', searches: 294, views: 716, saves: 105 }
        ],

        userActivity: [
          { role: 'Citizens', total: 742 },
          { role: 'Officials', total: 184 },
          { role: 'Researchers', total: 126 },
          { role: 'Organizations', total: 84 }
        ],

        recentSearches: [
          {
            query: 'PM Kisan scheme',
            count: 84,
            searchedAt: 'Today, 10:42 AM'
          },
          {
            query: 'Healthcare policies',
            count: 61,
            searchedAt: 'Today, 09:18 AM'
          },
          {
            query: 'Women empowerment schemes',
            count: 47,
            searchedAt: 'Yesterday, 04:32 PM'
          },
          {
            query: 'Education policy 2026',
            count: 39,
            searchedAt: 'Yesterday, 11:06 AM'
          }
        ]
      };

      data = this.applyUserTypeFilter(data, userType);

      return this.applyPeriodFilter(data, period);
    }

    // =====================================
    // GOVERNMENT OFFICIAL
    // Department usage
    // =====================================

    if (role === 'official') {

      const data: UsageData = {
        searches: 384,
        policyViews: 972,
        savedPolicies: 146,
        engagement: 1502,

        trend: [
          { label: 'Jan', searches: 38, views: 112, saves: 15 },
          { label: 'Feb', searches: 51, views: 148, saves: 21 },
          { label: 'Mar', searches: 47, views: 139, saves: 19 },
          { label: 'Apr', searches: 63, views: 171, saves: 27 },
          { label: 'May', searches: 84, views: 194, saves: 31 },
          { label: 'Jun', searches: 101, views: 208, saves: 33 }
        ],

        userActivity: [
          { role: 'Department Officials', total: 94 },
          { role: 'Department Staff', total: 67 },
          { role: 'Citizens', total: 42 }
        ],

        recentSearches: [
          {
            query: 'Department welfare schemes',
            count: 31,
            searchedAt: 'Today, 10:10 AM'
          },
          {
            query: 'State education policy',
            count: 24,
            searchedAt: 'Today, 09:05 AM'
          },
          {
            query: 'Healthcare benefits',
            count: 18,
            searchedAt: 'Yesterday, 03:40 PM'
          }
        ]
      };

      return this.applyPeriodFilter(data, period);
    }

    // =====================================
    // CITIZEN
    // Personal usage only
    // =====================================

    if (role === 'citizen') {

      const data: UsageData = {
        searches: 46,
        policyViews: 128,
        savedPolicies: 14,
        engagement: 188,

        trend: [
          { label: 'Jan', searches: 5, views: 14, saves: 2 },
          { label: 'Feb', searches: 7, views: 18, saves: 2 },
          { label: 'Mar', searches: 6, views: 21, saves: 3 },
          { label: 'Apr', searches: 8, views: 24, saves: 2 },
          { label: 'May', searches: 9, views: 26, saves: 3 },
          { label: 'Jun', searches: 11, views: 25, saves: 2 }
        ],

        userActivity: [],

        recentSearches: [
          {
            query: 'PM Kisan scheme',
            count: 4,
            searchedAt: 'Today, 10:42 AM'
          },
          {
            query: 'Ayushman Bharat',
            count: 3,
            searchedAt: 'Yesterday, 04:20 PM'
          },
          {
            query: 'Education scholarship',
            count: 2,
            searchedAt: 'Yesterday, 11:15 AM'
          }
        ]
      };

      return this.applyPeriodFilter(data, period);
    }

    // =====================================
    // RESEARCHER
    // Read-only trend analytics
    // =====================================

    if (role === 'researcher') {

      const data: UsageData = {
        searches: 0,
        policyViews: 0,
        savedPolicies: 0,
        engagement: 0,

        trend: [
          { label: 'Jan', searches: 120, views: 280, saves: 42 },
          { label: 'Feb', searches: 180, views: 410, saves: 58 },
          { label: 'Mar', searches: 165, views: 360, saves: 51 },
          { label: 'Apr', searches: 240, views: 520, saves: 76 },
          { label: 'May', searches: 285, views: 640, saves: 94 },
          { label: 'Jun', searches: 294, views: 716, saves: 105 }
        ],

        userActivity: [],

        recentSearches: []
      };

      return this.applyPeriodFilter(data, period);
    }

    // =====================================
    // ORGANIZATION
    // Organization-level metrics
    // =====================================

    if (role === 'organization') {

      const data: UsageData = {
        searches: 218,
        policyViews: 624,
        savedPolicies: 72,
        engagement: 914,

        trend: [
          { label: 'Jan', searches: 21, views: 82, saves: 8 },
          { label: 'Feb', searches: 29, views: 91, saves: 11 },
          { label: 'Mar', searches: 32, views: 98, saves: 10 },
          { label: 'Apr', searches: 38, views: 106, saves: 13 },
          { label: 'May', searches: 45, views: 117, saves: 14 },
          { label: 'Jun', searches: 53, views: 130, saves: 16 }
        ],

        userActivity: [],

        recentSearches: [
          {
            query: 'Skill development schemes',
            count: 18,
            searchedAt: 'Today, 09:50 AM'
          },
          {
            query: 'Business subsidy policies',
            count: 14,
            searchedAt: 'Yesterday, 02:30 PM'
          },
          {
            query: 'MSME schemes',
            count: 12,
            searchedAt: 'Yesterday, 11:40 AM'
          }
        ]
      };

      return this.applyPeriodFilter(data, period);
    }

    // =====================================
    // GUEST / UNKNOWN
    // =====================================

    return {
      searches: 0,
      policyViews: 0,
      savedPolicies: 0,
      engagement: 0,
      trend: [],
      userActivity: [],
      recentSearches: []
    };
  }

  // =====================================
  // USER TYPE FILTER
  // =====================================

  private applyUserTypeFilter(
    data: UsageData,
    userType: string
  ): UsageData {

    if (!userType || userType === 'all' || userType === 'All Users') {
      return data;
    }

    const multiplierMap: Record<string, number> = {
      Citizen: 0.58,
      'Government Official': 0.18,
      Researcher: 0.14,
      Organization: 0.10
    };

    const multiplier = multiplierMap[userType];

    if (!multiplier) {
      return data;
    }

    return {
      ...data,

      searches: Math.round(data.searches * multiplier),
      policyViews: Math.round(data.policyViews * multiplier),
      savedPolicies: Math.round(data.savedPolicies * multiplier),

      engagement: Math.round(
        (data.searches +
          data.policyViews +
          data.savedPolicies) *
        multiplier
      ),

      trend: data.trend.map(item => ({
        ...item,
        searches: Math.round(item.searches * multiplier),
        views: Math.round(item.views * multiplier),
        saves: Math.round(item.saves * multiplier)
      })),

      userActivity: data.userActivity.map(item => ({
        ...item,
        total: Math.round(item.total * multiplier)
      }))
    };
  }

  // =====================================
  // PERIOD FILTER
  // =====================================

  private applyPeriodFilter(
    data: UsageData,
    period: string
  ): UsageData {

    const multiplierMap: Record<string, number> = {
      '7d': 0.08,
      '30d': 0.18,
      '3m': 0.50,
      '6m': 1,
      '1y': 1.80
    };

    const multiplier = multiplierMap[period] ?? 1;

    return {
      ...data,

      searches: Math.round(data.searches * multiplier),

      policyViews: Math.round(
        data.policyViews * multiplier
      ),

      savedPolicies: Math.round(
        data.savedPolicies * multiplier
      ),

      engagement: Math.round(
        (
          data.searches +
          data.policyViews +
          data.savedPolicies
        ) * multiplier
      ),

      trend: this.getTrendForPeriod(
        data.trend,
        period
      )
    };
  }

  private getTrendForPeriod(
    trend: TrendItem[],
    period: string
  ): TrendItem[] {

    if (!trend.length) {
      return [];
    }

    switch (period) {

      case '7d':
        return trend.slice(-1);

      case '30d':
        return trend.slice(-2);

      case '3m':
        return trend.slice(-3);

      case '6m':
        return trend.slice(-6);

      case '1y':
        return trend;

      default:
        return trend;
    }
  }
}