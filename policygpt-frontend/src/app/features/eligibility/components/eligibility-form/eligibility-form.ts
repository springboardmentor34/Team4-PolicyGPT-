import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import {
  FormsModule,
  NgForm,
} from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { Eligibility } from '../../services/eligibility';
import { EligibilityResult } from '../../models/eligibility.model';
import { UserProfile } from '../../models/user-profile.model';

@Component({
  selector: 'app-eligibility-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './eligibility-form.html',
  styleUrl: './eligibility-form.css',
})
export class EligibilityForm {
  @Output()
  eligibilityChecked =
    new EventEmitter<EligibilityResult>();

  @Output()
  formReset = new EventEmitter<void>();

  form = {
    age: '',
    gender: '',
    income: '',
    occupation: '',
    education: '',
    location: '',
    socialCategory: '',
    disabilityStatus: '',
  };

  submitted = false;
  loading = false;

  constructor(
    private readonly eligibility: Eligibility
  ) {}

  checkEligibility(formRef: NgForm): void {
    this.submitted = true;

    if (formRef.invalid) {
      formRef.control.markAllAsTouched();
      return;
    }

    this.loading = true;

    const profile: UserProfile = {
      age: Number(this.form.age),
      gender: this.form.gender as UserProfile['gender'],
      income: Number(this.form.income),
      occupation: this.form.occupation,
      education:
        this.form.education as UserProfile['education'],
      location: this.form.location,
      socialCategory:
        this.form.socialCategory as UserProfile['socialCategory'],
      disabilityStatus:
        this.form.disabilityStatus as UserProfile['disabilityStatus'],
    };

    const result = this.eligibility.checkEligibility(profile);

    this.loading = false;

    this.eligibilityChecked.emit(result);
  }

  resetForm(formRef: NgForm): void {
    formRef.resetForm({
      age: '',
      gender: '',
      income: '',
      occupation: '',
      education: '',
      location: '',
      socialCategory: '',
      disabilityStatus: '',
    });

    this.form = {
      age: '',
      gender: '',
      income: '',
      occupation: '',
      education: '',
      location: '',
      socialCategory: '',
      disabilityStatus: '',
    };

    this.submitted = false;
    this.loading = false;

    this.formReset.emit();
  }
}