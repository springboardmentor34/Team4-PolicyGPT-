import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UsageEventService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://127.0.0.1:8000/usage-statistics/events';

  record(eventType: string, policyId?: string): void {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.post(this.apiUrl, {
      event_type: eventType,
      policy_id: policyId,
    }, { headers }).subscribe({ error: () => undefined });
  }
}