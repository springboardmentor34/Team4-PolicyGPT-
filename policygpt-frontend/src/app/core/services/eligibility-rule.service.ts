import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  EligibilityRule,
  EligibilityRuleCreate,
  EligibilityRuleUpdate,
} from '../../features/eligibility/models/eligibility-rule.model';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class EligibilityRuleService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${API_CONFIG.BASE_URL}/eligibility-rules`;

  getRules(
    skip: number = 0,
    limit: number = 100
  ): Observable<EligibilityRule[]> {
    const params = new HttpParams()
      .set('skip', skip)
      .set('limit', limit);
    return this.http.get<EligibilityRule[]>(`${this.apiUrl}/`, {
      params,
    });
  }

  getRuleById(ruleId: string): Observable<EligibilityRule> {
    return this.http.get<EligibilityRule>(`${this.apiUrl}/${ruleId}`);
  }

  getRulesByScheme(schemeId: string): Observable<EligibilityRule[]> {
    return this.http.get<EligibilityRule[]>(`${this.apiUrl}/scheme/${schemeId}`);
  }

  createRule(
    schemeId: string,
    ruleData: EligibilityRuleCreate
  ): Observable<EligibilityRule> {
    const params = new HttpParams().set('scheme_id', schemeId);
    const payload = { ...ruleData, scheme_id: schemeId };
    return this.http.post<EligibilityRule>(
      `${this.apiUrl}/`,
      payload,
      { params }
    );
  }

  updateRule(
    ruleId: string,
    ruleData: EligibilityRuleUpdate
  ): Observable<EligibilityRule> {
    return this.http.put<EligibilityRule>(
      `${this.apiUrl}/${ruleId}`,
      ruleData
    );
  }

  deleteRule(ruleId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${ruleId}`);
  }
}
