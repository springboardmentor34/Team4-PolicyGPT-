import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-citizen',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './citizen.html',
  styleUrl: './citizen.css'
})
export class Citizen {

  private router = inject(Router);

  userName = 'Akshat';

  searchQuery = '';

  quickActions = [
    {
      title: 'Browse Policies',
      icon: 'policy',
      description: 'Explore government policies and schemes.',
      route: '/policies'
    },
    {
      title: 'Eligibility Checker',
      icon: 'fact_check',
      description: 'Find schemes you may be eligible for.',
      route: '/eligibility'
    },
    {
      title: 'My Applications',
      icon: 'description',
      description: 'Track your submitted applications.',
      route: '/applications'
    },
    {
      title: 'Saved Policies',
      icon: 'bookmark',
      description: 'Access policies you saved for later.',
      route: '/saved-policies'
    }
  ];

  dashboardStats = [
    {
      label: 'Saved Policies',
      value: 6,
      icon: 'bookmark',
      route: '/saved-policies'
    },
    {
      label: 'Applications',
      value: 3,
      icon: 'description',
      route: '/applications'
    },
    {
      label: 'Eligible Schemes',
      value: 8,
      icon: 'verified',
      route: '/eligibility'
    }
  ];

  recommendedPolicies = [
    {
      title: 'PM Kisan Samman Nidhi',
      category: 'Agriculture',
      description: 'Financial support scheme for eligible farmers.',
      icon: 'agriculture'
    },
    {
      title: 'Ayushman Bharat',
      category: 'Healthcare',
      description: 'Health coverage support for eligible families.',
      icon: 'health_and_safety'
    },
    {
      title: 'PM Awas Yojana',
      category: 'Housing',
      description: 'Housing assistance for eligible beneficiaries.',
      icon: 'home'
    }
  ];

  recentUpdates = [
    {
      title: 'New policy documents available',
      description: 'Explore recently published government policies.',
      icon: 'campaign'
    },
    {
      title: 'Check your eligibility',
      description: 'Use the eligibility checker to discover suitable schemes.',
      icon: 'fact_check'
    }
  ];

  navigate(route: string): void {
    this.router.navigate([route]);
  }

  searchPolicies(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/policies'], {
        queryParams: {
          search: this.searchQuery.trim()
        }
      });
    } else {
      this.router.navigate(['/policies']);
    }
  }
}