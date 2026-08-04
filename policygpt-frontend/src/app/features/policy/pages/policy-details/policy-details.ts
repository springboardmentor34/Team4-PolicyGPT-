import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-policy-details',
  imports: [CommonModule, MatButtonModule, MatCardModule, MatChipsModule, MatIconModule],
  templateUrl: './policy-details.html',
  styleUrl: './policy-details.css',
})
export class PolicyDetails {
  benefits = [
    'Scholarship support for eligible students',
    'Digital classroom infrastructure funding',
    'Teacher training and institutional grants'
  ];
}
