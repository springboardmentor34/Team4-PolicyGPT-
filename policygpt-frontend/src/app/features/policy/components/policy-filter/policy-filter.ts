import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { PolicyFilter as PolicyFilterModel } from '../../models/policy-filter.model';

@Component({
  selector: 'app-policy-filter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './policy-filter.html',
  styleUrl: './policy-filter.css'
})
export class PolicyFilterComponent {

  @Output()
  filterApplied = new EventEmitter<PolicyFilterModel>();

  @Output()
  filtersCleared = new EventEmitter<void>();

  filter: PolicyFilterModel = {
    policyName: '',
    schemeName: '',
    department: '',
    ministry: '',
    state: '',
    sector: '',
    publicationDate: '',
    status: ''
  };

  policyNames: string[] = [
  'National Education Policy 2026',
  'PM Kisan Support Policy',
  'Ayushman Bharat',
  'Digital India Mission',
  'Startup India',
  'Skill India Mission',
  'National Solar Mission',
  'PM Awas Yojana',
  'Jal Jeevan Mission',
  'National Food Security Mission'
];

schemeNames: string[] = [
  'Digital Learning Initiative',
  'Farmer Assistance Scheme',
  'Health Insurance',
  'Digital Services',
  'Startup Support',
  'Skill Development',
  'Solar Energy',
  'Housing Scheme',
  'Rural Water Supply',
  'Food Security'
];

  departments: string[] = [
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

  ministries: string[] = [
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

  states: string[] = [
    'Telangana',
    'Andhra Pradesh',
    'Karnataka',
    'Maharashtra',
    'Delhi',
    'Tamil Nadu',
    'Rajasthan',
    'Gujarat',
    'Madhya Pradesh',
    'Punjab'
  ];

  sectors: string[] = [
    'Education',
    'Agriculture',
    'Healthcare',
    'Technology',
    'Business',
    'Employment',
    'Energy',
    'Housing',
    'Infrastructure'
  ];

  statuses: string[] = [
    'Approved',
    'Pending',
    'Rejected'
  ];

  applyFilters(): void {
    this.filterApplied.emit({ ...this.filter });
  }

  clearFilters(): void {

    this.filter = {
      policyName: '',
      schemeName: '',
      department: '',
      ministry: '',
      state: '',
      sector: '',
      publicationDate: '',
      status: ''
    };

    this.filtersCleared.emit();

  }

}