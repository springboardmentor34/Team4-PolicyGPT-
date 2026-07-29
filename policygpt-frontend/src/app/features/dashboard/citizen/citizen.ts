import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { Router } from '@angular/router';
import { inject } from '@angular/core';


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
  
  navigate(route: string) {
    this.router.navigate([route]);
  }
  quickActions = [
  {
    title: 'Browse Policies',
    icon: 'policy',
    description: 'Explore government schemes.',
    route: '/policies'
  },
  {
    title: 'Eligibility Checker',
    icon: 'fact_check',
    description: 'Check your eligibility.',
    route: '/eligibility'
  },
  {
    title: 'My Applications',
    icon: 'description',
    description: 'Track your applications.',
    route: '/applications'
  },
  {
    title: 'Saved Policies',
    icon: 'bookmark',
    description: 'View bookmarked policies.',
    route: '/saved-policies'
  }
];

  userName = 'Akshat';

recommendedPolicies = [
  {
    title: 'PM Kisan Samman Nidhi',
    category: 'Agriculture'
  },
  {
    title: 'Ayushman Bharat',
    category: 'Healthcare'
  },
  {
    title: 'PM Awas Yojana',
    category: 'Housing'
  }
];

}