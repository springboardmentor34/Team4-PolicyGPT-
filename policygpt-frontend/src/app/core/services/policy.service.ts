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
    description: 'Improves access to quality education through digital infrastructure.',
    category: 'Education',
    department: 'Education Department',
    ministry: 'Ministry of Education',
    state: 'Telangana',
    sector: 'Education',
    publicationDate: '2026-07-31',
    status: 'Approved'
  },

  {
    id: 2,
    policyName: 'PM Kisan Support Policy',
    schemeName: 'Farmer Assistance Scheme',
    description: 'Financial assistance for eligible farmers.',
    category: 'Agriculture',
    department: 'Agriculture Department',
    ministry: 'Ministry of Agriculture',
    state: 'Andhra Pradesh',
    sector: 'Agriculture',
    publicationDate: '2026-07-20',
    status: 'Pending'
  },

  {
    id: 3,
    policyName: 'Ayushman Bharat',
    schemeName: 'Health Insurance',
    description: 'Health insurance coverage for economically weaker families.',
    category: 'Health',
    department: 'Health Department',
    ministry: 'Ministry of Health',
    state: 'Karnataka',
    sector: 'Healthcare',
    publicationDate: '2026-07-15',
    status: 'Approved'
  },

  {
    id: 4,
    policyName: 'Digital India Mission',
    schemeName: 'Digital Services',
    description: 'Promotes digital governance and online citizen services.',
    category: 'Technology',
    department: 'IT Department',
    ministry: 'Ministry of Electronics',
    state: 'Maharashtra',
    sector: 'Technology',
    publicationDate: '2026-07-12',
    status: 'Approved'
  },

  {
    id: 5,
    policyName: 'Startup India',
    schemeName: 'Startup Support',
    description: 'Encourages entrepreneurship through funding and incubation.',
    category: 'Business',
    department: 'Industry Department',
    ministry: 'Ministry of Commerce',
    state: 'Delhi',
    sector: 'Business',
    publicationDate: '2026-07-10',
    status: 'Pending'
  },

  {
    id: 6,
    policyName: 'Skill India Mission',
    schemeName: 'Skill Development',
    description: 'Provides vocational training to youth.',
    category: 'Employment',
    department: 'Skill Development Department',
    ministry: 'Ministry of Skill Development',
    state: 'Tamil Nadu',
    sector: 'Employment',
    publicationDate: '2026-07-08',
    status: 'Approved'
  },

  {
    id: 7,
    policyName: 'National Solar Mission',
    schemeName: 'Solar Energy',
    description: 'Promotes renewable solar energy projects.',
    category: 'Energy',
    department: 'Energy Department',
    ministry: 'Ministry of Renewable Energy',
    state: 'Rajasthan',
    sector: 'Energy',
    publicationDate: '2026-07-05',
    status: 'Rejected'
  },

  {
    id: 8,
    policyName: 'PM Awas Yojana',
    schemeName: 'Housing Scheme',
    description: 'Affordable housing assistance for eligible families.',
    category: 'Housing',
    department: 'Housing Department',
    ministry: 'Ministry of Housing',
    state: 'Gujarat',
    sector: 'Housing',
    publicationDate: '2026-07-03',
    status: 'Approved'
  },

  {
    id: 9,
    policyName: 'Jal Jeevan Mission',
    schemeName: 'Rural Water Supply',
    description: 'Provides tap water connections to rural households.',
    category: 'Water',
    department: 'Water Resources Department',
    ministry: 'Ministry of Jal Shakti',
    state: 'Madhya Pradesh',
    sector: 'Infrastructure',
    publicationDate: '2026-07-01',
    status: 'Pending'
  },

  {
    id: 10,
    policyName: 'National Food Security Mission',
    schemeName: 'Food Security',
    description: 'Improves food grain production and distribution.',
    category: 'Food',
    department: 'Food Department',
    ministry: 'Ministry of Agriculture',
    state: 'Punjab',
    sector: 'Agriculture',
    publicationDate: '2026-06-28',
    status: 'Approved'
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