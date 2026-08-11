import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
} from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

import { SchemeEligibilityResult } from '../../models/eligibility.model';

@Component({
  selector: 'app-scheme-matching',
  standalone: true,
  imports: [
    CommonModule,
    MatChipsModule,
    MatIconModule,
  ],
  templateUrl: './scheme-matching.html',
  styleUrl: './scheme-matching.css',
})
export class SchemeMatching {
  @Input() results: SchemeEligibilityResult[] = [];
}