import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AdminDashboardResponse {
  adminName: string;
  totalUsers: number;
  totalPolicies: number;
  totalReports: number;
  auditLogs: number;
  userGrowth: string;
  policyGrowth: string;
  reportStatus: string;
  auditStatus: string;
  users: Array<{ name: string; role: string; status: string }>;
  policies: Array<{ title: string; department: string; status: string }>;
  analytics: Array<{ category: string; value: number; icon: string }>;
  reports: Array<{ report: string; date: string }>;
  auditLogList: Array<{ user: string; action: string; time: string; type: string }>;
}

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://127.0.0.1:8000/admin';

  getDashboard(): Observable<AdminDashboardResponse> {
    const token = localStorage.getItem('access_token');
    let headers = new HttpHeaders();
    if (token) headers = headers.set('Authorization', `Bearer ${token}`);
    return this.http.get<AdminDashboardResponse>(`${this.apiUrl}/dashboard`, { headers });
  }
}
