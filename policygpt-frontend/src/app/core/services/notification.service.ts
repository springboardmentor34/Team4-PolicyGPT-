import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export type NotificationType = 'info' | 'alert' | 'reminder' | 'approval';
export type NotificationChannel = 'in_app' | 'email' | 'sms';

export interface Notification {
  notification_id: string;
  user_id: string;
  title: string;
  type: NotificationType;
  channel: NotificationChannel;
  is_read: boolean;
  created_at: string;
}

export interface NotificationListResponse {
  items: Notification[];
  total: number;
  unread_count: number;
}

export interface NotificationCreateRequest {
  title: string;
  type: NotificationType;
  channel?: NotificationChannel;
  user_id?: string;
  role?: string;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8000/notifications';

  private get options(): { headers: HttpHeaders } {
    const token = localStorage.getItem('access_token');
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return { headers };
  }

  getNotifications(
    skip: number = 0,
    limit: number = 100,
    unreadOnly: boolean = false,
  ): Observable<NotificationListResponse> {
    const params = new HttpParams()
      .set('skip', skip)
      .set('limit', limit)
      .set('unread_only', unreadOnly);

    return this.http.get<NotificationListResponse>(`${this.apiUrl}/`, {
      ...this.options,
      params,
    });
  }

  getUnreadCount(): Observable<{ unread_count: number }> {
    return this.http.get<{ unread_count: number }>(
      `${this.apiUrl}/unread-count`,
      this.options,
    );
  }

  createNotification(
    notification: NotificationCreateRequest,
  ): Observable<Notification[]> {
    return this.http.post<Notification[]>(
      `${this.apiUrl}/`,
      notification,
      this.options,
    );
  }

  markAsRead(notificationId: string): Observable<Notification> {
    return this.http.patch<Notification>(
      `${this.apiUrl}/${notificationId}/read`,
      {},
      this.options,
    );
  }

  updateNotification(
    notificationId: string,
    changes: Partial<Pick<Notification, 'title' | 'type' | 'channel' | 'is_read'>>,
  ): Observable<Notification> {
    return this.http.put<Notification>(
      `${this.apiUrl}/${notificationId}`,
      changes,
      this.options,
    );
  }

  deleteNotification(notificationId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${notificationId}`,
      this.options,
    );
  }
}