import { Component } from '@angular/core';

interface NotificationItem {
  id: number;
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

  activeFilter = 'All';

  emailEnabled = true;
  smsEnabled = false;
  inAppEnabled = true;

  notifications: NotificationItem[] = [

    {
      id: 1,
      title: 'New Policy Alert',
      message:
        'A new government policy related to public welfare has been published.',
      type: 'Policy',
      date: '16 Aug 2026',
      time: '09:45 AM',
      read: false,
      priority: 'High'
    },

    {
      id: 2,
      title: 'Scheme Updated',
      message:
        'Eligibility criteria and benefits for PM Scholarship Scheme have been updated.',
      type: 'Scheme',
      date: '16 Aug 2026',
      time: '08:30 AM',
      read: false,
      priority: 'Medium'
    },

    {
      id: 3,
      title: 'Deadline Reminder',
      message:
        'The application deadline for the Student Support Scheme is approaching.',
      type: 'Deadline',
      date: '15 Aug 2026',
      time: '06:15 PM',
      read: false,
      priority: 'High'
    },

    {
      id: 4,
      title: 'Application Status Updated',
      message:
        'Your application has moved to the verification stage.',
      type: 'Application',
      date: '15 Aug 2026',
      time: '02:20 PM',
      read: true,
      priority: 'Medium'
    },

    {
      id: 5,
      title: 'New Policy Available',
      message:
        'A new education policy is now available in the PolicyGPT database.',
      type: 'Policy',
      date: '14 Aug 2026',
      time: '11:10 AM',
      read: true,
      priority: 'Low'
    },

    {
      id: 6,
      title: 'Scheme Update Notification',
      message:
        'New benefits have been added to an eligible government scheme.',
      type: 'Scheme',
      date: '13 Aug 2026',
      time: '04:45 PM',
      read: true,
      priority: 'Low'
    }

  ];

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
    notification.read = true;
  }

  markAllAsRead(): void {

    this.notifications.forEach(notification => {
      notification.read = true;
    });
  }

  deleteNotification(id: number): void {

    this.notifications =
      this.notifications.filter(
        notification => notification.id !== id
      );
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