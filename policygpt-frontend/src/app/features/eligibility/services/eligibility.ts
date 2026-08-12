import { Injectable } from '@angular/core';

import {
  EligibilityResult,
  EligibilityStatus,
  SchemeEligibilityResult,
} from '../models/eligibility.model';
import { Scheme } from '../models/scheme.model';
import { UserProfile } from '../models/user-profile.model';

@Injectable({
  providedIn: 'root',
})
export class Eligibility {
  private readonly schemes: Scheme[] = [
    {
      scheme_id: 'PM-KISAN',
      name: 'PM Kisan Samman Nidhi',
      category: 'Agriculture',
      department: 'Agriculture',
      state: 'All India',
      benefits: 'Income support for eligible farmer families.',
      application_start_date: null,
      application_end_date: null,
      status: 'active',
      created_by: null,
      created_at: '2026-01-01',
    },
    {
      scheme_id: 'AYUSHMAN-BHARAT',
      name: 'Ayushman Bharat',
      category: 'Health',
      department: 'Health',
      state: 'All India',
      benefits: 'Health coverage for eligible families.',
      application_start_date: null,
      application_end_date: null,
      status: 'active',
      created_by: null,
      created_at: '2026-01-01',
    },
    {
      scheme_id: 'SKILL-INDIA',
      name: 'Skill India',
      category: 'Skill Development',
      department: 'Skill Development',
      state: 'All India',
      benefits: 'Skill development and vocational training opportunities.',
      application_start_date: null,
      application_end_date: null,
      status: 'active',
      created_by: null,
      created_at: '2026-01-01',
    },
    {
      scheme_id: 'PM-AWAS',
      name: 'PM Awas Yojana',
      category: 'Housing',
      department: 'Housing',
      state: 'All India',
      benefits: 'Housing assistance for eligible beneficiaries.',
      application_start_date: null,
      application_end_date: null,
      status: 'active',
      created_by: null,
      created_at: '2026-01-01',
    },
  ];

  checkEligibility(profile: UserProfile): EligibilityResult {
    const results = this.schemes.map((scheme) =>
      this.evaluateScheme(scheme, profile)
    );

    const eligibleResults = results.filter(
      (result) => result.status === 'Eligible'
    );

    const potentiallyEligibleResults = results.filter(
      (result) => result.status === 'Potentially Eligible'
    );

    const averageScore = Math.round(
      results.reduce((total, result) => total + result.score, 0) /
        results.length
    );

    let overallStatus: EligibilityStatus;

    if (eligibleResults.length > 0) {
      overallStatus = 'Eligible';
    } else if (potentiallyEligibleResults.length > 0) {
      overallStatus = 'Potentially Eligible';
    } else {
      overallStatus = 'Not Eligible';
    }

    const confidence =
      averageScore >= 75
        ? 'High'
        : averageScore >= 50
          ? 'Medium'
          : 'Low';

    return {
      profile,
      overallStatus,
      eligibilityScore: averageScore,
      confidence,
      matchedSchemes:
        eligibleResults.length + potentiallyEligibleResults.length,
      totalSchemes: results.length,
      results,
    };
  }

  private evaluateScheme(
    scheme: Scheme,
    profile: UserProfile
  ): SchemeEligibilityResult {
    let score = 0;
    const reasons: string[] = [];

    switch (scheme.scheme_id) {
      case 'PM-KISAN':
        if (this.isFarmer(profile.occupation)) {
          score += 50;
          reasons.push('Your occupation matches the agriculture profile.');
        } else {
          reasons.push(
            'The scheme primarily targets eligible farmer families.'
          );
        }

        if (profile.income <= 500000) {
          score += 25;
          reasons.push('Your reported annual income is within the supported range.');
        } else {
          reasons.push(
            'Your reported annual income is above the configured screening range.'
          );
        }

        if (profile.location.trim()) {
          score += 15;
          reasons.push('A valid state has been provided in your profile.');
        }

        if (profile.socialCategory !== 'General') {
          score += 10;
        }

        break;

      case 'AYUSHMAN-BHARAT':
        if (profile.income <= 300000) {
          score += 55;
          reasons.push(
            'Your reported annual income is within the configured screening range.'
          );
        } else {
          reasons.push(
            'Your reported annual income is above the configured screening range.'
          );
        }

        if (profile.socialCategory !== 'General') {
          score += 20;
          reasons.push(
            'Your social category may qualify for additional screening.'
          );
        }

        if (profile.disabilityStatus === 'Yes') {
          score += 15;
          reasons.push(
            'Disability status may be relevant for additional support.'
          );
        }

        if (profile.age >= 60) {
          score += 10;
          reasons.push(
            'Age may be relevant to additional health-support programs.'
          );
        }

        break;

      case 'SKILL-INDIA':
        if (
          profile.age >= 15 &&
          profile.age <= 45
        ) {
          score += 40;
          reasons.push(
            'Your age falls within the configured skill-development range.'
          );
        } else {
          reasons.push(
            'Your age is outside the primary screening range for this recommendation.'
          );
        }

        if (
          profile.education === '10th' ||
          profile.education === '12th'
        ) {
          score += 25;
          reasons.push(
            'Your education level is suitable for many skill-development programs.'
          );
        } else {
          score += 15;
          reasons.push(
            'Graduates may also qualify for selected skill-development programs.'
          );
        }

        if (
          profile.occupation.toLowerCase().includes('student') ||
          profile.occupation.toLowerCase().includes('unemployed') ||
          profile.occupation.toLowerCase().includes('job seeker')
        ) {
          score += 25;
          reasons.push(
            'Your occupation may benefit from skill-development opportunities.'
          );
        } else {
          score += 10;
        }

        break;

      case 'PM-AWAS':
        if (profile.income <= 300000) {
          score += 45;
          reasons.push(
            'Your reported annual income is within the configured housing-support range.'
          );
        } else {
          reasons.push(
            'Your reported annual income is above the configured housing-support range.'
          );
        }

        if (profile.socialCategory !== 'General') {
          score += 20;
          reasons.push(
            'Your social category may be relevant to housing-scheme screening.'
          );
        }

        if (profile.disabilityStatus === 'Yes') {
          score += 15;
          reasons.push(
            'Disability status may be relevant to additional housing support.'
          );
        }

        if (profile.location.trim()) {
          score += 10;
        }

        break;
    }

    score = Math.min(score, 100);

    let status: EligibilityStatus;

    if (score >= 75) {
      status = 'Eligible';
    } else if (score >= 45) {
      status = 'Potentially Eligible';
    } else {
      status = 'Not Eligible';
    }

    const recommendationReason =
      status === 'Eligible'
        ? 'Your profile strongly matches the configured screening criteria.'
        : status === 'Potentially Eligible'
          ? 'Your profile partially matches the screening criteria. Review the scheme requirements before applying.'
          : 'Your current profile does not sufficiently match the configured screening criteria.';

    return {
      scheme,
      status,
      score,
      reasons,
      recommendationReason,
    };
  }

  private isFarmer(occupation: string): boolean {
    const normalizedOccupation = occupation.toLowerCase();

    return (
      normalizedOccupation.includes('farmer') ||
      normalizedOccupation.includes('agriculture') ||
      normalizedOccupation.includes('cultivator')
    );
  }
}