import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Policy } from '../../features/policy/models/policy.model';

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
  private readonly apiUrl = 'http://127.0.0.1:8000/policies';

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
      .get<PolicyListResponse>(`${this.apiUrl}/`, { params })
      .pipe(map((res) => res.items.map((p) => this.mapPolicy(p))));
  }

  getPolicyById(id: string): Observable<Policy> {
    return this.http
      .get<any>(`${this.apiUrl}/${id}`)
      .pipe(map((p) => this.mapPolicy(p)));
  }

  addPolicy(policy: any): Observable<Policy> {
    const payload = {
      title: policy.title || policy.policyName || '',
      category: policy.category || null,
      department: policy.department || null,
      ministry: policy.ministry || null,
      state: policy.state || null,
      file_url: policy.file_url || policy.description || null,
      published_date:
        policy.published_date || policy.publicationDate || null,
    };
    return this.http
      .post<any>(`${this.apiUrl}/`, payload)
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
      .put<any>(`${this.apiUrl}/${id}`, payload)
      .pipe(map((p) => this.mapPolicy(p)));
  }

  deletePolicy(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  archivePolicy(id: string): Observable<Policy> {
    return this.http
      .patch<any>(`${this.apiUrl}/${id}/archive`, {})
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
      .patch<any>(`${this.apiUrl}/${id}/approval-status`, payload)
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