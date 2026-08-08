import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-policy-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule
  ],
  templateUrl: './policy-toolbar.html',
  styleUrl: './policy-toolbar.css'
})
export class PolicyToolbar {

  @Output()
  sortChanged = new EventEmitter<string>();

  sortBy = 'newest';

  changeSort(): void {
    this.sortChanged.emit(this.sortBy);
  }

}