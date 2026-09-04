import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../core/config/api.config';

export interface DepartmentAnalyticsRow {
  department: string;
  policies: number;
  active_policies: number;
  schemes: number;
  active_schemes: number;
}

@Injectable({ providedIn: 'root' })
export class DepartmentAnalyticsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${API_CONFIG.BASE_URL}/analytics/departments`;

  getRows(): Observable<{ items: DepartmentAnalyticsRow[] }> {
    const token = localStorage.getItem('access_token');
    let headers = new HttpHeaders();
    if (token) headers = headers.set('Authorization', `Bearer ${token}`);
    return this.http.get<{ items: DepartmentAnalyticsRow[] }>(this.apiUrl, { headers });
  }
}
