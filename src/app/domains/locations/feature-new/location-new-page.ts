import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';

import { NotificationService } from '../../../core/services/notification.service';
import { FormField } from '../../../shared/forms/form-field/form-field';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { LocationStore } from '../data-access/location.store';

@Component({
  selector: 'app-location-new-page',
  imports: [FormField, MatButtonModule, PageHeader, ReactiveFormsModule, RouterLink],
  templateUrl: './location-new-page.html',
  styleUrl: './location-new-page.scss',
})
export class LocationNewPage {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);
  protected readonly locationStore = inject(LocationStore);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    address: ['', Validators.required],
    indoor: [true],
    notes: [''],
  });

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.locationStore.createLocation(this.form.getRawValue()).subscribe({
      next: () => {
        this.notificationService.success('Location created.');
        void this.router.navigateByUrl('/locations');
      },
      error: () => this.notificationService.error('Could not create the location.'),
    });
  }
}
