import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { SchemeEligibilityResult } from '../../models/eligibility.model';

@Component({
  selector: 'app-recommendation-card',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './recommendation-card.html',
  styleUrl: './recommendation-card.css',
})
export class RecommendationCard {
  @Input() recommendations: SchemeEligibilityResult[] = [];

  get eligibleRecommendations(): SchemeEligibilityResult[] {
    return this.recommendations.filter(
      (item) =>
        item.status === 'Eligible' ||
        item.status === 'Potentially Eligible'
    );
  }
}