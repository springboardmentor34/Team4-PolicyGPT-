import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { UserProfile } from '../../models/user-profile.model';

@Component({
  selector: 'app-profile-analysis',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './profile-analysis.html',
  styleUrl: './profile-analysis.css',
})
export class ProfileAnalysis {
  @Input() profile: UserProfile | null = null;

  get ageGroup(): string {
    if (!this.profile) {
      return '';
    }

    if (this.profile.age < 18) {
      return 'Below 18 Years';
    }

    if (this.profile.age <= 35) {
      return '18 - 35 Years';
    }

    if (this.profile.age <= 59) {
      return '36 - 59 Years';
    }

    return '60+ Years';
  }

  get incomeGroup(): string {
    if (!this.profile) {
      return '';
    }

    if (this.profile.income <= 300000) {
      return 'Low Income';
    }

    if (this.profile.income <= 800000) {
      return 'Middle Income';
    }

    return 'Higher Income';
  }
}