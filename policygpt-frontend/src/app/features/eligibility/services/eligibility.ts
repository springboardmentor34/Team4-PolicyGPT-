import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

import { SchemeService } from '../../../core/services/scheme.service';
import { EligibilityRuleService } from '../../../core/services/eligibility-rule.service';

import { Scheme } from '../models/scheme.model';
import { EligibilityRule } from '../models/eligibility-rule.model';
import { UserProfile } from '../models/user-profile.model';

import {
  EligibilityResult,
  EligibilityStatus,
  SchemeEligibilityResult,
} from '../models/eligibility.model';

@Injectable({
  providedIn: 'root',
})
export class Eligibility {
  private readonly schemeService = inject(SchemeService);
  private readonly ruleService = inject(EligibilityRuleService);

  checkEligibility(
    profile: UserProfile
  ): Observable<EligibilityResult> {
    return forkJoin({
      schemesResponse: this.schemeService.getSchemes(0, 1000),
      rules: this.ruleService.getRules(0, 1000),
    }).pipe(
      map(({ schemesResponse, rules }) => {
        const schemes = schemesResponse.items;

        const results = schemes.map((scheme) => {
          const schemeRules = rules.filter(
            (rule) => rule.scheme_id === scheme.scheme_id
          );

          return this.evaluateScheme(
            scheme,
            schemeRules,
            profile
          );
        });

        const eligibleResults = results.filter(
          (result) => result.status === 'Eligible'
        );

        const potentiallyEligibleResults = results.filter(
          (result) => result.status === 'Potentially Eligible'
        );

        const averageScore =
          results.length > 0
            ? Math.round(
                results.reduce(
                  (total, result) => total + result.score,
                  0
                ) / results.length
              )
            : 0;

        let overallStatus: EligibilityStatus = 'Not Eligible';

        if (eligibleResults.length > 0) {
          overallStatus = 'Eligible';
        } else if (potentiallyEligibleResults.length > 0) {
          overallStatus = 'Potentially Eligible';
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
            eligibleResults.length +
            potentiallyEligibleResults.length,
          totalSchemes: results.length,
          results,
        };
      })
    );
  }

  private buildRecommendationReason(
  scheme: Scheme,
  rules: EligibilityRule[],
  reasons: string[],
  status: EligibilityStatus
): string {

  // No rules configured
  if (rules.length === 0) {
    return `No eligibility rules have been configured for this scheme.`;
  }

  const passedRequirements = reasons
    .filter((reason) => reason.startsWith('✓'))
    .map((reason) => reason.substring(2).trim());

  const failedRequirements = reasons
    .filter((reason) => reason.startsWith('✗'))
    .map((reason) => reason.substring(2).trim());

  if (status === 'Eligible') {

    if (passedRequirements.length === 0) {
      return `You satisfy all configured eligibility requirements for this scheme.`;
    }

    return (
      `You satisfy all configured eligibility requirements. ` +
      passedRequirements.join(' ')
    );
  }

  if (status === 'Potentially Eligible') {

    const messageParts: string[] = [];

    if (passedRequirements.length > 0) {
      messageParts.push(
        `Requirements satisfied: ${passedRequirements.join(' ')}`
      );
    }

    if (failedRequirements.length > 0) {
      messageParts.push(
        `Requirements not satisfied: ${failedRequirements.join(' ')}`
      );
    }

    return messageParts.join(' ');
  }

  if (failedRequirements.length > 0) {
    return (
      `You do not currently satisfy the configured eligibility requirements. ` +
      `Requirements not satisfied: ${failedRequirements.join(' ')}`
    );
  }

  return `Your profile does not satisfy the configured eligibility requirements for this scheme.`;
}

