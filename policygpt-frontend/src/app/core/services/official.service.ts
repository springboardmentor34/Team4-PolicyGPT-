
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_CONFIG } from '../config/api.config';

export interface OfficialDashboardResponse {
  totalPolicies?: number;
  activeSchemes?: number;
  totalDepartments?: number;
  notifications?: number;

  approvedPolicies?: number;
  pendingPolicies?: number;
  rejectedPolicies?: number;

  schemeUsage?: any[];
  recentActivity?: any[];

  // Support alternative backend naming.
  total_policies?: number;
  active_schemes?: number;
  total_departments?: number;
  approved_policies?: number;
  pending_policies?: number;
  rejected_policies?: number;
  scheme_usage?: any[];
  recent_activity?: any[];
}

export interface DepartmentReport {
  departmentId: string;
  department: string;
  policies: number;
  schemes: number;
}

@Injectable({
  providedIn: 'root'
})
export class OfficialService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = API_CONFIG.BASE_URL;

  private get headers(): HttpHeaders {
    const token = localStorage.getItem('access_token');

    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set(
        'Authorization',
        `Bearer ${token}`
      );
    }

    return headers;
  }

  getDashboardStats(): Observable<OfficialDashboardResponse> {
    return this.http.get<OfficialDashboardResponse>(
      `${this.apiUrl}/official/dashboard`,
      {
        headers: this.headers
      }
    );
  }

  getDepartmentReports(): Observable<DepartmentReport[]> {
    return this.http.get<DepartmentReport[]>(
      `${this.apiUrl}/official/departments`,
      {
        headers: this.headers
      }
    );
  }

  getDepartmentActivity(
    departmentId: string
  ): Observable<any> {

    return this.http.get(
      `${this.apiUrl}/official/departments/${departmentId}/activity`,
      {
        headers: this.headers
      }
    );
  }
}
