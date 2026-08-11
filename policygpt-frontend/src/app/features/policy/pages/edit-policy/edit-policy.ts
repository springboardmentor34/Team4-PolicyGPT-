import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-edit-policy',
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
  templateUrl: './edit-policy.html',
  styleUrl: './edit-policy.css'
})
export class EditPolicy {

  // Mock existing policy (later this will come from backend using :id)

  policy = {
    policyName: 'National Education Policy 2026',
    schemeName: 'Digital Learning Initiative',
    category: 'Education',
    department: 'Education Department',
    ministry: 'Ministry of Education',
    state: 'Telangana',
    sector: 'Education',
    publicationDate: '2026-07-31',
    status: 'Approved',
    description:
      'Improves access to quality education through digital infrastructure, scholarships, and teacher training.'
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

  updatePolicy(): void {

    console.log('Policy Updated');

    console.log(this.policy);

  }

  cancel(): void {

    console.log('Edit Cancelled');

  }

}