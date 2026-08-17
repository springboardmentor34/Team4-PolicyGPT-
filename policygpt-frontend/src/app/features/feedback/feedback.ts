import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Ticket {
  id: string;
  subject: string;
  category: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  date: string;
}

interface Faq {
  question: string;
  answer: string;
  open: boolean;
}

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './feedback.html',
  styleUrl: './feedback.css'
})
export class Feedback {

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

  tickets: Ticket[] = [
    {
      id: 'PG-1001',
      subject: 'Eligibility result needs clarification',
      category: 'Eligibility',
      status: 'In Progress',
      date: '16 Aug 2026'
    },
    {
      id: 'PG-1002',
      subject: 'Unable to open policy details',
      category: 'Technical Issue',
      status: 'Open',
      date: '15 Aug 2026'
    }
  ];

  setSection(section: string): void {
    this.activeSection = section;
    this.successMessage = '';
  }

  setRating(value: number): void {
    this.rating = value;
  }

  toggleFaq(faq: Faq): void {
    faq.open = !faq.open;
  }

  submitFeedback(): void {

    if (!this.rating || !this.feedbackText.trim()) {
      this.successMessage =
        'Please select a rating and enter your feedback.';
      return;
    }

    this.successMessage =
      'Thank you! Your feedback has been submitted successfully.';

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

    const ticket: Ticket = {
      id: `PG-${1000 + this.tickets.length + 1}`,
      subject: this.issueSubject,
      category: this.issueCategory,
      status: 'Open',
      date: '16 Aug 2026'
    };

    this.tickets.unshift(ticket);

    this.issueSubject = '';
    this.issueDescription = '';

    this.successMessage =
      `Issue reported successfully. Ticket ID: ${ticket.id}`;
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

    const ticket: Ticket = {
      id: `PG-${1000 + this.tickets.length + 1}`,
      subject: this.supportSubject,
      category: 'Help Desk',
      status: 'Open',
      date: '16 Aug 2026'
    };

    this.tickets.unshift(ticket);

    this.supportSubject = '';
    this.supportMessage = '';

    this.successMessage =
      `Support request submitted. Ticket ID: ${ticket.id}`;
  }

  updateTicket(
    ticket: Ticket,
    status: Ticket['status']
  ): void {

    ticket.status = status;
  }
}