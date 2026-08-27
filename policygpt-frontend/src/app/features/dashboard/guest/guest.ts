import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-guest',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './guest.html',
  styleUrl: './guest.css',
})
export class Guest {}