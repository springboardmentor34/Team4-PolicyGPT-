import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-organization',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './organization.html',
  styleUrl: './organization.css',
})
export class Organization {
  constructor(private router: Router) {}

  navigate(route: string): void {
    this.router.navigate([route]);
  }
}