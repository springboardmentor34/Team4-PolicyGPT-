import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-policy-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './policy-search.html',
  styleUrl: './policy-search.css'
})
export class PolicySearch {

  keyword = '';

  searchPolicy() {
    console.log(this.keyword);
  }

}