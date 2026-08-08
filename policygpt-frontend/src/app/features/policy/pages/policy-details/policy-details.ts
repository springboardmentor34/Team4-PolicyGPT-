import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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

  policy: Policy | undefined;

  benefits: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private policyService: PolicyService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.policyService.getPolicies().subscribe({
      next: (policies) => {
        this.policy = policies.find(policy => policy.id === id);

        if (!this.policy) {
          console.error('Policy not found:', id);
          this.router.navigate(['/policies']);
          return;
        }

        this.generateBenefits();
      },
      error: (error) => {
        console.error('Failed to load policy details:', error);
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