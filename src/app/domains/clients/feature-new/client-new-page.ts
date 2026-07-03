import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { ClientStore } from '../data-access/client.store';

@Component({
  selector: 'app-client-new-page',
  imports: [PageHeader, ReactiveFormsModule, RouterLink],
  templateUrl: './client-new-page.html',
  styleUrl: './client-new-page.scss',
})
export class ClientNewPage {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  protected readonly clientStore = inject(ClientStore);

  protected readonly submitting = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    instagramHandle: [''],
    notes: [''],
  });

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);

    this.clientStore.createClient(this.form.getRawValue()).subscribe({
      next: () => {
        this.submitting.set(false);
        void this.router.navigateByUrl('/clients');
      },
      error: () => {
        this.submitting.set(false);
      },
    });
  }
}
