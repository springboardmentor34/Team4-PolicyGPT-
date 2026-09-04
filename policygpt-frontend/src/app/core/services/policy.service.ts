import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Policy } from '../../features/policy/models/policy.model';
import { API_CONFIG } from '../config/api.config';

export interface PolicyListResponse {
  items: Policy[];
  total: number;
  skip: number;
  limit: number;
}

@Injectable({
  providedIn: 'root',
})
export class PolicyService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${API_CONFIG.BASE_URL}/policies`;

  private get options(): { headers: HttpHeaders } {
    const token = localStorage.getItem('access_token');
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return { headers };
  }

  private mapPolicy(p: any): Policy {
    return {
      ...p,
      id: p.policy_id,
      policyName: p.title,
      schemeName: p.title,
      description: p.file_url || p.title,
      publicationDate: p.published_date || '',
      sector: p.category || '',
    };
  }
  //converts javascript Date to Python Date
  private formatDate(date: Date | string | null): string | null {
  if (!date) {
    return null;
  }

  if (typeof date === 'string') {
    return date.substring(0, 10);
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

  getPolicies(
    skip: number = 0,
    limit: number = 100,
    status?: string
  ): Observable<Policy[]> {
    let params = new HttpParams()
      .set('skip', skip)
      .set('limit', limit);
    if (status) {
      params = params.set('status', status.toLowerCase());
    }
    return this.http
      .get<PolicyListResponse>(`${this.apiUrl}/`, { ...this.options, params })
      .pipe(map((res) => res.items.map((p) => this.mapPolicy(p))));
  }

  getPolicyById(id: string): Observable<Policy> {
    return this.http
      .get<any>(`${this.apiUrl}/${id}`, this.options)
      .pipe(map((p) => this.mapPolicy(p)));
  }

  addPolicy(policy: any): Observable<Policy> {
    const payload = {
      title: policy.title || policy.policyName || '',
      category: policy.category || null,
      department: policy.department || null,
      ministry: policy.ministry || null,
      state: policy.state || null,
      file_url: policy.fileUrl || null,
description: policy.description || null,
      published_date: this.formatDate(
  policy.published_date || policy.publicationDate || null
),
    };
    return this.http
      .post<any>(`${this.apiUrl}/`, payload, this.options)
      .pipe(map((p) => this.mapPolicy(p)));
  }

  updatePolicy(id: string, policy: any): Observable<Policy> {
    const payload = {
      title: policy.title || policy.policyName || undefined,
      category: policy.category || undefined,
      department: policy.department || undefined,
      ministry: policy.ministry || undefined,
      state: policy.state || undefined,
      file_url: policy.file_url || policy.description || undefined,
      published_date:
        policy.published_date || policy.publicationDate || undefined,
    };
    return this.http
      .put<any>(`${this.apiUrl}/${id}`, payload, this.options)
      .pipe(map((p) => this.mapPolicy(p)));
  }

  deletePolicy(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.options);
  }

  archivePolicy(id: string): Observable<Policy> {
    return this.http
      .patch<any>(`${this.apiUrl}/${id}/archive`, {}, this.options)
      .pipe(map((p) => this.mapPolicy(p)));
  }

  updateApprovalStatus(
    id: string,
    status: string,
    approvedBy?: string
  ): Observable<Policy> {
    const payload = {
      status: status.toLowerCase(),
      approved_by: approvedBy || null,
    };
    return this.http
      .patch<any>(`${this.apiUrl}/${id}/approval-status`, payload, this.options)
      .pipe(map((p) => this.mapPolicy(p)));
  }

  searchPolicies(keyword: string): Observable<Policy[]> {
    return this.getPolicies(0, 1000).pipe(
      map((policies) => {
        if (!keyword.trim()) return policies;
        const searchText = keyword.toLowerCase();
        return policies.filter(
          (policy) =>
            (policy.policyName || '')
              .toLowerCase()
              .includes(searchText) ||
            (policy.department || '')
              .toLowerCase()
              .includes(searchText) ||
            (policy.ministry || '')
              .toLowerCase()
              .includes(searchText) ||
            (policy.state || '').toLowerCase().includes(searchText) ||
            (policy.category || '').toLowerCase().includes(searchText)
        );
      })
    );
  }
}