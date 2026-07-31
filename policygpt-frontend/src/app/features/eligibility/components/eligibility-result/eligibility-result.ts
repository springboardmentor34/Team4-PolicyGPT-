import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-eligibility-result',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatProgressBarModule],
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
