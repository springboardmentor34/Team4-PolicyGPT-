import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {

  adminName: string = 'System Administrator';

  // Dashboard Cards
  totalUsers = 1250;
  totalPolicies = 320;
  totalReports = 78;
  auditLogs = 145;

  // User Management
  users = [
    {
      name: 'Rahul Sharma',
      role: 'Citizen',
      status: 'Active'
    },
    {
      name: 'Anjali Verma',
      role: 'Government Official',
      status: 'Active'
    },
    {
      name: 'Kiran Kumar',
      role: 'Researcher',
      status: 'Inactive'
    },
    {
      name: 'Admin User',
      role: 'Administrator',
      status: 'Active'
    }
  ];

  // Policy Management
  policies = [
    {
      title: 'Education Policy 2026',
      department: 'Education',
      status: 'Approved'
    },
    {
      title: 'Healthcare Scheme',
      department: 'Health',
      status: 'Pending'
    },
    {
      title: 'Farmer Welfare',
      department: 'Agriculture',
      status: 'Approved'
    }
  ];

  // Analytics
  analytics = [
    {
      category: 'Policy Downloads',
      value: 14560
    },
    {
      category: 'Scheme Applications',
      value: 9820
    },
    {
      category: 'New Registrations',
      value: 1320
    }
  ];

  // Reports
  reports = [
    {
      report: 'Monthly Policy Report',
      date: '31 Jul 2026'
    },
    {
      report: 'Citizen Activity Report',
      date: '30 Jul 2026'
    },
    {
      report: 'Department Performance',
      date: '28 Jul 2026'
    }
  ];

  // Audit Logs
  auditLogList = [
    {
      user: 'Admin',
      action: 'Approved Education Policy',
      time: '10:30 AM'
    },
    {
      user: 'Official',
      action: 'Updated Healthcare Scheme',
      time: '11:20 AM'
    },
    {
      user: 'Citizen',
      action: 'Submitted Feedback',
      time: '12:15 PM'
    }
  ];

}