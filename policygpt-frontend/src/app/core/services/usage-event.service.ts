import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_CONFIG } from '../config/api.config';

@Injectable({ providedIn: 'root' })
export class UsageEventService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${API_CONFIG.BASE_URL}/usage-statistics/events`;

  record(eventType: string, policyId?: string): void {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.post(this.apiUrl, {
      event_type: eventType,
      policy_id: policyId,
    }, { headers }).subscribe({ error: () => undefined });
  }

  trackSearch(queryText: string, filters: any): void {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    // Only track if there's actually a query or active filters
    if (!queryText && Object.values(filters).every(v => !v)) return;

    this.http.post(`${API_CONFIG.BASE_URL}/usage-statistics/track/search`, {
      query_text: queryText,
      filters_json: filters
    }, { headers }).subscribe({ error: () => undefined });
  }

  trackPolicyView(policyId: string): void {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.post(`${API_CONFIG.BASE_URL}/usage-statistics/track/view`, {
      policy_id: policyId
    }, { headers }).subscribe({ error: () => undefined });
  }

  trackPolicySave(policyId: string): void {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.post(`${API_CONFIG.BASE_URL}/usage-statistics/track/save`, {
      policy_id: policyId
    }, { headers }).subscribe({ error: () => undefined });
  }
}