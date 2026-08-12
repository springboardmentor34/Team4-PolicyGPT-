import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import {
  SchemeService,
  SchemeCreateRequest,
} from '../../../../core/services/scheme.service';

@Component({
  selector: 'app-scheme-create',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './scheme-create.html',
  styleUrl: './scheme-create.css',
})
export class SchemeCreate {
  private readonly fb = inject(FormBuilder);
  private readonly schemeService = inject(SchemeService);
  private readonly router = inject(Router);

  saving = false;
  errorMessage = '';

  readonly schemeForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(255)]],
    category: ['', Validators.maxLength(100)],
    department: ['', Validators.maxLength(150)],
    state: ['', Validators.maxLength(100)],
    benefits: [''],
    application_start_date: [''],
    application_end_date: [''],
  });

  submit(): void {
    if (this.schemeForm.invalid) {
      this.schemeForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.errorMessage = '';

    const formValue = this.schemeForm.getRawValue();

    const payload: SchemeCreateRequest = {
      name: formValue.name.trim(),
      category: formValue.category.trim() || undefined,
      department: formValue.department.trim() || undefined,
      state: formValue.state.trim() || undefined,
      benefits: formValue.benefits.trim() || undefined,
      application_start_date:
        formValue.application_start_date || undefined,
      application_end_date:
        formValue.application_end_date || undefined,
    };

    this.schemeService.createScheme(payload).subscribe({
      next: (scheme) => {
        console.log('Scheme Created:', scheme);

        this.saving = false;

        this.router.navigate(['/schemes']);
      },

      error: (error) => {
        console.error('Failed to create scheme:', error);

        this.saving = false;

        this.errorMessage =
          error?.error?.detail ||
          'Unable to create the scheme. Please try again.';
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/schemes']);
  }
}