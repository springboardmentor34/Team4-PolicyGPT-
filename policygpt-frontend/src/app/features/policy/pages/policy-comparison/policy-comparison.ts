import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

import { PolicyService } from '../../../../core/services/policy.service';
import { Policy } from '../../models/policy.model';

@Component({
  selector: 'app-policy-comparison',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
  ],
  templateUrl: './policy-comparison.html',
  styleUrl: './policy-comparison.css',
})
export class PolicyComparison implements OnInit {
  policies: Policy[] = [];

  selectedPolicyIds: number[] = [];

  comparisonPolicies: Policy[] = [];

  constructor(private policyService: PolicyService) {}

  ngOnInit(): void {
    this.loadPolicies();
  }

  loadPolicies(): void {
    this.policyService.getPolicies().subscribe({
      next: (data) => {
        this.policies = data;
      },
      error: (error) => {
        console.error('Failed to load policies', error);
      },
    });
  }

  comparePolicies(): void {
    this.comparisonPolicies = this.policies.filter((policy) =>
      this.selectedPolicyIds.includes(policy.id)
    );
  }

  removePolicy(policyId: number): void {
    this.selectedPolicyIds = this.selectedPolicyIds.filter(
      (id) => id !== policyId
    );

    this.comparisonPolicies = this.comparisonPolicies.filter(
      (policy) => policy.id !== policyId
    );
  }

  clearComparison(): void {
    this.selectedPolicyIds = [];
    this.comparisonPolicies = [];
  }

  isSelected(policyId: number): boolean {
    return this.selectedPolicyIds.includes(policyId);
  }

  canSelectMore(): boolean {
    return this.selectedPolicyIds.length < 3;
  }

  get canCompare(): boolean {
    return this.selectedPolicyIds.length >= 2;
  }

  get hasComparison(): boolean {
    return this.comparisonPolicies.length >= 2;
  }

  get selectionCount(): number {
    return this.selectedPolicyIds.length;
  }
}