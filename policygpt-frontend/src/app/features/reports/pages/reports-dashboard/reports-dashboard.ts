import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

interface ReportType {
  id: string;
  title: string;
  description: string;
  icon: string;
  available: boolean;
}

interface ReportRecord {
  name: string;
  type: string;
  generatedOn: string;
  status: 'Ready' | 'Generating';
}

@Component({
  selector: 'app-reports-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './reports-dashboard.html',
  styleUrl: './reports-dashboard.css',
})
export class ReportsDashboard {
  /**
   * Temporary frontend role.
   *
   * This will later be connected to the existing Auth service.
   * Keeping the report UI independent for now prevents changes
   * to existing authentication code.
   */
  currentRole = 'admin';

  selectedReportType = '';

  isGenerating = false;

  reportTypes: ReportType[] = [
    {
      id: 'policy',
      title: 'Policy Reports',
      description: 'Policy repository status, categories and activity.',
      icon: 'description',
      available: true,
    },
    {
      id: 'scheme',
      title: 'Scheme Reports',
      description: 'Public scheme information, categories and usage.',
      icon: 'account_balance_wallet',
      available: true,
    },
    {
      id: 'user-activity',
      title: 'User Activity Reports',
      description: 'Platform activity and user engagement summaries.',
      icon: 'group',
      available: true,
    },
    {
      id: 'department',
      title: 'Department Reports',
      description: 'Department-level policy and scheme performance.',
      icon: 'business',
      available: true,
    },
    {
      id: 'analytics',
      title: 'Analytics Reports',
      description: 'Platform trends, usage and engagement analytics.',
      icon: 'analytics',
      available: true,
    },
  ];

  recentReports: ReportRecord[] = [
    {
      name: 'Policy Repository Summary',
      type: 'Policy Report',
      generatedOn: '18 Aug 2026',
      status: 'Ready',
    },
    {
      name: 'Department Performance Report',
      type: 'Department Report',
      generatedOn: '17 Aug 2026',
      status: 'Ready',
    },
    {
      name: 'Platform Usage Summary',
      type: 'Analytics Report',
      generatedOn: '16 Aug 2026',
      status: 'Ready',
    },
  ];

  get availableReportTypes(): ReportType[] {
    return this.reportTypes.filter((report) => report.available);
  }

  selectReportType(reportId: string): void {
    this.selectedReportType = reportId;
  }

  generateReport(): void {
    if (!this.selectedReportType || this.isGenerating) {
      return;
    }

    this.isGenerating = true;

    setTimeout(() => {
      this.isGenerating = false;
    }, 1000);
  }

  previewReport(): void {
    if (!this.selectedReportType) {
      return;
    }

    console.log('Preview report:', this.selectedReportType);
  }

  exportReport(format: 'PDF' | 'Excel'): void {
    if (!this.selectedReportType) {
      return;
    }

    console.log(`Export ${format}:`, this.selectedReportType);
  }

  get selectedReport(): ReportType | undefined {
    return this.reportTypes.find(
      (report) => report.id === this.selectedReportType,
    );
  }
}