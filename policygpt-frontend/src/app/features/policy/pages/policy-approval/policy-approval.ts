import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-policy-approval',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './policy-approval.html',
  styleUrl: './policy-approval.css'
})
export class PolicyApproval {

  displayedColumns = [
    'policyName',
    'department',
    'status',
    'actions'
  ];

  policies = [

    {
      id: 1,
      policyName: 'National Education Policy 2026',
      department: 'Education Department',
      status: 'Pending'
    },

    {
      id: 2,
      policyName: 'PM Kisan Support Policy',
      department: 'Agriculture Department',
      status: 'Approved'
    },

    {
      id: 3,
      policyName: 'Digital India Mission',
      department: 'IT Department',
      status: 'Rejected'
    },

    {
      id: 4,
      policyName: 'Skill India Mission',
      department: 'Skill Development Department',
      status: 'Pending'
    }

  ];

  approve(policy: any): void {

    policy.status = 'Approved';

    console.log('Approved', policy);

  }

  reject(policy: any): void {

    policy.status = 'Rejected';

    console.log('Rejected', policy);

  }

  view(policy: any): void {

    console.log(policy);

  }

}