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
  selector: 'app-add-policy',
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
  templateUrl: './add-policy.html',
  styleUrl: './add-policy.css'
})
export class AddPolicy {

  private policyService = inject(PolicyService);
  private router = inject(Router);

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
    'Infrastructure',
    'Water',
    'Food'
  ];

  departments = [
    'Education Department',
    'Agriculture Department',
    'Health Department',
    'IT Department',
    'Industry Department',
    'Skill Development Department',
    'Energy Department',
    'Housing Department',
    'Water Resources Department',
    'Food Department'
  ];

  ministries = [
    'Ministry of Education',
    'Ministry of Agriculture',
    'Ministry of Health',
    'Ministry of Electronics',
    'Ministry of Commerce',
    'Ministry of Skill Development',
    'Ministry of Renewable Energy',
    'Ministry of Housing',
    'Ministry of Jal Shakti'
  ];

  states = [
    'Telangana',
    'Andhra Pradesh',
    'Karnataka',
    'Tamil Nadu',
    'Maharashtra',
    'Delhi',
    'Rajasthan',
    'Gujarat',
    'Madhya Pradesh',
    'Punjab'
  ];

  sectors = [
    'Education',
    'Agriculture',
    'Healthcare',
    'Technology',
    'Business',
    'Employment',
    'Energy',
    'Housing',
    'Infrastructure',
    'Water',
    'Food'
  ];

  statuses = [
    'Draft',
    'Pending',
    'Approved'
  ];

  private isValid(): boolean {

    return !!(
      this.policy.policyName.trim() &&
      this.policy.schemeName.trim() &&
      this.policy.category &&
      this.policy.department &&
      this.policy.ministry &&
      this.policy.state &&
      this.policy.sector &&
      this.policy.publicationDate &&
      this.policy.status &&
      this.policy.description.trim()
    );

  }

  saveDraft(): void {

    if (!this.isValid()) {
      alert('Please complete all policy fields before saving the draft.');
      return;
    }

    const newPolicy = this.policyService.addPolicy({
      ...this.policy,
      status: 'Draft'
    });

    console.log('Draft Saved:', newPolicy);

    alert('Policy draft saved successfully.');

    this.router.navigate(['/policies', newPolicy.id]);
  }

  publishPolicy(): void {

    if (!this.isValid()) {
      alert('Please complete all policy fields before publishing.');
      return;
    }

    const newPolicy = this.policyService.addPolicy({
      ...this.policy,
      status: 'Pending'
    });

    console.log('Policy Published:', newPolicy);

    alert('Policy submitted successfully for approval.');

    this.router.navigate(['/policies', newPolicy.id]);
  }

}