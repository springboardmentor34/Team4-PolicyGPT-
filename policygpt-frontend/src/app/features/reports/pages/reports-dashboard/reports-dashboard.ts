import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { forkJoin } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { Auth } from '../../../../core/services/auth';
import { ReportsService } from '../../services/reports.service';
import { AnalyticsService } from '../../../../core/services/analytics.service';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';

interface ReportType {
  id: string;
  title: string;
  description: string;
  icon: string;
  available: boolean;
}

interface ReportRecord {
  id: number;
  reportTypeId: string;
  name: string;
  type: string;
  generatedOn: string;
  status: 'Ready' | 'Generating';
}

interface ReportMetric {
  label: string;
  value: string;
  icon: string;
}

interface ReportPreview {
  title: string;
  description: string;
  type: string;
  reportingPeriod: string;
  generatedOn: string;
  metrics: ReportMetric[];
  records?: Array<Record<string, unknown>>;
}

@Component({
  selector: 'app-reports-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './reports-dashboard.html',
  styleUrl: './reports-dashboard.css',
})
export class ReportsDashboard {

  currentRole: string | null = null;

  selectedReportType = '';

  isGenerating = false;

  isPreviewOpen = false;

  previewData: ReportPreview | null = null;

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
      id: 1,
      reportTypeId: 'policy',
      name: 'Policy Repository Summary',
      type: 'Policy Report',
      generatedOn: '18 Aug 2026',
      status: 'Ready',
    },
    {
      id: 2,
      reportTypeId: 'department',
      name: 'Department Performance Report',
      type: 'Department Report',
      generatedOn: '17 Aug 2026',
      status: 'Ready',
    },
    {
      id: 3,
      reportTypeId: 'analytics',
      name: 'Platform Usage Summary',
      type: 'Analytics Report',
      generatedOn: '16 Aug 2026',
      status: 'Ready',
    },
  ];

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly auth: Auth,
    private readonly reportsService: ReportsService,
      private readonly analyticsService: AnalyticsService,
  ) {
    this.currentRole = this.normalizeRole(
      this.auth.getRoleFromToken()
    );

    this.applyRolePermissions();
    this.loadRecentReports();
  }

  private loadRecentReports(): void {
    this.reportsService.list().subscribe({
      next: reports => {
        this.recentReports = reports.map((report, index) => ({
          id: index + 1,
          reportTypeId: this.toFrontendReportType(report.report_type),
          name: this.toFrontendReportType(report.report_type),
          type: report.report_type,
          generatedOn: new Date(report.created_at).toLocaleDateString('en-IN'),
          status: 'Ready',
        }));
        this.cdr.detectChanges();
      },
      error: () => undefined,
    });
  }

  private toFrontendReportType(reportType: string): string {
    return reportType === 'policy_summary' ? 'policy' :
      reportType === 'department_summary' ? 'department' :
        reportType === 'user_summary' ? 'user-activity' :
          reportType === 'scheme_summary' ? 'scheme' : 'analytics';
  }

  private toApiReportType(reportType: string): string {
    return reportType === 'policy' ? 'policy_summary' :
      reportType === 'department' ? 'department_summary' :
        reportType === 'user-activity' ? 'user_summary' :
          reportType === 'scheme' ? 'scheme_summary' : 'usage';
  }

  // ============================================================
  // ROLE HELPERS
  // ============================================================

  private normalizeRole(role: string | null): string | null {
    if (!role) {
      return null;
    }

    const normalized = role
      .trim()
      .toLowerCase()
      .replace(/[\s-]+/g, '_');

    switch (normalized) {
      case 'admin':
      case 'administrator':
        return 'admin';

      case 'official':
      case 'government_official':
      case 'governmentofficial':
        return 'official';

      case 'citizen':
      case 'public_user':
      case 'publicuser':
        return 'citizen';

      case 'researcher':
        return 'researcher';

      case 'organization':
      case 'organisation':
        return 'organization';

      case 'guest':
      case 'guest_user':
      case 'guestuser':
        return 'guest';

      default:
        return normalized;
    }
  }

  isAdmin(): boolean {
    return this.currentRole === 'admin';
  }

  isOfficial(): boolean {
    return this.currentRole === 'official';
  }

  isCitizen(): boolean {
    return this.currentRole === 'citizen';
  }

  isResearcher(): boolean {
    return this.currentRole === 'researcher';
  }

  isOrganization(): boolean {
    return this.currentRole === 'organization';
  }

  isGuest(): boolean {
    return this.currentRole === 'guest';
  }

  // ============================================================
  // REPORT PERMISSIONS
  // ============================================================

  /**
   * Controls which report types each role can access.
   *
   * ADMINISTRATOR
   * - Full access
   * - All report types
   * - Generate
   * - Preview
   * - PDF
   * - Excel
   *
   * GOVERNMENT OFFICIAL
   * - Department-specific reports
   * - Department report access
   * - Policy/Scheme reports relevant to department
   * - Generate
   * - Preview
   * - Export
   *
   * CITIZEN
   * - Personal/public policy and scheme summaries
   * - No administrative/user-activity reports
   * - No department reports
   *
   * RESEARCHER
   * - Public reports only
   * - Read-only
   * - No generation
   * - No export
   *
   * ORGANIZATION
   * - Existing policy/scheme reports applicable to organization-level
   *   access
   * - No administrative/user-activity reports
   * - No department reports
   *
   * GUEST
   * - No access
   */
  private applyRolePermissions(): void {

    const role = this.currentRole;

    // Unknown / guest role gets no report types.
    if (!role || role === 'guest') {
      this.reportTypes = [];
      this.selectedReportType = '';
      return;
    }

    // ADMINISTRATOR
    // Full platform access.
    if (role === 'admin') {
      return;
    }

    // GOVERNMENT OFFICIAL
    // Department-specific access.
    if (role === 'official') {
      this.reportTypes = this.reportTypes.filter(
        (report) =>
          report.id === 'department' ||
          report.id === 'policy' ||
          report.id === 'scheme',
      );

      this.ensureValidSelectedReport();
      return;
    }

    // CITIZEN
    // Personal/public policy and scheme summaries only.
    if (role === 'citizen') {
      this.reportTypes = this.reportTypes.filter(
        (report) =>
          report.id === 'policy' ||
          report.id === 'scheme',
      );

      this.ensureValidSelectedReport();
      return;
    }

    // RESEARCHER
    // Public reports only.
    // Analytics is retained because it is public/read-only trend data.
    if (role === 'researcher') {
      this.reportTypes = this.reportTypes.filter(
        (report) =>
          report.id === 'policy' ||
          report.id === 'scheme' ||
          report.id === 'analytics',
      );

      this.ensureValidSelectedReport();
      return;
    }

    // ORGANIZATION
    // Organization-level access using existing report categories.
    if (role === 'organization') {
      this.reportTypes = this.reportTypes.filter(
        (report) =>
          report.id === 'policy' ||
          report.id === 'scheme',
      );

      this.ensureValidSelectedReport();
      return;
    }

    // Unknown role.
    this.reportTypes = [];
    this.selectedReportType = '';
  }

  /**
   * Ensures that an already selected report does not remain
   * selected after role filtering.
   */
  private ensureValidSelectedReport(): void {
    const selectedExists = this.reportTypes.some(
      (report) => report.id === this.selectedReportType,
    );

    if (!selectedExists) {
      this.selectedReportType = '';
    }
  }

  /**
   * Determines whether the current user can generate reports.
   */
  canGenerateReports(): boolean {
    return (
      this.isAdmin() ||
      this.isOfficial() ||
      this.isCitizen() ||
      this.isOrganization()
    );
  }

  /**
   * Researchers have read-only access.
   */
  isReadOnly(): boolean {
    return this.isResearcher();
  }

  /**
   * Determines whether the current user can export reports.
   */
  canExportReports(): boolean {
    return (
      this.isAdmin() ||
      this.isOfficial() ||
      this.isCitizen() ||
      this.isOrganization()
    );
  }

  /**
   * Determines whether a specific report is allowed for the current role.
   */
  canAccessReport(report: ReportType): boolean {

    if (this.isAdmin()) {
      return true;
    }

    if (this.isOfficial()) {
      return (
        report.id === 'department' ||
        report.id === 'policy' ||
        report.id === 'scheme' ||
        report.id === 'user-activity'
      );
    }

    if (this.isCitizen()) {
      return (
        report.id === 'policy' ||
        report.id === 'scheme'
      );
    }

    if (this.isResearcher()) {
      return (
        report.id === 'policy' ||
        report.id === 'scheme' ||
        report.id === 'analytics' ||
        report.id === 'user-activity'
      );
    }

    if (this.isOrganization()) {
      return (
        report.id === 'policy' ||
        report.id === 'scheme' ||
        report.id === 'user-activity'
      );
    }

    return false;
  }

  // ============================================================
  // AVAILABLE REPORT TYPES
  // ============================================================

  get availableReportTypes(): ReportType[] {
    return this.reportTypes.filter(
      (report) =>
        report.available &&
        this.canAccessReport(report),
    );
  }

  // ============================================================
  // SELECT REPORT
  // ============================================================

  selectReportType(reportId: string): void {

    if (this.isGenerating) {
      return;
    }

    const report = this.reportTypes.find(
      (item) => item.id === reportId,
    );

    if (!report) {
      return;
    }

    if (!this.canAccessReport(report)) {
      return;
    }

    this.selectedReportType = reportId;
  }

  // ============================================================
  // GENERATE REPORT
  // ============================================================

