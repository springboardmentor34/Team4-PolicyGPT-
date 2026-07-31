import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-policy-filter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './policy-filter.html',
  styleUrl: './policy-filter.css'
})
export class PolicyFilter {

  filter = {

    policyName: '',
    schemeName: '',
    department: '',
    state: '',
    sector: '',
    publicationDate: '',
    status: ''

  };

  applyFilters() {

    console.log(this.filter);

  }

}