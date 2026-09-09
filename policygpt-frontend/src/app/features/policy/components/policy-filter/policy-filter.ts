import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { PolicyFilter as PolicyFilterModel } from '../../models/policy-filter.model';
import { Policy } from '../../models/policy.model';
@Component({
  selector: 'app-policy-filter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './policy-filter.html',
  styleUrl: './policy-filter.css'
})
export class PolicyFilterComponent implements OnChanges {

  @Input()
  policies: Policy[] = [];

  @Output()
  filterApplied = new EventEmitter<PolicyFilterModel>();

  @Output()
  filtersCleared = new EventEmitter<void>();

  filter: PolicyFilterModel = {
    keyword: '',
    department: '',
    state: '',
    category: '',
    status: '',
    publicationDate: ''
  };

  statuses: string[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['policies']) {
      this.loadStatuses();
    }
  }

  private loadStatuses(): void {
    this.statuses = [
      ...new Set(
        this.policies
          .map(policy => policy.status)
          .filter(
            (status): status is string =>
              typeof status === 'string' && status.trim().length > 0
          )
          .map(status => status.trim())
      )
    ].sort((a, b) => a.localeCompare(b));
  }

  applyFilters(): void {
    this.filterApplied.emit({
      ...this.filter,
      keyword: this.filter.keyword.trim(),
      department: this.filter.department.trim(),
      state: this.filter.state.trim(),
      category: this.filter.category.trim()
    });
  }

  clearFilters(): void {
    this.filter = {
      keyword: '',
      department: '',
      state: '',
      category: '',
      status: '',
      publicationDate: ''
    };

    this.filtersCleared.emit();
  }
}