  private evaluateScheme(
    scheme: Scheme,
    rules: EligibilityRule[],
    profile: UserProfile
  ): SchemeEligibilityResult {
    /*
     * No eligibility rule configured.
     */
    if (rules.length === 0) {
      return {
        scheme,
        status: 'Potentially Eligible',
        score: 50,
        reasons: [
          'No explicit eligibility rules are configured for this scheme.'
        ],
        recommendationReason:
          'Eligibility cannot be fully verified because this scheme has no configured eligibility rules.',
      };
    }

    /*
     * Evaluate every rule attached to the scheme.
     *
     * A scheme is eligible only when ALL configured
     * mandatory conditions are satisfied.
     */
    const evaluations = rules.map((rule) =>
      this.evaluateRule(rule, profile)
    );

    const totalConditions = evaluations.reduce(
      (total, evaluation) =>
        total + evaluation.totalConditions,
      0
    );

    const satisfiedConditions = evaluations.reduce(
      (total, evaluation) =>
        total + evaluation.satisfiedConditions,
      0
    );

    const failedConditions = evaluations.reduce(
      (total, evaluation) =>
        total + evaluation.failedConditions,
      0
    );

    const reasons = evaluations.flatMap(
      (evaluation) => evaluation.reasons
    );

    const score =
      totalConditions > 0
        ? Math.round(
            (satisfiedConditions / totalConditions) * 100
          )
        : 100;

    /*
     * IMPORTANT:
     *
     * Every configured condition must pass for
     * the scheme to be considered Eligible.
     */
    let status: EligibilityStatus;

    if (failedConditions === 0) {
      status = 'Eligible';
    } else if (satisfiedConditions > 0) {
      status = 'Potentially Eligible';
    } else {
      status = 'Not Eligible';
    }

    const recommendationReason =
  this.buildRecommendationReason(
    scheme,
    rules,
    reasons,
    status
  );

    return {
      scheme,
      status,
      score,
      reasons,
      recommendationReason,
    };
  }

