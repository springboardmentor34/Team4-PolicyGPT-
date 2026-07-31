import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-eligibility-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './eligibility-form.html',
  styleUrl: './eligibility-form.css',
})
export class EligibilityForm {

  form = {
    age: '',
    gender: '',
    income: '',
    occupation: '',
    education: '',
    location: '',
    socialCategory: '',
    disabilityStatus: ''
  };

  checkEligibility() {
    console.log(this.form);
  }

}