
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { EligibilityForm } from '../../components/eligibility-form/eligibility-form';
import { EligibilityResult } from '../../components/eligibility-result/eligibility-result';
import { ProfileAnalysis } from '../../components/profile-analysis/profile-analysis';
import { RecommendationCard } from '../../components/recommendation-card/recommendation-card';
import { SchemeMatching } from '../../components/scheme-matching/scheme-matching';

import { EligibilityResult as EligibilityResultModel } from '../../models/eligibility.model';

@Component({
  selector: 'app-eligibility-checker',
  standalone: true,
  imports: [
    MatIconModule,
    EligibilityForm,
    ProfileAnalysis,
    EligibilityResult,
    SchemeMatching,
    RecommendationCard,
  ],
  templateUrl: './eligibility-checker.html',
  styleUrl: './eligibility-checker.css',
})
export class EligibilityChecker {
  eligibilityResult: EligibilityResultModel | null = null;

  onEligibilityChecked(result: EligibilityResultModel): void {
    this.eligibilityResult = result;
  }

  onFormReset(): void {
    this.eligibilityResult = null;
  }
}

