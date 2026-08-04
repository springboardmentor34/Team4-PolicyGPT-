import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-eligibility-form',
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
