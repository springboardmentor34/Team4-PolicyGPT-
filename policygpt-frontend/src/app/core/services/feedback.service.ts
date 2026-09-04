import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

export type FeedbackCategory = 'bug' | 'suggestion' | 'complaint' | 'query';
export type FeedbackStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface Feedback {
  feedback_id: string;
  user_id: string;
  subject: string | null;
  category: FeedbackCategory;
  status: FeedbackStatus;
  response_text: string | null;
  resolved_by: string | null;
  resolved_at: string | null;
  created_at: string;
}

export interface FeedbackCreateRequest {
  subject: string;
  category: FeedbackCategory;
}

@Injectable({ providedIn: 'root' })
export class FeedbackService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${API_CONFIG.BASE_URL}/feedback`;

  private get options(): { headers: HttpHeaders } {
    const token = localStorage.getItem('access_token');
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return { headers };
  }

  createFeedback(request: FeedbackCreateRequest): Observable<Feedback> {
    return this.http.post<Feedback>(this.apiUrl, request, this.options);
  }

  getMyFeedback(): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(`${this.apiUrl}/my-feedback`, this.options);
  }

  getFeedbackForStaff(): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(`${this.apiUrl}/manage`, this.options);
  }

  updateStatus(feedbackId: string, status: FeedbackStatus): Observable<Feedback> {
    return this.http.patch<Feedback>(
      `${this.apiUrl}/${feedbackId}/status`,
      { status },
      this.options,
    );
  }

  getFeedback(feedbackId: string): Observable<Feedback> {
    return this.http.get<Feedback>(`${this.apiUrl}/${feedbackId}`, this.options);
  }
}