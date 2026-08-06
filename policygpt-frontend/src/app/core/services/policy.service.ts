import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Policy } from '../../features/policy/models/policy.model';

@Injectable({
  providedIn: 'root',
})
export class PolicyService {

  private policies: Policy[] = [
    {
      id: 1,
      policyName: 'National Education Policy 2026',
      schemeName: 'Digital Learning Initiative',
      description:
        'Improves access to quality education through digital infrastructure, scholarships, and teacher training.',
      category: 'Education',
      department: 'Education Department',
      ministry: 'Ministry of Education',
      state: 'Telangana',
      sector: 'Education',
      publicationDate: '2026-07-31',
      status: 'Approved',
    },
    {
      id: 2,
      policyName: 'PM Kisan Support Policy',
      schemeName: 'Farmer Assistance Scheme',
      description:
        'Provides financial assistance, crop insurance, and agricultural support to eligible farmers.',
      category: 'Agriculture',
      department: 'Agriculture Department',
      ministry: 'Ministry of Agriculture',
      state: 'Andhra Pradesh',
      sector: 'Agriculture',
      publicationDate: '2026-07-20',
      status: 'Pending',
    }
  ];

  constructor() {}

  getPolicies(): Observable<Policy[]> {
    return of(this.policies);
  }

  searchPolicies(keyword: string): Observable<Policy[]> {

    if (!keyword.trim()) {
      return of(this.policies);
    }

    const searchText = keyword.toLowerCase();

    const filteredPolicies = this.policies.filter(policy =>
      policy.policyName.toLowerCase().includes(searchText) ||
      policy.schemeName.toLowerCase().includes(searchText) ||
      policy.department.toLowerCase().includes(searchText) ||
      policy.ministry.toLowerCase().includes(searchText) ||
      policy.state.toLowerCase().includes(searchText) ||
      policy.sector.toLowerCase().includes(searchText) ||
      policy.category.toLowerCase().includes(searchText)
    );

    return of(filteredPolicies);
  }
}