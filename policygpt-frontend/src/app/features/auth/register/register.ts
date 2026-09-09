import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { USER_ROLES } from '../../../core/constants/roles';
import { passwordMatchValidator } from '../../../core/validators/password-match.validator';
import { Auth, DepartmentOption } from '../../../core/services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,

    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private router = inject(Router);

  hidePassword = true;
  hideConfirmPassword = true;
  errorMessage = '';
  isLoading = false;

  roles = USER_ROLES;

  // Departments available to Government Officials
  departments: DepartmentOption[] = [];

  private roleMap: Record<string, string> = {
    Administrator: 'administrator',
    'Government Official': 'government_official',
    Citizen: 'citizen',
    Researcher: 'researcher',
    Organization: 'organization',
    'Guest User': 'guest_user',
  };

  registerForm = this.fb.group(
    {
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      state: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      role: ['', Validators.required],
      department: [''],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    },
    {
      validators: passwordMatchValidator,
    },
  );

  ngOnInit(): void {
    this.auth.getDepartments().subscribe({
      next: (departments) => {
        this.departments = departments;
      },
      error: () => {
        this.errorMessage = 'Unable to load departments. Please try again later.';
      },
    });
  }

  // =====================================================
  // CHECK SELECTED ROLE
  // =====================================================

  get isGovernmentOfficial(): boolean {
    const selectedRole = this.registerForm.get('role')?.value;

    return selectedRole === 'Government Official' || selectedRole === 'government_official';
  }

  // =====================================================
  // HANDLE ROLE CHANGE
  // =====================================================

  onRoleChange(): void {
    const role = this.registerForm.get('role')?.value;

    const departmentControl = this.registerForm.get('department');

    if (role === 'Government Official' || role === 'government_official') {
      // Department becomes required
      departmentControl?.setValidators([Validators.required]);
    } else {
      // Department is not required for other roles
      departmentControl?.clearValidators();

      // Also remove any previously selected department
      departmentControl?.setValue('');
    }

    departmentControl?.updateValueAndValidity();
  }

  // =====================================================
  // REGISTER
  // =====================================================

  register(): void {
    // Make sure department validation is updated
    this.onRoleChange();

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();

      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const fullName = this.registerForm.value.fullName ?? '';

    const email = this.registerForm.value.email ?? '';

    const phone = this.registerForm.value.phone ?? null;

    const state = this.registerForm.value.state ?? '';

    const role = this.registerForm.value.role ?? '';

    const password = this.registerForm.value.password ?? '';

    const department = this.registerForm.value.department ?? null;

    // ===================================================
    // REGISTRATION REQUEST
    // ===================================================

    const registrationData: any = {
      full_name: fullName,

      email,

      password,

      role: this.roleMap[String(role)] ?? String(role).toLowerCase().replace(/\s+/g, '_'),

      phone,

      state,
    };

    // IMPORTANT:
    // Department is sent ONLY for Government Officials

    if (role === 'Government Official' || role === 'government_official') {
      registrationData.department_id = department;
    }

    console.log('Registration request:', registrationData);

    this.auth.register(registrationData).subscribe({
      next: () => {
        this.isLoading = false;

        localStorage.setItem('user_name', fullName);

        localStorage.setItem('user_email', email);

        this.router.navigate(['/']);
      },

      error: (error) => {
        this.isLoading = false;

        console.error('Registration failed:', error);

        this.errorMessage = error?.error?.detail ?? 'Registration failed. Please try again.';
      },
    });
  }
}
