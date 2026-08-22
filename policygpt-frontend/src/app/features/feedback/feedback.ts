import { Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Feedback as FeedbackRecord,
  FeedbackCategory,
  FeedbackService,
  FeedbackStatus,
} from '../../core/services/feedback.service';
import { Auth } from '../../core/services/auth';

interface Faq {
  question: string;
  answer: string;
  open: boolean;
}

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './feedback.html',
  styleUrl: './feedback.css'
})
export class Feedback implements OnInit {

  private readonly feedbackService = inject(FeedbackService);
  private readonly auth = inject(Auth);

  activeSection = 'feedback';

  feedbackType = 'General Feedback';
  rating = 0;
  feedbackText = '';

  issueCategory = 'Technical Issue';
  issueSubject = '';
  issueDescription = '';

  supportSubject = '';
  supportMessage = '';

  successMessage = '';

  faqs: Faq[] = [
    {
      question: 'How do I search for a government policy?',
      answer:
        'Open Policies from the navigation bar and use the available search and filter options.',
      open: false
    },
    {
      question: 'How does the eligibility checker work?',
      answer:
        'Open Eligibility, provide the required information and PolicyGPT will show relevant schemes.',
      open: false
    },
    {
      question: 'How can I report an issue?',
      answer:
        'Open Issue Reporting, select a category and describe the problem you are facing.',
      open: false
    },
    {
      question: 'How can I track my support query?',
      answer:
        'Open Query Resolution to view the status of your submitted requests.',
      open: false
    }
  ];

  tickets: FeedbackRecord[] = [];

  get isStaff(): boolean {
    const role = this.auth.getRoleFromToken();
    return role === 'administrator' || role === 'government_official' ||
      role === 'admin' || role === 'official';
  }

  ngOnInit(): void {
    if (this.isStaff) {
      this.activeSection = 'queries';
    }
    this.loadFeedback();
  }

  setSection(section: string): void {
    this.activeSection = section;
    this.successMessage = '';
  }

  setRating(value: number): void {
    this.rating = value;
  }

  loadFeedback(): void {
    const request = this.isStaff
      ? this.feedbackService.getFeedbackForStaff()
      : this.feedbackService.getMyFeedback();

    request.subscribe({
      next: (feedback) => (this.tickets = feedback),
      error: () => (this.successMessage = 'Unable to load your submitted feedback.')
    });
  }

  updateStatus(ticket: FeedbackRecord, nextStatus: string): void {
    const status = nextStatus as FeedbackStatus;
    this.feedbackService.updateStatus(ticket.feedback_id, status).subscribe({
      next: (updated) => {
        ticket.status = updated.status;
        ticket.resolved_by = updated.resolved_by;
        ticket.resolved_at = updated.resolved_at;
        this.successMessage = 'Feedback status updated successfully.';
      },
      error: () => (this.successMessage = 'Unable to update feedback status.')
    });
  }

  private submit(subject: string, category: FeedbackCategory): void {
    if (!subject.trim()) {
      this.successMessage = 'Please enter the required details.';
      return;
    }

    this.feedbackService.createFeedback({ subject: subject.trim().slice(0, 255), category }).subscribe({
      next: (feedback) => {
        this.tickets = [feedback, ...this.tickets];
        this.successMessage = `Submitted successfully. Tracking ID: ${feedback.feedback_id}`;
        this.activeSection = 'queries';
      },
      error: () => (this.successMessage = 'Unable to submit your request. Please try again.')
    });
  }

  toggleFaq(faq: Faq): void {
    faq.open = !faq.open;
  }

  formatStatus(status: FeedbackRecord['status']): string {
    return status.replace('_', ' ');
  }

  submitFeedback(): void {

    if (!this.rating || !this.feedbackText.trim()) {
      this.successMessage =
        'Please select a rating and enter your feedback.';
      return;
    }

    this.submit(this.feedbackText, this.feedbackType === 'Website Experience' ? 'bug' : 'suggestion');
    this.feedbackText = '';
    this.rating = 0;
  }

  submitIssue(): void {

    if (
      !this.issueSubject.trim() ||
      !this.issueDescription.trim()
    ) {
      this.successMessage =
        'Please enter the issue subject and description.';
      return;
    }

    const category: FeedbackCategory = this.issueCategory === 'Technical Issue' ? 'bug' :
      this.issueCategory === 'Account & Access' ? 'complaint' : 'query';
    this.submit(`${this.issueSubject}: ${this.issueDescription}`, category);
    this.issueSubject = '';
    this.issueDescription = '';
  }

  submitSupport(): void {

    if (
      !this.supportSubject.trim() ||
      !this.supportMessage.trim()
    ) {
      this.successMessage =
        'Please enter the subject and message.';
      return;
    }

    this.submit(this.supportSubject + ': ' + this.supportMessage, 'query');
    this.supportSubject = '';
    this.supportMessage = '';
  }
}