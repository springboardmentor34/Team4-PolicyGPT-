import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-official',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './official.html',
  styleUrl: './official.css',
})
export class Official {

  private router = inject(Router);

  officialName = 'Government Official';

  totalPolicies = 125;
  activeSchemes = 48;
  totalDepartments = 15;
  notifications = 26;

  policyStats = [
    {
      title: 'Approved Policies',
      count: 90,
      icon: 'check_circle',
      route: '/policies'
    },
    {
      title: 'Pending Policies',
      count: 25,
      icon: 'pending',
      route: '/policies/approval'
    },
    {
      title: 'Rejected Policies',
      count: 10,
      icon: 'cancel',
      route: '/policies'
    }
  ];

  managementActions = [
    {
      title: 'Policy Repository',
      description: 'View, search and manage government policies.',
      icon: 'policy',
      route: '/policies',
      label: 'View Policies'
    },
    {
      title: 'Add Policy',
      description: 'Create and submit a new government policy.',
      icon: 'add_circle',
      route: '/policies/add',
      label: 'Add Policy'
    },
    {
      title: 'Policy Approval',
      description: 'Review and process pending policy submissions.',
      icon: 'fact_check',
      route: '/policies/approval',
      label: 'Review Policies'
    },
    {
      title: 'Policy Comparison',
      description: 'Compare multiple policies side by side.',
      icon: 'compare_arrows',
      route: '/policies/comparison',
      label: 'Compare Policies'
    },
    {
      title: 'Scheme Management',
      description: 'View, search and manage government schemes.',
      icon: 'account_balance',
      route: '/schemes',
      label: 'Manage Schemes'
    },
    {
      title: 'Create Scheme',
      description: 'Add a new government scheme to the repository.',
      icon: 'add_business',
      route: '/schemes/create',
      label: 'Create Scheme'
    },
    {
      title: 'Eligibility Checker',
      description: 'Check scheme eligibility and matching results.',
      icon: 'verified',
      route: '/eligibility',
      label: 'Open Checker'
    }
  ];

  schemeUsage = [
    {
      scheme: 'PM Kisan',
      users: 12500
    },
    {
      scheme: 'Ayushman Bharat',
      users: 9800
    },
    {
      scheme: 'Skill India',
      users: 7600
    },
    {
      scheme: 'PM Awas',
      users: 5400
    }
  ];

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

  recentActivity = [
    {
      title: 'Policy submitted for approval',
      description: 'A new policy is waiting for administrative review.',
      time: 'Today',
      icon: 'pending'
    },
    {
      title: 'Scheme information updated',
      description: 'Government scheme details were recently updated.',
      time: 'Today',
      icon: 'update'
    },
    {
      title: 'Policy repository updated',
      description: 'New policy documents are available in the repository.',
      time: 'Yesterday',
      icon: 'library_books'
    }
  ];

  navigate(route: string): void {
    this.router.navigateByUrl(route);
  }
}