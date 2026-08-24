import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-researcher',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './researcher.html',
  styleUrl: './researcher.css',
})
export class Researcher {
  constructor(private router: Router) {}

  navigate(route: string): void {
    this.router.navigate([route]);
  }
}