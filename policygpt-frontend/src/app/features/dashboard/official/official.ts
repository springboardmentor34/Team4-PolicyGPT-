import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-official',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './official.html',
  styleUrl: './official.css',
})
export class Official {

  officialName: string = 'Government Official';

  // Dashboard Statistics
  totalPolicies = 125;
  activeSchemes = 48;
  totalDepartments = 15;
  notifications = 26;

  // Policy Statistics
  policyStats = [
    { title: 'Approved Policies', count: 90 },
    { title: 'Pending Policies', count: 25 },
    { title: 'Rejected Policies', count: 10 }
  ];

  // Scheme Usage Analytics
  schemeUsage = [
    { scheme: 'PM Kisan', users: 12500 },
    { scheme: 'Ayushman Bharat', users: 9800 },
    { scheme: 'Skill India', users: 7600 },
    { scheme: 'PM Awas', users: 5400 }
  ];

  // User Activity
  userActivities = [
    {
      user: 'Ravi Kumar',
      activity: 'Applied for PM Kisan',
      date: '31 Jul 2026'
    },
    {
      user: 'Anjali',
      activity: 'Viewed Healthcare Policy',
      date: '31 Jul 2026'
    },
    {
      user: 'Suresh',
      activity: 'Downloaded Education Scheme',
      date: '30 Jul 2026'
    }
  ];

  // Department Reports
  departmentReports = [
    {
      department: 'Education',
      policies: 22,
      schemes: 10
    },
    {
      department: 'Healthcare',
      policies: 30,
      schemes: 15
    },
    {
      department: 'Agriculture',
      policies: 18,
      schemes: 8
    },
    {
      department: 'Finance',
      policies: 25,
      schemes: 12
    }
  ];

  // Notification Statistics
  notificationStats = [
    {
      type: 'Email',
      count: 250
    },
    {
      type: 'SMS',
      count: 180
    },
    {
      type: 'Push Notification',
      count: 320
    }
  ];

}