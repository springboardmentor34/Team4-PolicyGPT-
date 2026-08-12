import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { PolicyService } from '../../../../core/services/policy.service';

@Component({
  selector: 'app-policy-upload',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './policy-upload.html',
  styleUrl: './policy-upload.css'
})
export class PolicyUpload {
  private readonly policyService = inject(PolicyService);
  private readonly router = inject(Router);

  policy = {
    policyName: '',
    schemeName: '',
    category: '',
    department: '',
    ministry: '',
    state: '',
    sector: '',
    publicationDate: '',
    status: '',
    description: ''
  };

  categories = [
    'Education',
    'Agriculture',
    'Health',
    'Technology',
    'Business',
    'Employment',
    'Energy',
    'Housing',
    'Infrastructure'
  ];

  departments = [
    'Education Department',
    'Agriculture Department',
    'Health Department',
    'IT Department',
    'Industry Department',
    'Skill Development Department',
    'Energy Department',
    'Housing Department'
  ];

  ministries = [
    'Ministry of Education',
    'Ministry of Agriculture',
    'Ministry of Health',
    'Ministry of Electronics',
    'Ministry of Commerce'
  ];

  states = [
    'Telangana',
    'Andhra Pradesh',
    'Karnataka',
    'Tamil Nadu',
    'Maharashtra',
    'Delhi'
  ];

  sectors = [
    'Education',
    'Agriculture',
    'Healthcare',
    'Technology',
    'Business',
    'Employment',
    'Energy',
    'Housing'
  ];

  statuses = [
    'Draft',
    'Pending',
    'Approved'
  ];

  saveDraft(): void {
    this.policyService.addPolicy({
      ...this.policy,
      status: 'pending'
    }).subscribe({
      next: (newPolicy) => {
        console.log('Draft Saved:', newPolicy);
        alert('Policy draft saved successfully.');
        this.router.navigate(['/policies', newPolicy.id]);
      },
      error: (err) => {
        console.error('Failed to save policy draft:', err);
        alert('Failed to save draft.');
      }
    });
  }

  publishPolicy(): void {
    this.policyService.addPolicy({
      ...this.policy,
      status: 'pending'
    }).subscribe({
      next: (newPolicy) => {
        console.log('Policy Published:', newPolicy);
        alert('Policy submitted successfully for approval.');
        this.router.navigate(['/policies', newPolicy.id]);
      },
      error: (err) => {
        console.error('Failed to publish policy:', err);
        alert('Failed to submit policy for approval.');
      }
    });
  }
}