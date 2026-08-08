import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  Scheme,
  SchemeService,
} from '../../../../core/services/scheme.service';

@Component({
  selector: 'app-scheme-list',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './scheme-list.html',
  styleUrl: './scheme-list.css',
})
export class SchemeList implements OnInit {
  private readonly schemeService = inject(SchemeService);
  private readonly changeDetector = inject(ChangeDetectorRef);

  schemes: Scheme[] = [];
  totalSchemes = 0;
  loading = false;

  keyword = '';
  department = '';
  state = '';
  category = '';
  status = '';

  ngOnInit(): void {
    this.loadSchemes();
  }

  loadSchemes(): void {
    this.loading = true;

    this.schemeService.getSchemes(0, 100).subscribe({
      next: (response) => {
        console.log('Schemes Loaded:', response);

        this.schemes = response.items;
        this.totalSchemes = response.total;
        this.loading = false;

        this.changeDetector.detectChanges();
      },

      error: (error) => {
        console.error('Failed to load schemes:', error);

        this.schemes = [];
        this.totalSchemes = 0;
        this.loading = false;

        this.changeDetector.detectChanges();
      },
    });
  }

  searchSchemes(): void {
    this.loading = true;

    this.schemeService
      .searchSchemes({
        keyword: this.keyword,
        department: this.department,
        state: this.state,
        category: this.category,
        status: this.status,
      })
      .subscribe({
        next: (response) => {
          console.log('Scheme Search Results:', response);

          this.schemes = response.items;
          this.totalSchemes = response.total;
          this.loading = false;

          this.changeDetector.detectChanges();
        },

        error: (error) => {
          console.error('Scheme search failed:', error);

          this.schemes = [];
          this.totalSchemes = 0;
          this.loading = false;

          this.changeDetector.detectChanges();
        },
      });
  }

  clearFilters(): void {
    this.keyword = '';
    this.department = '';
    this.state = '';
    this.category = '';
    this.status = '';

    this.loadSchemes();
  }
}