import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-organization',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './organization.html',
  styleUrl: './organization.css',
})
export class Organization {

  constructor(private router: Router) {}

  // =====================================================
  // SIDEBAR NAVIGATION
  // =====================================================

  openOverview(): void {
    this.router.navigate(['/dashboard/organization']);
  }

  openPolicies(): void {
    this.router.navigate(['/policies']);
  }

  openSchemes(): void {
    this.router.navigate(['/schemes']);
  }

  openEligibility(): void {
    this.router.navigate(['/eligibility']);
  }

  openPolicyComparison(): void {
    this.router.navigate(['/policies/comparison']);
  }

  // =====================================================
  // ORGANIZATION SECTION
  // =====================================================

  openOrganizationProfile(): void {
    // Keep this available without breaking the dashboard.
    // Add the actual route later when the module is implemented.
    console.log('Organization Profile clicked');
  }

  openSavedPolicies(): void {
    console.log('Saved Policies clicked');
  }

  openRecentActivity(): void {
    console.log('Recent Activity clicked');
  }

  // =====================================================
  // INSIGHTS
  // =====================================================

  openPolicyTrends(): void {
    console.log('Policy Trends clicked');
  }

  openReports(): void {
    console.log('Reports clicked');
  }

  // =====================================================
  // POLICY SECTORS
  // =====================================================

  openSector(sector: string): void {
    this.router.navigate(['/policies'], {
      queryParams: {
        sector: sector
      }
    });
  }

  // =====================================================
  // COMMON ACTIONS
  // =====================================================

  viewAllActivity(): void {
    this.router.navigate(['/policies']);
  }

  exploreRepository(): void {
    this.router.navigate(['/policies']);
  }

  openNotifications(): void {
    console.log('Notifications clicked');
  }

  openProfileMenu(): void {
    console.log('Profile menu clicked');
  }
}