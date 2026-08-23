import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Auth } from '../../../../core/services/auth';
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
  ) {
    this.currentRole = this.normalizeRole(
      this.auth.getRoleFromToken()
    );

    this.applyRolePermissions();
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
        report.id === 'scheme'
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
        report.id === 'analytics'
      );
    }

    if (this.isOrganization()) {
      return (
        report.id === 'policy' ||
        report.id === 'scheme'
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

    /*
     * Existing frontend-only simulation preserved.
     */
    window.setTimeout(() => {

      this.recentReports = this.recentReports.map(
        (item) => {

          if (item.id === reportId) {
            return {
              ...item,
              status: 'Ready',
            };
          }

          return item;
        },
      );

      this.isGenerating = false;

      this.cdr.detectChanges();

    }, 1500);
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

    this.previewData = this.buildReportPreview(
      this.selectedReport,
    );

    this.isPreviewOpen = true;

    this.cdr.detectChanges();
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

    const preview = this.buildReportPreview(report);

    if (format === 'PDF') {
      this.exportPdf(preview);
      return;
    }

    this.exportExcel(preview);
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

    if (!report) {
      return;
    }

    if (!this.canAccessReport(report)) {
      return;
    }

    const preview = this.buildReportPreview(report);

    this.exportPdf(preview);
  }

  // ============================================================
  // PDF EXPORT
  // ============================================================

  private exportPdf(preview: ReportPreview): void {

    const document = new jsPDF();

    const pageWidth =
      document.internal.pageSize.getWidth();

    document.setFont('helvetica', 'bold');
    document.setFontSize(18);
    document.text('PolicyGPT', 20, 20);

    document.setFontSize(14);
    document.text(preview.title, 20, 34);

    document.setFont('helvetica', 'normal');
    document.setFontSize(10);

    document.text(
      `Report Type: ${preview.type}`,
      20,
      48,
    );

    document.text(
      `Reporting Period: ${preview.reportingPeriod}`,
      20,
      56,
    );

    document.text(
      `Generated On: ${preview.generatedOn}`,
      20,
      64,
    );

    document.setFontSize(11);

    const descriptionLines =
      document.splitTextToSize(
        preview.description,
        pageWidth - 40,
      );

    document.text(
      descriptionLines,
      20,
      78,
    );

    let currentY = 105;

    document.setFont('helvetica', 'bold');
    document.setFontSize(12);

    document.text(
      'Key Metrics',
      20,
      currentY,
    );

    currentY += 12;

    document.setFont('helvetica', 'normal');
    document.setFontSize(10);

    preview.metrics.forEach((metric) => {

      document.text(
        `${metric.label}: ${metric.value}`,
        25,
        currentY,
      );

      currentY += 10;

    });

    currentY += 12;

    document.setFontSize(9);

    const note =
      'This report was generated using the current PolicyGPT frontend reporting dataset. Live reporting data will be connected when the reporting API is available.';

    const noteLines =
      document.splitTextToSize(
        note,
        pageWidth - 40,
      );

    document.text(
      noteLines,
      20,
      currentY,
    );

    document.save(
      `${this.getSafeFileName(preview.title)}.pdf`,
    );
  }

  // ============================================================
  // EXCEL EXPORT
  // ============================================================

  private exportExcel(preview: ReportPreview): void {

    const reportInformation = [
      ['PolicyGPT Report'],
      [],
      ['Report Title', preview.title],
      ['Report Type', preview.type],
      ['Reporting Period', preview.reportingPeriod],
      ['Generated On', preview.generatedOn],
      [],
      ['Description', preview.description],
    ];

    const metrics = [
      ['Metric', 'Value'],
      ...preview.metrics.map((metric) => [
        metric.label,
        metric.value,
      ]),
    ];

    const workbook = XLSX.utils.book_new();

    const reportSheet =
      XLSX.utils.aoa_to_sheet(
        reportInformation,
      );

    const metricsSheet =
      XLSX.utils.aoa_to_sheet(
        metrics,
      );

    reportSheet['!cols'] = [
      { wch: 24 },
      { wch: 65 },
    ];

    metricsSheet['!cols'] = [
      { wch: 32 },
      { wch: 22 },
    ];

    XLSX.utils.book_append_sheet(
      workbook,
      reportSheet,
      'Report',
    );

    XLSX.utils.book_append_sheet(
      workbook,
      metricsSheet,
      'Key Metrics',
    );

    XLSX.writeFile(
      workbook,
      `${this.getSafeFileName(preview.title)}.xlsx`,
    );
  }

  // ============================================================
  // REPORT PREVIEW DATA
  // ============================================================

  private buildReportPreview(
    report: ReportType,
  ): ReportPreview {

    const metricsByReport: Record<
      string,
      ReportMetric[]
    > = {

      policy: [
        {
          label: 'Total Policies',
          value: '320',
          icon: 'description',
        },
        {
          label: 'Policy Downloads',
          value: '14,560',
          icon: 'download',
        },
        {
          label: 'Active Categories',
          value: '18',
          icon: 'category',
        },
        {
          label: 'Recently Updated',
          value: '42',
          icon: 'update',
        },
      ],

      scheme: [
        {
          label: 'Total Schemes',
          value: '186',
          icon: 'account_balance_wallet',
        },
        {
          label: 'Scheme Applications',
          value: '9,820',
          icon: 'assignment',
        },
        {
          label: 'Active Schemes',
          value: '142',
          icon: 'verified',
        },
        {
          label: 'New This Month',
          value: '12',
          icon: 'add_circle_outline',
        },
      ],

      'user-activity': [
        {
          label: 'Total Users',
          value: '1,250',
          icon: 'group',
        },
        {
          label: 'New Registrations',
          value: '1,320',
          icon: 'person_add',
        },
        {
          label: 'Active Sessions',
          value: '486',
          icon: 'login',
        },
        {
          label: 'Reports Generated',
          value: '78',
          icon: 'assessment',
        },
      ],

      department: [
        {
          label: 'Departments Covered',
          value: '24',
          icon: 'business',
        },
        {
          label: 'Policies Managed',
          value: '320',
          icon: 'description',
        },
        {
          label: 'Department Activities',
          value: '2,840',
          icon: 'timeline',
        },
        {
          label: 'Active Departments',
          value: '21',
          icon: 'verified',
        },
      ],

      analytics: [
        {
          label: 'Policy Downloads',
          value: '14,560',
          icon: 'download',
        },
        {
          label: 'Scheme Applications',
          value: '9,820',
          icon: 'assignment',
        },
        {
          label: 'New Registrations',
          value: '1,320',
          icon: 'person_add',
        },
        {
          label: 'Reports Generated',
          value: '78',
          icon: 'assessment',
        },
      ],
    };

    return {
      title: report.title,
      description: report.description,
      type: this.getReportTypeLabel(report),
      reportingPeriod: 'August 2026',
      generatedOn: this.getTodayDate(),
      metrics: metricsByReport[report.id] ?? [],
    };
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