  private evaluateRule(
    rule: EligibilityRule,
    profile: UserProfile
  ): {
    totalConditions: number;
    satisfiedConditions: number;
    failedConditions: number;
    reasons: string[];
  } {
    let totalConditions = 0;
    let satisfiedConditions = 0;
    let failedConditions = 0;

    const reasons: string[] = [];

    const pass = (message: string): void => {
      totalConditions++;
      satisfiedConditions++;
      reasons.push(`✓ ${message}`);
    };

    const fail = (message: string): void => {
      totalConditions++;
      failedConditions++;
      reasons.push(`✗ ${message}`);
    };

    /*
     * AGE
     */
    if (
      rule.min_age !== null &&
      rule.min_age !== undefined
    ) {
      if (profile.age >= rule.min_age) {
       pass(
  `Your age (${profile.age}) meets the minimum required age of ${rule.min_age} years.`
);
      } else {
        fail(
  `Your age (${profile.age}) is below the minimum required age of ${rule.min_age} years.`
);
      }
    }

    if (
      rule.max_age !== null &&
      rule.max_age !== undefined
    ) {
      if (profile.age <= rule.max_age) {
      pass(
  `Your age (${profile.age}) is within the maximum allowed age of ${rule.max_age} years.`
);
      } else {
       fail(
  `Your age (${profile.age}) exceeds the maximum allowed age of ${rule.max_age} years.`
);
      }
    }

    /*
     * GENDER
     */
    if (
      rule.gender &&
      rule.gender.trim()
    ) {
      const requiredGender =
        rule.gender.trim().toLowerCase();

      const userGender =
        profile.gender.trim().toLowerCase();

      if (
        requiredGender === 'all' ||
        requiredGender === 'any' ||
        requiredGender === userGender
      ) {
        pass(
  `Your gender (${profile.gender}) matches the configured requirement of ${rule.gender}.`
);
      } else {
      fail(
  `Your gender (${profile.gender}) does not match the configured requirement of ${rule.gender}.`
);
      }
    }

    /*
     * INCOME
     */
    if (
      rule.max_income !== null &&
      rule.max_income !== undefined
    ) {
      if (profile.income <= rule.max_income) {
       pass(
  `Your annual income of ₹${profile.income.toLocaleString('en-IN')} is within the maximum allowed income of ₹${rule.max_income.toLocaleString('en-IN')}.`
);
      } else {
     fail(
  `Your annual income of ₹${profile.income.toLocaleString('en-IN')} exceeds the maximum allowed income of ₹${rule.max_income.toLocaleString('en-IN')}.`
);
      }
    }

    /*
     * OCCUPATION
     */
    if (
      rule.occupation &&
      rule.occupation.trim()
    ) {
      const requiredOccupation =
        rule.occupation.trim().toLowerCase();

      const userOccupation =
        profile.occupation.trim().toLowerCase();

      const occupationMatches =
        requiredOccupation === 'all' ||
        requiredOccupation === 'any' ||
        userOccupation === requiredOccupation ||
        userOccupation.includes(requiredOccupation) ||
        requiredOccupation.includes(userOccupation);

      if (occupationMatches) {
       pass(
  `Your occupation (${profile.occupation}) matches the configured requirement of ${rule.occupation}.`
);
      } else {
     fail(
  `Your occupation (${profile.occupation}) does not match the configured requirement of ${rule.occupation}.`
);
      }
    }

    /*
     * EDUCATION
     */
    if (
      rule.education_level &&
      rule.education_level.trim()
    ) {
      const requiredEducation =
        rule.education_level.trim().toLowerCase();

      const userEducation =
        profile.education.trim().toLowerCase();

      const educationMatches =
        requiredEducation === 'all' ||
        requiredEducation === 'any' ||
        requiredEducation === userEducation;

      if (educationMatches) {
       pass(
  `Your education level (${profile.education}) matches the configured requirement of ${rule.education_level}.`
);
      } else {
     fail(
  `Your education level (${profile.education}) does not match the configured requirement of ${rule.education_level}.`
);
      }
    }

    /*
     * LOCATION / STATE
     */
    if (
      rule.location &&
      rule.location.trim()
    ) {
      const requiredLocation =
        rule.location.trim().toLowerCase();

      const userLocation =
        profile.location.trim().toLowerCase();

      const locationMatches =
        requiredLocation === 'all' ||
        requiredLocation === 'all india' ||
        userLocation === requiredLocation ||
        userLocation.includes(requiredLocation) ||
        requiredLocation.includes(userLocation);

      if (locationMatches) {
    pass(
  `Your location (${profile.location}) matches the configured location requirement of ${rule.location}.`
);
      } else {
       fail(
  `Your location (${profile.location}) does not match the configured location requirement of ${rule.location}.`
);
      }
    }

    /*
     * SOCIAL CATEGORY
     */
    if (
      rule.social_category &&
      rule.social_category.trim()
    ) {
      const requiredCategory =
        rule.social_category.trim().toLowerCase();

      const userCategory =
        profile.socialCategory.trim().toLowerCase();

      const categoryMatches =
        requiredCategory === 'all' ||
        requiredCategory === 'any' ||
        requiredCategory === userCategory;

      if (categoryMatches) {
   pass(
  `Your social category (${profile.socialCategory}) matches the configured requirement of ${rule.social_category}.`
);
      } else {
       fail(
  `Your social category (${profile.socialCategory}) does not match the configured requirement of ${rule.social_category}.`
);
      }
    }

    /*
     * DISABILITY
     */
    if (
      rule.disability_status !== null &&
      rule.disability_status !== undefined
    ) {
      const userHasDisability =
        profile.disabilityStatus
          .trim()
          .toLowerCase() === 'yes';

      if (
        userHasDisability ===
        rule.disability_status
      ) {
       pass(
  `Your disability status matches the configured requirement.`
);
      } else {
       fail(
  `Your disability status does not match the configured requirement.`
);
      }
    }

    return {
      totalConditions,
      satisfiedConditions,
      failedConditions,
      reasons,
    };
  }
}