import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class OfficialService {

  private http = inject(HttpClient);

  private apiUrl = API_CONFIG.BASE_URL;

  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/official/dashboard`);
  }

  getDepartmentReports(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/official/departments`
    );
  }

  getDepartmentActivity(departmentId: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/official/departments/${departmentId}/activity`
    );
  }
}