import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../../core/services/auth';

interface NavItem {
  label: string;
  route: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  constructor(
    private router: Router,
    private auth: Auth
  ) {}

  // Get the actual role from JWT and normalize it
  get normalizedRole(): string {
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

      case 'guest_user':
      case 'guest user':
      case 'guest':
        return 'guest';

      case 'citizen':
        return 'citizen';

      default:
        console.warn('Unknown role:', role);
        return 'guest';
    }
  }

  // Display the actual role nicely
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

      case 'guest':
      default:
        return 'Guest User';
    }
  }

  // Dashboard according to role
  get dashboardRoute(): string {

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
        return '/official';

      case 'guest':
      default:
        return '/citizen';
    }
  }

  // Role-based navigation
  get navItems(): NavItem[] {

    switch (this.normalizedRole) {

      // =========================
      // ADMIN
      // =========================
      case 'admin':
        return [
          {
            label: 'Dashboard',
            route: '/admin'
          },
          {
            label: 'Policies',
            route: '/policies'
          },
          {
            label: 'Schemes',
            route: '/schemes'
          },
          {
            label: 'Eligibility',
            route: '/eligibility'
          },
          {
  label: 'Feedback & Support',
  route: '/feedback'
}
        ];


      // =========================
      // GOVERNMENT OFFICIAL
      // =========================
      case 'official':
        return [
          {
            label: 'Dashboard',
            route: '/official'
          },
          {
            label: 'Policies',
            route: '/policies'
          },
          {
            label: 'Schemes',
            route: '/schemes'
          },
          {
            label: 'Eligibility',
            route: '/eligibility'
          },
          {
  label: 'Feedback & Support',
  route: '/feedback'
}
        ];


      // =========================
      // RESEARCHER
      // =========================
      case 'researcher':
        return [
          {
            label: 'Dashboard',
            route: '/researcher'
          },
          {
            label: 'Policies',
            route: '/policies'
          },
          {
            label: 'Schemes',
            route: '/schemes'
          },
          {
  label: 'Feedback & Support',
  route: '/feedback'
}
        ];


      // =========================
      // CITIZEN
      // =========================
      case 'citizen':
        return [
          {
            label: 'Dashboard',
            route: '/citizen'
          },
          {
            label: 'Policies',
            route: '/policies'
          },
          {
            label: 'Schemes',
            route: '/schemes'
          },
          {
            label: 'Eligibility',
            route: '/eligibility'
          },
          {
  label: 'Feedback & Support',
  route: '/feedback'
}
        ];


      // =========================
      // ORGANIZATION
      // =========================
      case 'organization':
        return [
          {
            label: 'Dashboard',
            route: '/official'
          },
          {
            label: 'Policies',
            route: '/policies'
          },
          {
            label: 'Schemes',
            route: '/schemes'
          },
          {
  label: 'Feedback & Support',
  route: '/feedback'
}
        ];


      // =========================
      // GUEST
      // =========================
      case 'guest':
      default:
        return [
          {
            label: 'Policies',
            route: '/policies'
          },
          {
            label: 'Schemes',
            route: '/schemes'
          },
          {
  label: 'Feedback & Support',
  route: '/feedback'
}
        ];
    }
  }

  logout(): void {
    localStorage.removeItem('access_token');
    this.router.navigate(['/']);
  }
}