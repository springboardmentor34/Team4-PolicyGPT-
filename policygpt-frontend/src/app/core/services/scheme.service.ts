import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Scheme {
  scheme_id: string;
  name: string;
  category?: string;
  department?: string;
  state?: string;
  benefits?: string;
  application_start_date?: string;
  application_end_date?: string;
  status: 'draft' | 'active' | 'inactive' | 'expired';
  created_by?: string;
  created_at: string;
}

export interface SchemeCreateRequest {
  name: string;
  category?: string;
  department?: string;
  state?: string;
  benefits?: string;
  application_start_date?: string;
  application_end_date?: string;
}

export interface SchemeSearchParams {
  keyword?: string;
  department?: string;
  state?: string;
  category?: string;
  status?: string;
}

export interface SchemeListResponse {
  items: Scheme[];
  total: number;
  skip: number;
  limit: number;
}

@Injectable({
  providedIn: 'root',
})
export class SchemeService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    'http://127.0.0.1:8000/schemes';

  getSchemes(
  skip: number = 0,
  limit: number = 100
): Observable<SchemeListResponse> {
  const params = new HttpParams()
    .set('skip', skip)
    .set('limit', limit);

  return this.http.get<SchemeListResponse>(
    `${this.apiUrl}/`,
    { params }
  );
}

  searchSchemes(
    filters: SchemeSearchParams,
    skip: number = 0,
    limit: number = 100
  ): Observable<SchemeListResponse> {
    let params = new HttpParams()
      .set('skip', skip)
      .set('limit', limit);

    if (filters.keyword?.trim()) {
      params = params.set('keyword', filters.keyword.trim());
    }

    if (filters.department?.trim()) {
      params = params.set(
        'department',
        filters.department.trim()
      );
    }

    if (filters.state?.trim()) {
      params = params.set(
        'state',
        filters.state.trim()
      );
    }

    if (filters.category?.trim()) {
      params = params.set(
        'category',
        filters.category.trim()
      );
    }

    if (filters.status) {
      params = params.set('status', filters.status);
    }

    return this.http.get<SchemeListResponse>(
      `${this.apiUrl}/search`,
      { params }
    );
  }

  createScheme(
    scheme: SchemeCreateRequest
  ): Observable<Scheme> {
    return this.http.post<Scheme>(
      `${this.apiUrl}/`,
      scheme
    );
  }
}