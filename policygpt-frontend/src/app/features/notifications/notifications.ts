import { Component, OnInit, inject } from '@angular/core';
import {
  Notification as ApiNotification,
  NotificationService,
} from '../../core/services/notification.service';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'Policy' | 'Scheme' | 'Deadline' | 'Application';
  date: string;
  time: string;
  read: boolean;
  priority: 'High' | 'Medium' | 'Low';
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css'
})
export class Notifications {
  private readonly notificationService = inject(NotificationService);

  activeFilter = 'All';

  emailEnabled = true;
  smsEnabled = false;
  inAppEnabled = true;

  notifications: NotificationItem[] = [];

  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.notificationService.getNotifications().subscribe({
      next: response => {
        this.notifications = response.items.map(notification =>
          this.toNotificationItem(notification),
        );
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load notifications.';
        this.isLoading = false;
      },
    });
  }

  private toNotificationItem(notification: ApiNotification): NotificationItem {
    const createdAt = new Date(notification.created_at);

    return {
      id: notification.notification_id,
      title: notification.title,
      message: notification.title,
      type: this.mapType(notification.type),
      date: createdAt.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      time: createdAt.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      read: notification.is_read,
      priority: notification.type === 'alert' || notification.type === 'reminder'
        ? 'High'
        : notification.type === 'approval'
          ? 'Medium'
          : 'Low',
    };
  }

  private mapType(type: ApiNotification['type']): NotificationItem['type'] {
    switch (type) {
      case 'alert':
        return 'Policy';
      case 'reminder':
        return 'Deadline';
      case 'approval':
        return 'Application';
      default:
        return 'Scheme';
    }
  }

  get filteredNotifications(): NotificationItem[] {

    if (this.activeFilter === 'All') {
      return this.notifications;
    }

    if (this.activeFilter === 'Unread') {
      return this.notifications.filter(
        notification => !notification.read
      );
    }

    return this.notifications.filter(
      notification => notification.type === this.activeFilter
    );
  }

  get unreadCount(): number {
    return this.notifications.filter(
      notification => !notification.read
    ).length;
  }

  setFilter(filter: string): void {
    this.activeFilter = filter;
  }

  markAsRead(notification: NotificationItem): void {
    this.notificationService.markAsRead(notification.id).subscribe({
      next: () => notification.read = true,
      error: () => this.errorMessage = 'Unable to mark notification as read.',
    });
  }

  markAllAsRead(): void {

    this.notifications
      .filter(notification => !notification.read)
      .forEach(notification => this.markAsRead(notification));
  }

  deleteNotification(id: string): void {
    this.notificationService.deleteNotification(id).subscribe({
      next: () => {
        this.notifications = this.notifications.filter(
          notification => notification.id !== id,
        );
      },
      error: () => this.errorMessage = 'Unable to delete notification.',
    });
  }

  toggleEmail(): void {
    this.emailEnabled = !this.emailEnabled;
  }

  toggleSms(): void {
    this.smsEnabled = !this.smsEnabled;
  }

  toggleInApp(): void {
    this.inAppEnabled = !this.inAppEnabled;
  }
}