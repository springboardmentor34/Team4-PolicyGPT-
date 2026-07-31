import { Component } from '@angular/core';

import { EligibilityForm } from '../../components/eligibility-form/eligibility-form';
import { ProfileAnalysis } from '../../components/profile-analysis/profile-analysis';
import { SchemeMatching } from '../../components/scheme-matching/scheme-matching';
import { RecommendationCard } from '../../components/recommendation-card/recommendation-card';
import { EligibilityResult } from '../../components/eligibility-result/eligibility-result';

@Component({
  selector: 'app-eligibility-checker',
  standalone: true,
  imports: [
    EligibilityForm,
    ProfileAnalysis,
    SchemeMatching,
    RecommendationCard,
    EligibilityResult
  ],
  templateUrl: './eligibility-checker.html',
  styleUrl: './eligibility-checker.css'
})
export class EligibilityChecker {

}