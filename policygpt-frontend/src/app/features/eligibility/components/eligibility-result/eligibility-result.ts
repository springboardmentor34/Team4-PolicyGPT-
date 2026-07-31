import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-eligibility-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './eligibility-result.html',
  styleUrl: './eligibility-result.css',
})
export class EligibilityResult {

  summary = {
    overallStatus: 'Eligible',
    matchedSchemes: 4,
    eligibilityScore: '85%',
    confidence: 'High'
  };

}