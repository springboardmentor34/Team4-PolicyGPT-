import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-scheme-matching',
  standalone: true,
  imports: [CommonModule, MatChipsModule, MatIconModule],
  templateUrl: './scheme-matching.html',
  styleUrl: './scheme-matching.css',
})
export class SchemeMatching {

  matchedSchemes = [
    {
      name: 'PM Kisan',
      department: 'Agriculture',
      status: 'Eligible'
    },
    {
      name: 'Ayushman Bharat',
      department: 'Health',
      status: 'Eligible'
    },
    {
      name: 'Skill India',
      department: 'Skill Development',
      status: 'Eligible'
    },
    {
      name: 'PM Awas Yojana',
      department: 'Housing',
      status: 'Partially Eligible'
    }
  ];

}
