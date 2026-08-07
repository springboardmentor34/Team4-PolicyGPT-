import { Injectable } from '@angular/core';
import { Policy } from '../../features/policy/models/policy.model';
import { PolicyFilter } from '../../features/policy/models/policy-filter.model';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor() { }

  filterPolicies(
    policies: Policy[],
    keyword: string,
    filter: PolicyFilter
  ): Policy[] {

    let filtered = [...policies];

    // Keyword Search
    if (keyword.trim()) {

      const search = keyword.toLowerCase();

      filtered = filtered.filter(policy =>

        policy.policyName.toLowerCase().includes(search) ||

        policy.schemeName.toLowerCase().includes(search) ||

        policy.department.toLowerCase().includes(search) ||

        policy.ministry.toLowerCase().includes(search) ||

        policy.state.toLowerCase().includes(search) ||

        policy.sector.toLowerCase().includes(search) ||

        policy.category.toLowerCase().includes(search)

      );

    }

    // Advanced Filters

    if (filter.policyName)
      filtered = filtered.filter(p =>
        p.policyName.toLowerCase().includes(filter.policyName.toLowerCase()));

    if (filter.schemeName)
      filtered = filtered.filter(p =>
        p.schemeName.toLowerCase().includes(filter.schemeName.toLowerCase()));

    if (filter.department)
      filtered = filtered.filter(p =>
        p.department === filter.department);

    if (filter.ministry)
      filtered = filtered.filter(p =>
        p.ministry === filter.ministry);

    if (filter.state)
      filtered = filtered.filter(p =>
        p.state === filter.state);

    if (filter.sector)
      filtered = filtered.filter(p =>
        p.sector === filter.sector);

    if (filter.status)
      filtered = filtered.filter(p =>
        p.status === filter.status);

    if (filter.publicationDate)
      filtered = filtered.filter(p =>
        p.publicationDate === filter.publicationDate);

    return filtered;

  }
  sortPolicies(
  policies: Policy[],
  sortBy: string
): Policy[] {

  const sorted = [...policies];

  switch (sortBy) {

    case 'newest':

      sorted.sort((a, b) =>
        new Date(b.publicationDate).getTime() -
        new Date(a.publicationDate).getTime()
      );

      break;

    case 'oldest':

      sorted.sort((a, b) =>
        new Date(a.publicationDate).getTime() -
        new Date(b.publicationDate).getTime()
      );

      break;

    case 'nameAsc':

      sorted.sort((a, b) =>
        a.policyName.localeCompare(b.policyName)
      );

      break;

    case 'nameDesc':

      sorted.sort((a, b) =>
        b.policyName.localeCompare(a.policyName)
      );

      break;

    case 'status':

      sorted.sort((a, b) =>
        a.status.localeCompare(b.status)
      );

      break;

  }

  return sorted;

}

}