generateReport(): void {
  if (!this.canGenerateReports()) {
    return;
  }

  if (!this.selectedReportType || this.isGenerating) {
    return;
  }

  const report = this.selectedReport;

  if (!report || !this.canAccessReport(report)) {
    return;
  }

  /*
   * Analytics reports are generated from the real analytics
   * endpoints instead of /reports with report_type=usage.
   */
  if (report.id === 'analytics') {
    this.generateAnalyticsReport();
    return;
  }

  this.isGenerating = true;
  this.cdr.detectChanges();

  const reportId = Date.now();

  const generatingReport: ReportRecord = {
    id: reportId,
    reportTypeId: report.id,
    name: report.title,
    type: this.getReportTypeLabel(report),
    generatedOn: this.getTodayDate(),
    status: 'Generating',
  };

  this.recentReports = [
    generatingReport,
    ...this.recentReports,
  ];

  this.cdr.detectChanges();

  this.reportsService
    .create(this.toApiReportType(report.id), 'csv')
    .subscribe({
      next: () => {
        this.recentReports = this.recentReports.map(item =>
          item.id === reportId
            ? { ...item, status: 'Ready' }
            : item,
        );

        this.isGenerating = false;
        this.cdr.detectChanges();
      },

      error: () => {
        this.recentReports =
          this.recentReports.filter(
            item => item.id !== reportId,
          );

        this.isGenerating = false;
        this.cdr.detectChanges();
      },
    });
}

