import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject
} from '@angular/core';
import { Router } from '@angular/router';

import { Auth } from '../../../core/services/auth';
import {
  Scheme,
  SchemeService
} from '../../../core/services/scheme.service';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-citizen',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './citizen.html',
  styleUrl: './citizen.css'
})
export class Citizen implements OnInit {

  private readonly router = inject(Router);
  private readonly auth = inject(Auth);
  private readonly schemeService = inject(SchemeService);
  private readonly cdr = inject(ChangeDetectorRef);

  userName = 'Citizen';

  schemes: Scheme[] = [];
  loadingSchemes = false;

  quickActions = [
    {
      title: 'Browse Policies',
      icon: 'policy',
      description: 'Explore government policies and their details.',
      route: '/policies'
    },
    {
      title: 'Browse Schemes',
      icon: 'account_balance',
      description: 'Discover government schemes and benefits.',
      route: '/schemes'
    },
    {
      title: 'Eligibility Checker',
      icon: 'fact_check',
      description: 'Find government schemes you may be eligible for.',
      route: '/eligibility'
    },
    {
      title: 'Notifications',
      icon: 'notifications',
      description: 'View important updates and notifications.',
      route: '/notifications'
    },
    {
      title: 'Give Feedback',
      icon: 'feedback',
      description: 'Share your feedback about the citizen portal.',
      route: '/feedback'
    }
  ];

  ngOnInit(): void {
    this.userName =
      this.auth.getFirstNameFromToken() ?? 'Citizen';

    this.loadSchemes();
  }

  loadSchemes(): void {
    this.loadingSchemes = true;

    this.schemeService
      .searchSchemes(
        {
          status: 'active'
        },
        0,
        6
      )
      .subscribe({
        next: (response) => {
          this.schemes = response.items ?? [];
          this.loadingSchemes = false;

          this.cdr.detectChanges();
        },

        error: (error) => {
          console.error(
            'Failed to load government schemes:',
            error
          );

          this.schemes = [];
          this.loadingSchemes = false;

          this.cdr.detectChanges();
        }
      });
  }

  navigate(route: string): void {
    if (!route) {
      return;
    }

    this.router.navigateByUrl(route);
  }

  /*
   * There is currently no /schemes/:schemeId route
   * in scheme.routes.ts.
   *
   * Therefore View Details opens the scheme repository
   * instead of navigating to a non-existent page.
   */
  viewScheme(): void {
    this.navigate('/schemes');
  }

  getSchemeIcon(category: string | null): string {
    const normalizedCategory =
      category?.toLowerCase().trim();

    switch (normalizedCategory) {
      case 'agriculture':
        return 'agriculture';

      case 'health':
      case 'healthcare':
        return 'health_and_safety';

      case 'education':
        return 'school';

      case 'housing':
        return 'home';

      case 'employment':
        return 'work';

      case 'finance':
      case 'financial':
        return 'payments';

      case 'social welfare':
      case 'social':
        return 'groups';

      case 'women':
      case 'women empowerment':
        return 'female';

      case 'technology':
      case 'digital':
        return 'computer';

      default:
        return 'account_balance';
    }
  }
}