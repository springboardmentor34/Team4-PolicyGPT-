import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { PolicyFilter as PolicyFilterModel } from '../../models/policy-filter.model';

@Component({
  selector: 'app-policy-filter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './policy-filter.html',
  styleUrl: './policy-filter.css'
})
export class PolicyFilterComponent {

  @Output()
  filterApplied = new EventEmitter<PolicyFilterModel>();

  filter: PolicyFilterModel = {
    policyName: '',
    schemeName: '',
    department: '',
    ministry: '',
    state: '',
    sector: '',
    publicationDate: '',
    status: ''
  };

  applyFilters(): void {
    this.filterApplied.emit({ ...this.filter });
  }

}