private generateAnalyticsReport(): void {
  this.isGenerating = true;
  this.cdr.detectChanges();

  const filters = {
    period: '30d',
    start_date: null,
    end_date: null,
    department: null,
    category: null,
  };

  forkJoin({
    summary: this.analyticsService.getSummary(filters),
    policyStats: this.analyticsService.getPolicyStats(filters),
    engagement: this.analyticsService.getEngagementSummary(filters),
    eligibility: this.analyticsService.getEligibilityStats(filters),
  }).subscribe({
    next: (data) => {
      const report = this.reportTypes.find(
        item => item.id === 'analytics',
      );

      if (!report) {
        this.isGenerating = false;
        return;
      }

      const analyticsRows =
        this.buildAnalyticsRows(data);

      const preview: ReportPreview = {
        title: 'Analytics Reports',
        description:
          'Platform trends, policy usage, citizen engagement and eligibility analytics.',
        type: 'Analytics Report',
        reportingPeriod: 'Last 30 Days',
        generatedOn: this.getTodayDate(),
        metrics: this.buildAnalyticsMetrics(data),
        records: analyticsRows,
      };

      /*
       * Generate both usable exports locally.
       * This avoids the broken /reports?report_type=usage endpoint.
       */
      this.exportPdf(preview);
      this.exportExcel(preview);

      const reportId = Date.now();

      this.recentReports = [
        {
          id: reportId,
          reportTypeId: 'analytics',
          name: 'Platform Analytics Report',
          type: 'Analytics Report',
          generatedOn: this.getTodayDate(),
          status: 'Ready',
        },
        ...this.recentReports,
      ];

      this.isGenerating = false;
      this.cdr.detectChanges();
    },

    error: () => {
      this.isGenerating = false;
      this.cdr.detectChanges();
    },
  });
}

