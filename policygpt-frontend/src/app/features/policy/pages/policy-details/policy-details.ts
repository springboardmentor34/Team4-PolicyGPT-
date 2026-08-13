import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

import { Policy } from '../../models/policy.model';
import { PolicyService } from '../../../../core/services/policy.service';

@Component({
  selector: 'app-policy-details',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule
  ],
  templateUrl: './policy-details.html',
  styleUrl: './policy-details.css',
})
export class PolicyDetails implements OnInit {

  policy: Policy | null = null;

  benefits: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private policyService: PolicyService,
  private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.router.navigate(['/policies']);
      return;
    }

    this.policyService.getPolicyById(id).subscribe({
      next: (policy) => {
        this.policy = policy;
        this.generateBenefits();
        // Force Angular to update the view
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load policy details:', error);
        this.router.navigate(['/policies']);
      }
    });
  }

  private generateBenefits(): void {

    if (!this.policy) {
      return;
    }

    switch (this.policy.category) {

      case 'Education':
        this.benefits = [
          'Scholarship support for eligible students',
          'Digital classroom infrastructure funding',
          'Teacher training and institutional grants'
        ];
        break;

      case 'Agriculture':
        this.benefits = [
          'Financial assistance for eligible farmers',
          'Agricultural development support',
          'Access to government farming programs'
        ];
        break;

      case 'Health':
        this.benefits = [
          'Healthcare coverage for eligible families',
          'Access to supported medical services',
          'Financial assistance for healthcare needs'
        ];
        break;

      case 'Technology':
        this.benefits = [
          'Digital infrastructure development',
          'Improved access to online government services',
          'Support for digital transformation initiatives'
        ];
        break;

      case 'Business':
        this.benefits = [
          'Entrepreneurship and business support',
          'Funding and incubation opportunities',
          'Access to government startup programs'
        ];
        break;

      default:
        this.benefits = [
          'Government support for eligible beneficiaries',
          'Access to applicable public programs',
          'Support through government initiatives'
        ];
    }
  }

  goBack(): void {
    this.router.navigate(['/policies']);
  }
}