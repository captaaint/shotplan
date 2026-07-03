import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';

import { NotificationService } from '../../../core/services/notification.service';
import { FormField } from '../../../shared/forms/form-field/form-field';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { LeadStore } from '../data-access/lead.store';

@Component({
  selector: 'app-lead-new-page',
  imports: [FormField, MatButtonModule, PageHeader, ReactiveFormsModule, RouterLink],
  templateUrl: './lead-new-page.html',
  styleUrl: './lead-new-page.scss',
})
export class LeadNewPage {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);
  protected readonly leadStore = inject(LeadStore);

  protected readonly form = this.fb.nonNullable.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    sessionType: ['', Validators.required],
    source: ['Website'],
    status: this.fb.nonNullable.control<'new' | 'contacted' | 'converted'>(
      'new',
      Validators.required,
    ),
    notes: [''],
  });

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.leadStore.createLead(this.form.getRawValue()).subscribe({
      next: () => {
        this.notificationService.success('Lead created.');
        void this.router.navigateByUrl('/leads');
      },
      error: () => this.notificationService.error('Could not create the lead.'),
    });
  }
}
