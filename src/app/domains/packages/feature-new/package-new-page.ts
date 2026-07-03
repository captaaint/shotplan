import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';

import { NotificationService } from '../../../core/services/notification.service';
import { FormField } from '../../../shared/forms/form-field/form-field';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { PackageStore } from '../data-access/package.store';

@Component({
  selector: 'app-package-new-page',
  imports: [FormField, MatButtonModule, PageHeader, ReactiveFormsModule, RouterLink],
  templateUrl: './package-new-page.html',
  styleUrl: './package-new-page.scss',
})
export class PackageNewPage {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);
  protected readonly packageStore = inject(PackageStore);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    durationMinutes: [60, [Validators.required, Validators.min(15)]],
    deliverables: ['', Validators.required],
  });

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.packageStore.createPackage(this.form.getRawValue()).subscribe({
      next: () => {
        this.notificationService.success('Package created.');
        void this.router.navigateByUrl('/packages');
      },
      error: () => this.notificationService.error('Could not create the package.'),
    });
  }
}
