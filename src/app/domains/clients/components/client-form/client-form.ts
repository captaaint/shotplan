import { Component, effect, input, output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { FormField } from '../../../../shared/forms/form-field/form-field';
import { Client, CreateClientRequest } from '../../data-access/client.models';

@Component({
  selector: 'app-client-form',
  imports: [FormField, ReactiveFormsModule],
  templateUrl: './client-form.html',
  styleUrl: './client-form.scss',
})
export class ClientForm {
  private readonly fb = inject(FormBuilder);

  readonly client = input<Client | null>(null);
  readonly submitLabel = input('Save client');
  readonly saving = input(false);
  readonly save = output<CreateClientRequest>();

  protected readonly form = this.fb.nonNullable.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    instagramHandle: [''],
    notes: [''],
  });

  private readonly patchClientEffect = effect(() => {
    const client = this.client();

    if (!client) {
      return;
    }

    this.form.patchValue({
      fullName: client.fullName,
      email: client.email,
      phone: client.phone,
      instagramHandle: client.instagramHandle,
      notes: client.notes,
    });
    this.form.markAsPristine();
  });

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.save.emit(this.form.getRawValue());
  }
}