private buildAnalyticsMetrics(data: {
  summary: any;
  policyStats: any;
  engagement: any;
  eligibility: any;
}): ReportMetric[] {
  return [
    {
      label: 'Total Policies',
      value: String(data.summary?.total_policies ?? 0),
      icon: 'description',
    },
    {
      label: 'Active Schemes',
      value: String(data.summary?.active_schemes ?? 0),
      icon: 'verified',
    },
    {
      label: 'Users',
      value: String(data.summary?.users ?? 0),
      icon: 'groups',
    },
    {
      label: 'Citizen Engagement',
      value: String(data.summary?.total_engagement ?? 0),
      icon: 'insights',
    },
    {
      label: 'Applications',
      value: String(data.summary?.applications ?? 0),
      icon: 'assignment',
    },
    {
      label: 'Feedback',
      value: String(data.summary?.feedback ?? 0),
      icon: 'feedback',
    },
    {
      label: 'Policy Views',
      value: String(data.engagement?.views ?? 0),
      icon: 'visibility',
    },
    {
      label: 'Policy Searches',
      value: String(data.engagement?.searches ?? 0),
      icon: 'search',
    },
  ];
}

private buildAnalyticsRows(data: {
  summary: any;
  policyStats: any;
  engagement: any;
  eligibility: any;
}): Array<Record<string, unknown>> {
  const rows: Array<Record<string, unknown>> = [];

  rows.push({
    metric: 'Total Policies',
    value: data.summary?.total_policies ?? 0,
    category: 'Policy',
  });

  rows.push({
    metric: 'Active Schemes',
    value: data.summary?.active_schemes ?? 0,
    category: 'Scheme',
  });

  rows.push({
    metric: 'Users',
    value: data.summary?.users ?? 0,
    category: 'Users',
  });

  rows.push({
    metric: 'Total Engagement',
    value: data.summary?.total_engagement ?? 0,
    category: 'Engagement',
  });

  rows.push({
    metric: 'Applications',
    value: data.summary?.applications ?? 0,
    category: 'Applications',
  });

  rows.push({
    metric: 'Feedback',
    value: data.summary?.feedback ?? 0,
    category: 'Feedback',
  });

  rows.push({
    metric: 'Views',
    value: data.engagement?.views ?? 0,
    category: 'Engagement',
  });

  rows.push({
    metric: 'Searches',
    value: data.engagement?.searches ?? 0,
    category: 'Engagement',
  });

  rows.push({
    metric: 'Saves',
    value: data.engagement?.saves ?? 0,
    category: 'Engagement',
  });

  rows.push({
    metric: 'Eligibility Records',
    value: this.countEligibilityRecords(
      data.eligibility,
    ),
    category: 'Eligibility',
  });

  return rows;
}

