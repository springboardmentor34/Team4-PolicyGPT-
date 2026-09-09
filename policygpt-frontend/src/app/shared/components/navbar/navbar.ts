import { Component, OnInit } from '@angular/core';

import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';

import { filter } from 'rxjs';

import { Auth } from '../../../core/services/auth';

interface NavItem {
  label: string;
  route: string;
  icon?: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  constructor(
    private router: Router,
    private auth: Auth,
  ) {}

  ngOnInit(): void {
    // Refresh navbar after login/logout/navigation
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      // Trigger change detection by updating state
      this.updateAuthState();
    });

    this.updateAuthState();
  }

  // ==========================================
  // AUTHENTICATION
  // ==========================================

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token')

  }

  private updateAuthState(): void {
    // Accessing the getter is enough for Angular
    // to reevaluate the navbar after navigation.
    this.auth.getRoleFromToken();
  }

  // ==========================================
  // ROLE
  // ==========================================

  get normalizedRole(): string {
    if (!this.isLoggedIn) {
      return 'guest';
    }

    const role = this.auth.getRoleFromToken()?.toLowerCase().trim();

    switch (role) {
      case 'admin':
      case 'administrator':
        return 'admin';

      case 'official':
      case 'officer':
      case 'government_official':
      case 'government official':
        return 'official';

      case 'researcher':
        return 'researcher';

      case 'organization':
        return 'organization';

      case 'citizen':
        return 'citizen';

      default:
        return 'guest';
    }
  }

  // ==========================================
  // DISPLAY ROLE
  // ==========================================

  get role(): string {
    switch (this.normalizedRole) {
      case 'admin':
        return 'Administrator';

      case 'official':
        return 'Government Official';

      case 'researcher':
        return 'Researcher';

      case 'organization':
        return 'Organization';

      case 'citizen':
        return 'Citizen';

      default:
        return 'Guest';
    }
  }

  // ==========================================
  // DASHBOARD
  // ==========================================

  get dashboardRoute(): string {
    if (!this.isLoggedIn) {
      return '/';
    }

    switch (this.normalizedRole) {
      case 'admin':
        return '/admin';

      case 'official':
        return '/official';

      case 'researcher':
        return '/researcher';

      case 'citizen':
        return '/citizen';

      case 'organization':
        return '/organization';

      default:
        return '/';
    }
  }

  // ==========================================
  // NAVIGATION
  // ==========================================

  get navItems(): NavItem[] {
    // -------------------------------
    // GUEST
    // -------------------------------

    if (!this.isLoggedIn) {
      return [
        {
          label: 'Home',
          route: '/',
        },
        {
          label: 'Policies',
          route: '/policies',
        },
        {
          label: 'Schemes',
          route: '/schemes',
        },
      ];
    }

    // -------------------------------
    // ADMIN
    // -------------------------------

    switch (this.normalizedRole) {
      case 'admin':
        return [
          {
            label: 'Dashboard',
            route: '/admin',
          },
          {
            label: 'Policies',
            route: '/policies',
          },
          
          {
            label: 'Schemes',
            route: '/schemes',
          },
          {
            label: 'Eligibility',
            route: '/eligibility',
          },
          {
            label: 'Feedback & Support',
            route: '/feedback',
          },
      
          {
            label: 'Reports',
            route: '/reports',
          },
          {
            label: 'Analytics Dashboard',
            route: '/analytics',
          },
          {
            label: 'Department Analytics',
            route: '/department-analytics',
          },
          {
            label: 'Usage Statistics',
            route: '/usage-statistics',
          },
        ];

      // -------------------------------
      // OFFICIAL
      // -------------------------------

      case 'official':
        return [
          {
            label: 'Dashboard',
            route: '/official',
          },
          {
            label: 'Policies',
            route: '/policies',
          },
          {
            label: 'Schemes',
            route: '/schemes',
          },
          {
            label: 'Eligibility',
            route: '/eligibility',
          },
          {
            label: 'Feedback & Support',
            route: '/feedback',
          },
          {
            label: 'Notifications',
            route: '/notifications',
          },
          {
            label: 'Reports',
            route: '/reports',
          },
          {
            label: 'Analytics Dashboard',
            route: '/analytics',
          },
          {
            label: 'Departments',
            route: '/departments',
          },
          {
            label: 'Department Analytics',
            route: '/department-analytics',
          },
          {
            label: 'Usage Statistics',
            route: '/usage-statistics',
          },
        ];

      // -------------------------------
      // RESEARCHER
      // -------------------------------

      case 'researcher':
        return [
          {
            label: 'Dashboard',
            route: '/researcher',
          },
          {
            label: 'Policies',
            route: '/policies',
          },
          {
            label: 'Schemes',
            route: '/schemes',
          },
          {
            label: 'Feedback & Support',
            route: '/feedback',
          },
          {
            label: 'Notifications',
            route: '/notifications',
          },
          {
            label: 'Reports',
            route: '/reports',
          },
          {
            label: 'Analytics Dashboard',
            route: '/analytics',
          },
          {
            label: 'Department Analytics',
            route: '/department-analytics',
          },
          {
            label: 'Usage Statistics',
            route: '/usage-statistics',
          },
        ];

      // -------------------------------
      // CITIZEN
      // -------------------------------

      case 'citizen':
        return [
          {
            label: 'Dashboard',
            route: '/citizen',
          },
          {
            label: 'Policies',
            route: '/policies',
          },
          {
            label: 'Schemes',
            route: '/schemes',
          },
          {
            label: 'Eligibility',
            route: '/eligibility',
          },
          {
            label: 'Feedback & Support',
            route: '/feedback',
          },
          {
            label: 'Notifications',
            route: '/notifications',
          },
        ];

      // -------------------------------
      // ORGANIZATION
      // -------------------------------

      case 'organization':
        return [
          {
            label: 'Dashboard',
            route: '/organization',
          },
          {
            label: 'Policies',
            route: '/policies',
          },
          {
            label: 'Schemes',
            route: '/schemes',
          },
          {
            label: 'Reports',
            route: '/reports',
          },
          {
            label: 'Analytics Dashboard',
            route: '/analytics',
          },
          {
            label: 'Feedback & Support',
            route: '/feedback',
          },
          {
            label: 'Notifications',
            route: '/notifications',
          },
        ];

      default:
        return [
          {
            label: 'Home',
            route: '/',
          },
          {
            label: 'Policies',
            route: '/policies',
          },
          {
            label: 'Schemes',
            route: '/schemes',
          },
        ];
    }
  }

  // ==========================================
  // LOGOUT
  // ==========================================

  logout(): void {
    localStorage.removeItem('access_token');

    this.router.navigate(['/']);
  }
}
