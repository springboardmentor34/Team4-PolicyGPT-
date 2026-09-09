import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit {
  private readonly adminService = inject(AdminService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  adminName: string = 'System Administrator';
  today = new Date();

  totalUsers = 0;
  totalPolicies = 0;
  totalReports = 0;
  auditLogs = 0;

  userGrowth = '+0.0%';
  policyGrowth = '+0.0%';
  reportStatus = 'No reports';
  auditStatus = 'No activity';

  users = [{ name: 'No users in database', role: 'Citizen', status: 'Inactive' }];

  policies = [{ title: 'No policy records yet', department: 'General', status: 'Pending' }];

  analytics = [{ category: 'Registered Users', value: 0, icon: 'person_add' }];

  reports = [{ report: 'No reports generated', date: 'N/A' }];

  auditLogList = [{ user: 'System', action: 'No audit events yet', time: 'N/A', type: 'admin' }];

  ngOnInit(): void {
    this.loadDashboard();

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        if (event.urlAfterRedirects === '/admin') {
          this.loadDashboard();
        }
      });
  }

  private loadDashboard(): void {
    this.adminService.getDashboard().subscribe({
      next: (data) => {
        this.adminName = data.adminName || this.adminName;

        this.totalUsers = data.totalUsers ?? this.totalUsers;
        this.totalPolicies = data.totalPolicies ?? this.totalPolicies;
        this.totalReports = data.totalReports ?? this.totalReports;
        this.auditLogs = data.auditLogs ?? this.auditLogs;

        this.userGrowth = data.userGrowth || this.userGrowth;
        this.policyGrowth = data.policyGrowth || this.policyGrowth;
        this.reportStatus = data.reportStatus || this.reportStatus;
        this.auditStatus = data.auditStatus || this.auditStatus;

        this.users = data.users?.length ? data.users : this.users;
        this.policies = data.policies?.length ? data.policies : this.policies;
        this.analytics = data.analytics?.length ? data.analytics : this.analytics;
        this.reports = data.reports?.length ? data.reports : this.reports;
        this.auditLogList = data.auditLogList?.length ? data.auditLogList : this.auditLogList;

        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error('Failed to load admin dashboard data', err);
      },
    });
  }

  getInitials(name: string): string {
    if (!name) {
      return 'NA';
    }

    return name
      .split(' ')
      .map((part) => part.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  getStatusClass(status: string): string {
    return (status || 'pending').toLowerCase().replace(/\s+/g, '-');
  }

  getRoleClass(role: string): string {
    return (role || 'citizen').toLowerCase().replace(/\s+/g, '-');
  }

  getAuditClass(type: string): string {
    return (type || 'admin').toLowerCase();
  }
   // =====================================================
  // NAVIGATION
  // =====================================================

  openNotifications(): void {
    this.router.navigate(['/notifications']);
  }

  openPolicies(): void {
    this.router.navigate(['/policies']);
  }

  openReports(): void {
    this.router.navigate(['/reports']);
  }

  openAnalytics(): void {
    this.router.navigate(['/analytics']);
  }

  openUsageStatistics(): void {
    this.router.navigate(['/usage-statistics']);
  }

  openDepartments(): void {
    this.router.navigate(['/departments']);
  }
}