private countEligibilityRecords(
  eligibility: any,
): number {
  if (!eligibility) {
    return 0;
  }

  return [
    ...(eligibility.age_groups ?? []),
    ...(eligibility.gender_distribution ?? []),
    ...(eligibility.social_categories ?? []),
    ...(eligibility.disability ?? []),
  ].reduce(
    (total: number, item: any) =>
      total + (Number(item?.count) || 0),
    0,
  );
}

  // ============================================================
  // PREVIEW
  // ============================================================

 previewReport(): void {
  if (!this.selectedReport) {
    return;
  }

  if (!this.canAccessReport(this.selectedReport)) {
    return;
  }

  if (this.isGenerating) {
    return;
  }

  /*
   * Analytics has its own API endpoints.
   */
  if (this.selectedReport.id === 'analytics') {
    this.previewAnalyticsReport();
    return;
  }

  this.reportsService
    .preview(
      this.toApiReportType(
        this.selectedReport.id,
      ),
    )
    .subscribe({
      next: response => {
        this.previewData =
          this.buildReportPreview(
            this.selectedReport!,
            response.data,
          );

        this.isPreviewOpen = true;
        this.cdr.detectChanges();
      },

      error: () => {
        this.previewData =
          this.buildReportPreview(
            this.selectedReport!,
            [],
          );

        this.isPreviewOpen = true;
        this.cdr.detectChanges();
      },
    });
}

