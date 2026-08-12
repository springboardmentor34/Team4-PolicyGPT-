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
          const rule = rules.find(
            (r) => r.scheme_id === scheme.scheme_id
          );
          return this.evaluateSchemeWithRule(
            scheme,
            rule,
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

  private evaluateSchemeWithRule(
    scheme: Scheme,
    rule: EligibilityRule | undefined,
    profile: UserProfile
  ): SchemeEligibilityResult {
    if (!rule) {
      return {
        scheme,
        status: 'Potentially Eligible',
        score: 50,
        reasons: [
          'No explicit eligibility rules configured on backend for this scheme yet.',
        ],
        recommendationReason:
          'Potentially eligible. Please contact the department for detailed manual guidelines.',
      };
    }

    let score = 0;
    const reasons: string[] = [];
    let checkedConstraints = 0;
    let satisfiedConstraints = 0;

    // 1. Min Age check
    if (
      rule.min_age !== undefined &&
      rule.min_age !== null
    ) {
      checkedConstraints++;

      if (profile.age >= rule.min_age) {
        satisfiedConstraints++;

        reasons.push(
          `Satisfied minimum age requirement of ${rule.min_age} years (your age: ${profile.age}).`
        );
      } else {
        reasons.push(
          `Minimum age requirement is ${rule.min_age} years (your age: ${profile.age}).`
        );
      }
    }

    // 2. Max Age check
    if (
      rule.max_age !== undefined &&
      rule.max_age !== null
    ) {
      checkedConstraints++;

      if (profile.age <= rule.max_age) {
        satisfiedConstraints++;

        reasons.push(
          `Satisfied maximum age limit of ${rule.max_age} years (your age: ${profile.age}).`
        );
      } else {
        reasons.push(
          `Maximum age limit is ${rule.max_age} years (your age: ${profile.age}).`
        );
      }
    }

    // 3. Gender check
    if (rule.gender && rule.gender.trim()) {
      checkedConstraints++;
      const ruleGen = rule.gender.trim().toLowerCase();
      const profGen = profile.gender.trim().toLowerCase();

      if (
        ruleGen === 'all' ||
        ruleGen === 'any' ||
        profGen === ruleGen
      ) {
        satisfiedConstraints++;

        reasons.push(
          `Gender requirement matches (${rule.gender}).`
        );
      } else {
        reasons.push(
          `Gender requirement is ${rule.gender} (your profile: ${profile.gender}).`
        );
      }
    }

    // 4. Max Income check
    if (
      rule.max_income !== undefined &&
      rule.max_income !== null
    ) {
      checkedConstraints++;

      if (profile.income <= rule.max_income) {
        satisfiedConstraints++;

        reasons.push(
          `Income is below the limit of ₹${rule.max_income} (your income: ₹${profile.income}).`
        );
      } else {
        reasons.push(
          `Income exceeds the limit of ₹${rule.max_income} (your income: ₹${profile.income}).`
        );
      }
    }

    // 5. Occupation check
    if (rule.occupation && rule.occupation.trim()) {
      checkedConstraints++;
      const ruleOcc = rule.occupation.trim().toLowerCase();
      const profOcc = profile.occupation.trim().toLowerCase();

      if (
        profOcc.includes(ruleOcc) ||
        ruleOcc.includes(profOcc)
      ) {
        satisfiedConstraints++;

        reasons.push(
          `Occupation matches scheme focus (${rule.occupation}).`
        );
      } else {
        reasons.push(
          `Scheme targets occupation: ${rule.occupation} (your profile: ${profile.occupation}).`
        );
      }
    }

    // 6. Education level check
    if (
      rule.education_level &&
      rule.education_level.trim()
    ) {
      checkedConstraints++;
      const ruleEdu = rule.education_level.trim().toLowerCase();
      const profEdu = profile.education.trim().toLowerCase();

      if (
        profEdu.includes(ruleEdu) ||
        ruleEdu.includes(profEdu)
      ) {
        satisfiedConstraints++;

        reasons.push(
          `Education level matches (${rule.education_level}).`
        );
      } else {
        reasons.push(
          `Education level requirement: ${rule.education_level} (your profile: ${profile.education}).`
        );
      }
    }

    // 7. Location check
    if (rule.location && rule.location.trim()) {
      checkedConstraints++;
      const ruleLoc = rule.location.trim().toLowerCase();
      const profLoc = profile.location.trim().toLowerCase();

      if (
        ruleLoc === 'all' ||
        ruleLoc === 'all india' ||
        profLoc.includes(ruleLoc) ||
        ruleLoc.includes(profLoc)
      ) {
        satisfiedConstraints++;

        reasons.push(
          `Location requirement satisfies (${rule.location}).`
        );
      } else {
        reasons.push(
          `Scheme targets location: ${rule.location} (your profile: ${profile.location}).`
        );
      }
    }

    // 8. Social Category check
    if (
      rule.social_category &&
      rule.social_category.trim()
    ) {
      checkedConstraints++;
      const ruleCat = rule.social_category.trim().toLowerCase();
      const profCat = profile.socialCategory.trim().toLowerCase();

      if (
        ruleCat === 'all' ||
        ruleCat === 'any' ||
        profCat === ruleCat
      ) {
        satisfiedConstraints++;

        reasons.push(
          `Social category requirement satisfies (${rule.social_category}).`
        );
      } else {
        reasons.push(
          `Social category requirement: ${rule.social_category} (your profile: ${profile.socialCategory}).`
        );
      }
    }

    // 9. Disability Status check
    if (
      rule.disability_status !== undefined &&
      rule.disability_status !== null
    ) {
      checkedConstraints++;
      const profDis =
        profile.disabilityStatus.toLowerCase() === 'yes';

      if (profDis === rule.disability_status) {
        satisfiedConstraints++;

        reasons.push(
          `Disability status matches target criteria.`
        );
      } else {
        reasons.push(`Disability support check failed.`);
      }
    }

    // Calculate score
    score =
      checkedConstraints > 0
        ? Math.round(
            (satisfiedConstraints / checkedConstraints) * 100
          )
        : 100;

    let status: EligibilityStatus = 'Not Eligible';

    if (score >= 75) {
      status = 'Eligible';
    } else if (score >= 45) {
      status = 'Potentially Eligible';
    }

    const recommendationReason =
      status === 'Eligible'
        ? 'Your profile strongly matches the configured criteria.'
        : status === 'Potentially Eligible'
          ? 'Your profile partially matches the criteria. Review the scheme requirements before applying.'
          : 'Your current profile does not match the configured criteria.';

    return {
      scheme,
      status,
      score,
      reasons,
      recommendationReason,
    };
  }
}