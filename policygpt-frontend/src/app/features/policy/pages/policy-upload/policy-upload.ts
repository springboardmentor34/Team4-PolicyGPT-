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
    console.log('Draft Saved');
    console.log(this.policy);
  }

  publishPolicy(): void {
    console.log('Policy Published');
    console.log(this.policy);
  }

}