private previewAnalyticsReport(): void {
  const filters = {
    period: '30d',
    start_date: null,
    end_date: null,
    department: null,
    category: null,
  };

  forkJoin({
    summary: this.analyticsService.getSummary(filters),
    policyStats: this.analyticsService.getPolicyStats(filters),
    engagement: this.analyticsService.getEngagementSummary(filters),
    eligibility: this.analyticsService.getEligibilityStats(filters),
  }).subscribe({
    next: (data) => {
      const report = this.reportTypes.find(
        item => item.id === 'analytics',
      );

      if (!report) {
        return;
      }

      this.previewData = {
        title: 'Analytics Reports',
        description:
          'Platform trends, policy usage, citizen engagement and eligibility analytics.',
        type: 'Analytics Report',
        reportingPeriod: 'Last 30 Days',
        generatedOn: this.getTodayDate(),
        metrics: this.buildAnalyticsMetrics(data),
        records: this.buildAnalyticsRows(data),
      };

      this.isPreviewOpen = true;
      this.cdr.detectChanges();
    },

    error: () => {
      this.previewData = null;
      this.isPreviewOpen = false;
      this.cdr.detectChanges();
    },
  });
}

  closePreview(): void {

    this.isPreviewOpen = false;

    this.previewData = null;

    this.cdr.detectChanges();
  }

  // ============================================================
  // EXPORT
  // ============================================================

  exportReport(format: 'PDF' | 'Excel'): void {
  if (!this.canExportReports()) {
    return;
  }

  const report = this.selectedReport;

  if (!report || !this.canAccessReport(report)) {
    return;
  }

  if (this.isGenerating) {
    return;
  }

  /*
   * Analytics export uses the real analytics APIs.
   */
  if (report.id === 'analytics') {
    this.exportAnalyticsReport(format);
    return;
  }

  this.reportsService
    .preview(this.toApiReportType(report.id))
    .subscribe({
      next: response => {
        const preview =
          this.buildReportPreview(
            report,
            response.data,
          );

        if (format === 'PDF') {
          this.exportPdf(preview);
        } else {
          this.exportExcel(preview);
        }
      },

      error: () => {
        const preview =
          this.buildReportPreview(
            report,
            [],
          );

        if (format === 'PDF') {
          this.exportPdf(preview);
        } else {
          this.exportExcel(preview);
        }
      },
    });
}
private exportAnalyticsReport(
  format: 'PDF' | 'Excel',
): void {
  const filters = {
    period: '30d',
    start_date: null,
    end_date: null,
    department: null,
    category: null,
  };

  forkJoin({
    summary: this.analyticsService.getSummary(filters),
    policyStats: this.analyticsService.getPolicyStats(filters),
    engagement: this.analyticsService.getEngagementSummary(filters),
    eligibility: this.analyticsService.getEligibilityStats(filters),
  }).subscribe({
    next: (data) => {
      const report = this.reportTypes.find(
        item => item.id === 'analytics',
      );

      if (!report) {
        return;
      }

      const preview: ReportPreview = {
        title: 'Analytics Reports',
        description:
          'Platform trends, policy usage, citizen engagement and eligibility analytics.',
        type: 'Analytics Report',
        reportingPeriod: 'Last 30 Days',
        generatedOn: this.getTodayDate(),
        metrics: this.buildAnalyticsMetrics(data),
        records: this.buildAnalyticsRows(data),
      };

      if (format === 'PDF') {
        this.exportPdf(preview);
      } else {
        this.exportExcel(preview);
      }
    },

    error: () => {
      // Do nothing if analytics data cannot be loaded.
    },
  });
}

  // ============================================================
  // DOWNLOAD EXISTING REPORT
  // ============================================================

  downloadReport(reportRecord: ReportRecord): void {

    if (!this.canExportReports()) {
      return;
    }

    if (reportRecord.status !== 'Ready') {
      return;
    }

    const report = this.reportTypes.find(
      (item) => item.id === reportRecord.reportTypeId,
    );

    if (!report || !this.canAccessReport(report)) {
      return;
    }

    this.reportsService.preview(this.toApiReportType(report.id)).subscribe({
      next: response => {
        const preview = this.buildReportPreview(report, response.data);
        this.exportPdf(preview);
      },
      error: () => {
        const preview = this.buildReportPreview(report, []);
        this.exportPdf(preview);
      }
    });
  }

  // ============================================================
  // PDF EXPORT
  // ============================================================

  private exportPdf(preview: ReportPreview): void {

    const document = new jsPDF();
    const pageWidth = document.internal.pageSize.getWidth();
    const pageHeight = document.internal.pageSize.getHeight();

    // Document Title Header
    document.setFont('helvetica', 'bold');
    document.setFontSize(20);
    document.setTextColor(30, 41, 59);
    document.text('PolicyGPT', 20, 20);

    document.setFontSize(14);
    document.setTextColor(51, 65, 85);
    document.text(preview.title, 20, 32);

    document.setFont('helvetica', 'normal');
    document.setFontSize(10);
    document.setTextColor(100, 116, 139);

    document.text(`Report Type: ${preview.type}`, 20, 44);
    document.text(`Reporting Period: ${preview.reportingPeriod}`, 20, 52);
    document.text(`Generated On: ${preview.generatedOn}`, 20, 60);

    document.setFontSize(10);
    document.setTextColor(71, 85, 105);
    const descriptionLines = document.splitTextToSize(preview.description, pageWidth - 40);
    document.text(descriptionLines, 20, 72);

    let currentY = 90;

    // Key Metrics Section
    document.setFont('helvetica', 'bold');
    document.setFontSize(12);
    document.setTextColor(30, 41, 59);
    document.text('Key Summary Metrics', 20, currentY);

    currentY += 8;

    document.setFont('helvetica', 'normal');
    document.setFontSize(10);
    document.setTextColor(51, 65, 85);

    preview.metrics.forEach((metric) => {
      document.text(`• ${metric.label}: ${metric.value}`, 25, currentY);
      currentY += 7;
    });

    currentY += 10;

    // Data Table Section
    if (preview.records && preview.records.length > 0) {
      if (currentY > pageHeight - 60) {
        document.addPage();
        currentY = 20;
      }

      document.setFont('helvetica', 'bold');
      document.setFontSize(12);
      document.setTextColor(30, 41, 59);
      document.text('Data Records', 20, currentY);
      currentY += 8;

      // Determine columns based on record keys (excluding raw IDs if cleaner)
      const firstRow = preview.records[0];
      const allKeys = Object.keys(firstRow);
      // Filter out long uuid keys if display names exist
      const displayKeys = allKeys.filter(k => !k.endsWith('_id') || allKeys.length <= 2);
      const activeKeys = displayKeys.length > 0 ? displayKeys : allKeys;

      // Render table header
      document.setFont('helvetica', 'bold');
      document.setFontSize(9);
      document.setFillColor(241, 245, 249);
      document.rect(20, currentY - 5, pageWidth - 40, 8, 'F');
      document.setTextColor(30, 41, 59);

      const colWidth = (pageWidth - 40) / activeKeys.length;
      activeKeys.forEach((key, colIndex) => {
        const headerTitle = key.replace(/_/g, ' ').toUpperCase();
        document.text(headerTitle, 22 + (colIndex * colWidth), currentY);
      });

      currentY += 8;
      document.setFont('helvetica', 'normal');
      document.setFontSize(8);
      document.setTextColor(71, 85, 105);

      preview.records.forEach((row, rowIndex) => {
        if (currentY > pageHeight - 20) {
          document.addPage();
          currentY = 20;

          // Repeat header on new page
          document.setFont('helvetica', 'bold');
          document.setFontSize(9);
          document.setFillColor(241, 245, 249);
          document.rect(20, currentY - 5, pageWidth - 40, 8, 'F');
          document.setTextColor(30, 41, 59);
          activeKeys.forEach((key, colIndex) => {
            document.text(key.replace(/_/g, ' ').toUpperCase(), 22 + (colIndex * colWidth), currentY);
          });
          currentY += 8;
          document.setFont('helvetica', 'normal');
          document.setFontSize(8);
          document.setTextColor(71, 85, 105);
        }

        if (rowIndex % 2 === 1) {
          document.setFillColor(248, 250, 252);
          document.rect(20, currentY - 4, pageWidth - 40, 7, 'F');
        }

        activeKeys.forEach((key, colIndex) => {
          const rawVal = String(row[key] ?? '-');
          const truncated = rawVal.length > 28 ? rawVal.substring(0, 25) + '...' : rawVal;
          document.text(truncated, 22 + (colIndex * colWidth), currentY);
        });

        currentY += 7;
      });
    }

    document.save(`${this.getSafeFileName(preview.title)}.pdf`);
  }

  // ============================================================
  // EXCEL EXPORT
  // ============================================================

  private exportExcel(preview: ReportPreview): void {

    const workbook = XLSX.utils.book_new();

    // Summary Sheet
    const reportInformation = [
      ['PolicyGPT Official Report'],
      [],
      ['Report Title', preview.title],
      ['Report Type', preview.type],
      ['Reporting Period', preview.reportingPeriod],
      ['Generated On', preview.generatedOn],
      [],
      ['Description', preview.description],
      [],
      ['Summary Metrics'],
      ...preview.metrics.map((metric) => [metric.label, metric.value]),
    ];

    const reportSheet = XLSX.utils.aoa_to_sheet(reportInformation);
    reportSheet['!cols'] = [{ wch: 28 }, { wch: 65 }];
    XLSX.utils.book_append_sheet(workbook, reportSheet, 'Summary');

    // Data Records Sheet
    if (preview.records && preview.records.length > 0) {
      const dataSheet = XLSX.utils.json_to_sheet(preview.records);
      XLSX.utils.book_append_sheet(workbook, dataSheet, 'Data Records');
    }

    XLSX.writeFile(workbook, `${this.getSafeFileName(preview.title)}.xlsx`);
  }

  // ============================================================
  // REPORT PREVIEW DATA
  // ============================================================

  private buildReportPreview(
    report: ReportType,
    data?: Array<Record<string, unknown>>,
  ): ReportPreview {

    return {
      title: report.title,
      description: report.description,
      type: this.getReportTypeLabel(report),
      reportingPeriod: 'August 2026',
      generatedOn: this.getTodayDate(),
      metrics: this.buildMetricsFromData(report, data || []),
      records: data || [],
    };
  }

  private buildMetricsFromData(report: ReportType, data: Array<Record<string, unknown>>): ReportMetric[] {
    if (!data || data.length === 0) {
      return [
        { label: `${report.title} Records`, value: '0', icon: report.icon },
        { label: 'Status', value: 'No records found', icon: 'info' }
      ];
    }

    switch (report.id) {
      case 'policy': {
        const total = data.length;
        const approved = data.filter(d => ['approved', 'published'].includes(String(d['status']).toLowerCase())).length;
        const categories = new Set(data.map(d => d['category']).filter(Boolean)).size;
        const depts = new Set(data.map(d => d['department']).filter(Boolean)).size;
        return [
          { label: 'Total Policies', value: String(total), icon: 'description' },
          { label: 'Active Policies', value: String(approved), icon: 'verified' },
          { label: 'Active Categories', value: String(categories), icon: 'category' },
          { label: 'Departments Covered', value: String(depts), icon: 'business' }
        ];
      }

      case 'scheme': {
        const total = data.length;
        const active = data.filter(d => String(d['status']).toLowerCase() === 'active').length;
        const depts = new Set(data.map(d => d['department']).filter(Boolean)).size;
        return [
          { label: 'Total Schemes', value: String(total), icon: 'account_balance_wallet' },
          { label: 'Active Schemes', value: String(active), icon: 'verified' },
          { label: 'Departments Covered', value: String(depts), icon: 'business' }
        ];
      }

      case 'department': {
        const totalDepts = data.length;
        const totalPolicies = data.reduce((acc, d) => acc + (Number(d['policies']) || 0), 0);
        const activePolicies = data.reduce((acc, d) => acc + (Number(d['active_policies']) || 0), 0);
        const totalSchemes = data.reduce((acc, d) => acc + (Number(d['schemes']) || 0), 0);
        return [
          { label: 'Departments Covered', value: String(totalDepts), icon: 'business' },
          { label: 'Policies Managed', value: String(totalPolicies), icon: 'description' },
          { label: 'Active Policies', value: String(activePolicies), icon: 'verified' },
          { label: 'Total Schemes', value: String(totalSchemes), icon: 'account_balance_wallet' }
        ];
      }

      case 'user-activity': {
        const totalUsers = data.reduce((acc, d) => acc + (Number(d['user_count']) || 0), 0);
        const rolesCount = data.length;
        const citizenCount = data.find(d => String(d['role']).toLowerCase() === 'citizen')?.['user_count'] ?? 0;
        return [
          { label: 'Total Users', value: String(totalUsers), icon: 'group' },
          { label: 'User Roles', value: String(rolesCount), icon: 'badge' },
          { label: 'Citizens Registered', value: String(citizenCount), icon: 'person' }
        ];
      }

      case 'analytics': {
        const total = data.length;
        const approved = data.filter(d => String(d['status']).toLowerCase() === 'approved').length;
        const pending = data.filter(d => String(d['status']).toLowerCase() === 'pending').length;
        return [
          { label: 'Total Applications', value: String(total), icon: 'assignment' },
          { label: 'Approved Applications', value: String(approved), icon: 'check_circle' },
          { label: 'Pending Applications', value: String(pending), icon: 'hourglass_top' }
        ];
      }

      default:
        return [
          { label: 'Total Records', value: String(data.length), icon: report.icon },
          { label: 'Generated Data Rows', value: String(data.length), icon: 'table_view' }
        ];
    }
  }

  // ============================================================
  // SELECTED REPORT
  // ============================================================

  get selectedReport(): ReportType | undefined {

    const report =
      this.reportTypes.find(
        (item) =>
          item.id === this.selectedReportType,
      );

    if (!report) {
      return undefined;
    }

    return this.canAccessReport(report)
      ? report
      : undefined;
  }

  // ============================================================
  // HELPERS
  // ============================================================

  private getReportTypeLabel(
    report: ReportType,
  ): string {

    return report.title.replace(
      ' Reports',
      ' Report',
    );
  }

  private getTodayDate(): string {

    return new Intl.DateTimeFormat(
      'en-GB',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      },
    ).format(new Date());
  }

  private getSafeFileName(
    value: string,
  ): string {

    return value
      .replace(/[^a-z0-9]+/gi, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase();
  }
}