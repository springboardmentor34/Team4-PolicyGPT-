import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { EligibilityResult as EligibilityResultModel } from '../../models/eligibility.model';

@Component({
  selector: 'app-eligibility-result',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  templateUrl: './eligibility-result.html',
  styleUrl: './eligibility-result.css',
})
export class EligibilityResult {
  @Input() result: EligibilityResultModel | null = null;
}