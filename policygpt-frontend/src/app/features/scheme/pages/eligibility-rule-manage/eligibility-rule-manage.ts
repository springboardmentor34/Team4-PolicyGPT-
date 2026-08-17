import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import {
  Scheme,
  SchemeService,
} from '../../../../core/services/scheme.service';
import { EligibilityRuleService } from '../../../../core/services/eligibility-rule.service';
import {
  EligibilityRule,
  EligibilityRuleCreate,
  EligibilityRuleUpdate,
} from '../../../eligibility/models/eligibility-rule.model';

function ageRangeValidator(control: AbstractControl): ValidationErrors | null {
  const minAge = control.get('min_age')?.value;
  const maxAge = control.get('max_age')?.value;

  if (
    minAge !== null &&
    minAge !== '' &&
    maxAge !== null &&
    maxAge !== '' &&
    Number(minAge) > Number(maxAge)
  ) {
    return { minAgeGreaterThanMaxAge: true };
  }
  return null;
}

@Component({
  selector: 'app-eligibility-rule-manage',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './eligibility-rule-manage.html',
  styleUrl: './eligibility-rule-manage.css',
})
export class EligibilityRuleManage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly schemeService = inject(SchemeService);
  private readonly eligibilityRuleService = inject(EligibilityRuleService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  schemes: Scheme[] = [];
  selectedSchemeId = '';
  selectedScheme: Scheme | null = null;
  rules: EligibilityRule[] = [];

  loadingSchemes = false;
  loadingRules = false;
  saving = false;
  deletingRuleId: string | null = null;

  editingRuleId: string | null = null;

  successMessage = '';
  errorMessage = '';

  readonly ruleForm: FormGroup = this.fb.group(
    {
      min_age: [null, [Validators.min(0)]],
      max_age: [null, [Validators.min(0)]],
      gender: [''],
      max_income: [null, [Validators.min(0)]],
      occupation: [''],
      education_level: [''],
      location: [''],
      social_category: [''],
      disability_status: [false],
    },
    { validators: ageRangeValidator }
  );

  ngOnInit(): void {
    this.loadSchemes();
  }

  loadSchemes(): void {
    this.loadingSchemes = true;
    this.schemeService.getSchemes(0, 200).subscribe({
      next: (response) => {
        this.schemes = response.items;
        this.loadingSchemes = false;

        const routeSchemeId = this.route.snapshot.paramMap.get('schemeId');
        if (routeSchemeId) {
          this.onSchemeChange(routeSchemeId);
        } else if (this.schemes.length > 0) {
          this.onSchemeChange(this.schemes[0].scheme_id);
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to fetch schemes:', err);
        this.loadingSchemes = false;
        this.errorMessage = 'Unable to load scheme list. Please try again.';
        this.cdr.detectChanges();
      },
    });
  }

  onSchemeChange(schemeId: string): void {
    this.selectedSchemeId = schemeId;
    this.selectedScheme =
      this.schemes.find((s) => s.scheme_id === schemeId) || null;
    this.resetForm();
    this.clearMessages();
    if (schemeId) {
      this.loadRulesForScheme(schemeId);
    } else {
      this.rules = [];
      this.cdr.detectChanges();
    }
  }

  loadRulesForScheme(schemeId: string): void {
    this.loadingRules = true;
    this.eligibilityRuleService.getRulesByScheme(schemeId).subscribe({
      next: (rules) => {
        this.rules = rules;
        this.loadingRules = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load eligibility rules:', err);
        this.loadingRules = false;
        this.rules = [];
        if (err.status !== 404) {
          this.errorMessage = 'Failed to load eligibility rules for the selected scheme.';
        }
        this.cdr.detectChanges();
      },
    });
  }

  saveRule(): void {
    this.clearMessages();

    if (!this.selectedSchemeId) {
      this.errorMessage = 'Please select a scheme first.';
      return;
    }

    if (this.ruleForm.invalid) {
      this.ruleForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    const formVal = this.ruleForm.value;

    const payload: EligibilityRuleCreate = {
      min_age:
        formVal.min_age !== null && formVal.min_age !== ''
          ? Number(formVal.min_age)
          : null,
      max_age:
        formVal.max_age !== null && formVal.max_age !== ''
          ? Number(formVal.max_age)
          : null,
      gender: formVal.gender ? formVal.gender.trim() : null,
      max_income:
        formVal.max_income !== null && formVal.max_income !== ''
          ? Number(formVal.max_income)
          : null,
      occupation: formVal.occupation ? formVal.occupation.trim() : null,
      education_level: formVal.education_level
        ? formVal.education_level.trim()
        : null,
      location: formVal.location ? formVal.location.trim() : null,
      social_category: formVal.social_category
        ? formVal.social_category.trim()
        : null,
      disability_status: Boolean(formVal.disability_status),
    };

    if (this.editingRuleId) {
      this.eligibilityRuleService
        .updateRule(this.editingRuleId, payload as EligibilityRuleUpdate)
        .subscribe({
          next: () => {
            this.saving = false;
            this.successMessage = 'Eligibility rule updated successfully!';
            this.resetForm();
            this.loadRulesForScheme(this.selectedSchemeId);
          },
          error: (err) => {
            console.error('Failed to update eligibility rule:', err);
            this.saving = false;
            this.errorMessage =
              err?.error?.detail ||
              'Failed to update eligibility rule. Please try again.';
          },
        });
    } else {
      this.eligibilityRuleService
        .createRule(this.selectedSchemeId, payload)
        .subscribe({
          next: () => {
            this.saving = false;
            this.successMessage = 'Eligibility rule created successfully!';
            this.resetForm();
            this.loadRulesForScheme(this.selectedSchemeId);
          },
          error: (err) => {
            console.error('Failed to create eligibility rule:', err);
            this.saving = false;
            this.errorMessage =
              err?.error?.detail ||
              'Failed to create eligibility rule. Please verify details.';
          },
        });
    }
  }

  editRule(rule: EligibilityRule): void {
    this.clearMessages();
    this.editingRuleId = rule.rule_id;
    this.ruleForm.patchValue({
      min_age: rule.min_age ?? null,
      max_age: rule.max_age ?? null,
      gender: rule.gender ?? '',
      max_income: rule.max_income ?? null,
      occupation: rule.occupation ?? '',
      education_level: rule.education_level ?? '',
      location: rule.location ?? '',
      social_category: rule.social_category ?? '',
      disability_status: rule.disability_status ?? false,
    });
  }

  cancelEdit(): void {
    this.resetForm();
    this.clearMessages();
  }

  deleteRule(ruleId: string): void {
    if (!confirm('Are you sure you want to delete this eligibility rule?')) {
      return;
    }

    this.clearMessages();
    this.deletingRuleId = ruleId;

    this.eligibilityRuleService.deleteRule(ruleId).subscribe({
      next: () => {
        this.deletingRuleId = null;
        this.successMessage = 'Eligibility rule deleted successfully.';
        if (this.editingRuleId === ruleId) {
          this.resetForm();
        }
        this.loadRulesForScheme(this.selectedSchemeId);
      },
      error: (err) => {
        console.error('Failed to delete eligibility rule:', err);
        this.deletingRuleId = null;
        this.errorMessage =
          err?.error?.detail || 'Failed to delete eligibility rule.';
      },
    });
  }

  resetForm(): void {
    this.editingRuleId = null;
    this.ruleForm.reset({
      min_age: null,
      max_age: null,
      gender: '',
      max_income: null,
      occupation: '',
      education_level: '',
      location: '',
      social_category: '',
      disability_status: false,
    });
  }

  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }
}
