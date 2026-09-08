import { Injectable } from '@angular/core';

import { Policy } from '../../features/policy/models/policy.model';
import { PolicyFilter } from '../../features/policy/models/policy-filter.model';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  filterPolicies(
    policies: Policy[],
    filter: PolicyFilter
  ): Policy[] {

    let filtered = [...policies];

    const keyword = filter.keyword.trim().toLowerCase();
    const department = filter.department.trim().toLowerCase();
    const state = filter.state.trim().toLowerCase();
    const category = filter.category.trim().toLowerCase();
    const status = filter.status.trim().toLowerCase();
    const publicationDate = filter.publicationDate.trim();

    /*
     * Keyword search
     *
     * Searches actual policy fields instead of
     * legacy compatibility fields.
     */
    if (keyword) {

      filtered = filtered.filter(policy => {

        const searchableText = [
          policy.title,
          policy.department,
          policy.state,
          policy.category,
          policy.ministry,
          policy.status
        ]
          .filter(value => value != null)
          .join(' ')
          .toLowerCase();

        return searchableText.includes(keyword);
      });

    }


    /*
     * Department
     */
    if (department) {

      filtered = filtered.filter(policy =>
        (policy.department ?? '')
          .toLowerCase()
          .includes(department)
      );

    }


    /*
     * State
     */
    if (state) {

      filtered = filtered.filter(policy =>
        (policy.state ?? '')
          .toLowerCase()
          .includes(state)
      );

    }


    /*
     * Category
     */
    if (category) {

      filtered = filtered.filter(policy =>
        (policy.category ?? '')
          .toLowerCase()
          .includes(category)
      );

    }


    /*
     * Status
     */
    if (status) {

      filtered = filtered.filter(policy =>
        (policy.status ?? '')
          .toLowerCase() === status
      );

    }


    /*
     * Publication Date
     */
    if (publicationDate) {

      filtered = filtered.filter(policy => {

        if (!policy.published_date) {
          return false;
        }

        return this.normalizeDate(policy.published_date) === publicationDate;

      });

    }

    return filtered;
  }


  private normalizeDate(date: string): string {

    /*
     * Handles:
     * 2026-08-10
     * 2026-08-10T00:00:00
     * 2026-08-10T00:00:00.000Z
     */

    return date.substring(0, 10);

  }


  sortPolicies(
    policies: Policy[],
    sortBy: string
  ): Policy[] {

    const sorted = [...policies];

    switch (sortBy) {

      case 'newest':

        sorted.sort((a, b) =>
          this.getDate(b.published_date) -
          this.getDate(a.published_date)
        );

        break;


      case 'oldest':

        sorted.sort((a, b) =>
          this.getDate(a.published_date) -
          this.getDate(b.published_date)
        );

        break;


      case 'nameAsc':

        sorted.sort((a, b) =>
          (a.title || '').localeCompare(b.title || '')
        );

        break;


      case 'nameDesc':

        sorted.sort((a, b) =>
          (b.title || '').localeCompare(a.title || '')
        );

        break;


      case 'status':

        sorted.sort((a, b) =>
          (a.status || '').localeCompare(b.status || '')
        );

        break;

    }

    return sorted;
  }


  private getDate(date: string | null): number {

    if (!date) {
      return 0;
    }

    return new Date(date).getTime();
  }

}