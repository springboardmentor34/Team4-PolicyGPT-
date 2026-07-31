import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-recommendation-card',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './recommendation-card.html',
  styleUrl: './recommendation-card.css',
})
export class RecommendationCard {

  recommendedSchemes = [

    {
      name: 'PM Kisan Samman Nidhi',
      department: 'Agriculture',
      description: 'Income support for eligible farmers.',
      documents: 'Aadhaar, Bank Passbook, Land Records'
    },

    {
      name: 'Ayushman Bharat',
      department: 'Health',
      description: 'Health insurance coverage for eligible families.',
      documents: 'Aadhaar, Ration Card'
    },

    {
      name: 'Skill India',
      department: 'Skill Development',
      description: 'Free skill development and training programs.',
      documents: 'Aadhaar, Educational Certificates'
    }

  ];

}
