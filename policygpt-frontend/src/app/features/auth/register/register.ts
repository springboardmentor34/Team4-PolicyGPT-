import { Component, inject } from '@angular/core';
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
import { Auth } from '../../../core/services/auth';

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
export class Register {
  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private router = inject(Router);

  hidePassword = true;
  hideConfirmPassword = true;
  errorMessage = '';
  isLoading = false;

  roles = USER_ROLES;

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
    phone: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[6-9]\d{9}$/)
      ]
    ],
    role: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required]
  },
  {
    validators: passwordMatchValidator
  }
);

  register() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const fullName = this.registerForm.value.fullName ?? '';
    const email = this.registerForm.value.email ?? '';
    const phone = this.registerForm.value.phone ?? null;
    const role = this.registerForm.value.role ?? '';
    const password = this.registerForm.value.password ?? '';

    this.auth
      .register({
        full_name: fullName,
        email,
        password,
        role: this.roleMap[String(role)] ?? String(role).toLowerCase().replace(/\s+/g, '_'),
        phone,
        state: null,
      })
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage =
            error?.error?.detail ?? 'Registration failed. Please try again.';
        },
      });
  }
}
