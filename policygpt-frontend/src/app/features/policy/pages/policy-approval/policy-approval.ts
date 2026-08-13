import { CommonModule } from '@angular/common';
import { Component, OnInit,ChangeDetectorRef, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { PolicyService } from '../../../../core/services/policy.service';
import { Policy } from '../../models/policy.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-policy-approval',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './policy-approval.html',
  styleUrl: './policy-approval.css'
})
export class PolicyApproval implements OnInit {
  private readonly policyService = inject(PolicyService);
  private readonly router = inject(Router);
  //to rerender on change detected
  private readonly cdr = inject(ChangeDetectorRef);

  policies: Policy[] = [];

  ngOnInit(): void {
    this.loadPolicies();
  }

  loadPolicies(): void {
    this.policyService.getPolicies(0, 100).subscribe({
      next: (data) => {
        this.policies = data.map(p => {
          const capitalizedStatus = p.status.charAt(0).toUpperCase() + p.status.slice(1);
          return {
            ...p,
            status: (capitalizedStatus === 'Archived' ? 'Rejected' : capitalizedStatus) as any
          };
        });
      // Force Angular to update the template
      this.cdr.detectChanges();

      },
      error: (error) => {
        console.error('Failed to load policies for approval', error);
      }
    });
  }

  get pendingCount(): number {
    return this.policies.filter(
      policy => policy.status === 'Pending' || policy.status === 'pending'
    ).length;
  }

  get approvedCount(): number {
    return this.policies.filter(
      policy => policy.status === 'Approved' || policy.status === 'approved'
    ).length;
  }

  get rejectedCount(): number {
    return this.policies.filter(
      policy => policy.status === 'Rejected' || policy.status === 'rejected' || policy.status === 'archived'
    ).length;
  }

  approve(policy: Policy): void {
    if (!policy.id) return;
    this.policyService.updateApprovalStatus(policy.id.toString(), 'approved').subscribe({
      next: (updatedPolicy) => {
        policy.status = 'Approved';
        console.log('Approved:', updatedPolicy);
        // Force UI update
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to approve policy', err)
    });
  }

  reject(policy: Policy): void {
    if (!policy.id) return;
    this.policyService.updateApprovalStatus(policy.id.toString(), 'archived').subscribe({
      next: (updatedPolicy) => {
        policy.status = 'Rejected';
        console.log('Rejected (Archived):', updatedPolicy);
        // Force UI update
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to reject policy', err)
    });
  }

  view(policy: Policy): void {
    if (policy.id) {
      this.router.navigate(['/policies', policy.id]);
    }
  }
}