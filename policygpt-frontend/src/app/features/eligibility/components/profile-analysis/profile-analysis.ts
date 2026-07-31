import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-profile-analysis',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-analysis.html',
  styleUrl: './profile-analysis.css',
})
export class ProfileAnalysis {

  profile = {
    ageGroup: '18 - 35 Years',
    incomeGroup: 'Low Income',
    occupation: 'Farmer',
    education: 'Graduate',
    location: 'Telangana'
  };

}