import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { OfficialService } from '../../core/services/official.service';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface Department {
  departmentId: string;
  department: string;
  policies: number;
  schemes: number;
  activity?: number;
}

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './departments.html',
  styleUrl: './departments.css'
})
export class Departments implements OnInit {

  private router = inject(Router);
  private officialService = inject(OfficialService);

  departments: Department[] = [];

  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {

    this.loading = true;
    this.errorMessage = '';

    this.officialService.getDepartmentReports().subscribe({

      next: (data) => {

        console.log('Departments:', data);

        this.departments = data ?? [];

        this.loading = false;
      },

      error: (error) => {

        console.error(
          'Failed to load departments:',
          error
        );

        this.errorMessage =
          'Unable to load departments.';

        this.loading = false;
      }

    });
  }

  openDepartmentAnalytics(
    departmentId: string
  ): void {

    if (!departmentId) {
      return;
    }

    this.router.navigate(
      ['/department-analytics'],
      {
        queryParams: {
          department: departmentId
        }
      }
    );
  }

  retry(): void {
    this.loadDepartments();
  }

}