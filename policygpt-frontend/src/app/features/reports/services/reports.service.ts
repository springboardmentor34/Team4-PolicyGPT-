import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ApiReport {
  report_id: string;
  report_type: string;
  format: 'pdf' | 'csv' | 'xlsx';
  created_at: string;
  data: Array<Record<string, unknown>>;
}

@Injectable({ providedIn: 'root' })
export class ReportsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://127.0.0.1:8000/reports';

  private get options(): { headers: HttpHeaders } {
    const token = localStorage.getItem('access_token');
    let headers = new HttpHeaders();
    if (token) headers = headers.set('Authorization', `Bearer ${token}`);
    return { headers };
  }

  list(): Observable<ApiReport[]> {
    return this.http.get<ApiReport[]>(this.apiUrl, this.options);
  }

  create(reportType: string, format: 'pdf' | 'csv' | 'xlsx'): Observable<ApiReport> {
    return this.http.post<ApiReport>(this.apiUrl, {
      report_type: reportType,
      format,
    }, this.options);
  }

  preview(reportType: string): Observable<{ report_type: string; data: Array<Record<string, unknown>> }> {
    return this.http.get<{ report_type: string; data: Array<Record<string, unknown>> }>(
      `${this.apiUrl}/preview`,
      { ...this.options, params: { report_type: reportType } },
    );
  }
}
