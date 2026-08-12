import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { PolicyService } from '../../../../core/services/policy.service';
import { Policy } from '../../models/policy.model';

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
    MatIconModule,
  ],
  templateUrl: './edit-policy.html',
  styleUrl: './edit-policy.css',
})
export class EditPolicy implements OnInit {
  private readonly policyService = inject(PolicyService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  policyId = '';

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
    description: '',
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
  ];

  ministries = [
    'Ministry of Education',
    'Ministry of Agriculture',
    'Ministry of Health',
    'Ministry of Electronics',
    'Ministry of Commerce',
  ];

  states = [
    'Telangana',
    'Andhra Pradesh',
    'Karnataka',
    'Tamil Nadu',
    'Maharashtra',
    'Delhi',
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
  ];

  statuses = ['Draft', 'Pending', 'Approved'];

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.policyId = idParam;
      this.loadPolicy();
    }
  }

  loadPolicy(): void {
    this.policyService.getPolicyById(this.policyId).subscribe({
      next: (data) => {
        this.policy = {
          policyName: data.policyName || '',
          schemeName: data.schemeName || '',
          category: data.category || '',
          department: data.department || '',
          ministry: data.ministry || '',
          state: data.state || '',
          sector: data.sector || '',
          publicationDate: data.publicationDate || '',
          status:
            data.status.charAt(0).toUpperCase() + data.status.slice(1) ||
            'Pending',
          description: data.description || '',
        };
      },
      error: (err) => {
        console.error('Failed to load policy for editing', err);
        alert('Failed to load policy information from backend.');
        this.router.navigate(['/policies']);
      },
    });
  }

  updatePolicy(): void {
    this.policyService
      .updatePolicy(this.policyId, {
        ...this.policy,
        status: this.policy.status.toLowerCase(),
      })
      .subscribe({
        next: (updated) => {
          console.log('Policy Updated', updated);
          alert('Policy updated successfully.');
          this.router.navigate(['/policies', this.policyId]);
        },
        error: (err) => {
          console.error('Failed to update policy', err);
          alert('Failed to update policy on backend.');
        },
      });
  }

  cancel(): void {
    if (this.policyId) {
      this.router.navigate(['/policies', this.policyId]);
    } else {
      this.router.navigate(['/policies']);
    }
  }
}