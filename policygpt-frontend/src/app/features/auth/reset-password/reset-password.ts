import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,

    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword {
  resetForm: FormGroup;

  token = '';

  hidePassword = true;
  hideConfirmPassword = true;

  isLoading = false;

  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private auth: Auth
  ) {
    this.resetForm = this.fb.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
          ],
        ],

        confirmPassword: [
          '',
          Validators.required,
        ],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );

    this.token =
      this.route.snapshot.queryParamMap.get('token') ?? '';

    if (!this.token) {
      this.errorMessage =
        'Invalid or missing password reset link.';
    }
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (!password || !confirmPassword) {
      return null;
    }

    return password === confirmPassword
      ? null
      : { passwordMismatch: true };
  }

  resetPassword(): void {
    if (!this.token) {
      this.errorMessage =
        'Invalid or expired password reset link.';
      return;
    }

    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    this.successMessage = '';
    this.errorMessage = '';

    const password =
      this.resetForm.get('password')?.value;

    this.auth
      .resetPassword({
        token: this.token,
        password: password,
      })
      .subscribe({
        next: (response) => {
          this.isLoading = false;

          this.successMessage =
            response?.message ??
            'Your password has been reset successfully.';

          setTimeout(() => {
            this.router.navigate(['/']);
          }, 2000);
        },

        error: (error) => {
          this.isLoading = false;

          this.errorMessage =
            error?.error?.detail ??
            error?.error?.message ??
            'Unable to reset password. The link may have expired.';
        },
      });
  }
}