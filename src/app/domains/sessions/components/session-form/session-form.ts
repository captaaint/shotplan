import { Component, effect, inject, input, output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { FormField } from '../../../../shared/forms/form-field/form-field';
import { endTimeAfterStartTimeValidator } from '../../../../shared/forms/validators/time-range.validator';
import { Client } from '../../../clients/data-access/client.models';
import { CreateSessionRequest, Session, SessionStatus } from '../../data-access/session.models';

@Component({
  selector: 'app-session-form',
  imports: [FormField, ReactiveFormsModule],
  templateUrl: './session-form.html',
  styleUrl: './session-form.scss',
})
export class SessionForm {
  private readonly fb = inject(FormBuilder);

  readonly clients = input<Client[]>([]);
  readonly session = input<Session | null>(null);
  readonly submitLabel = input('Save session');
  readonly saving = input(false);
  readonly save = output<CreateSessionRequest>();

  protected readonly form = this.fb.nonNullable.group(
    {
      clientId: ['', Validators.required],
      type: ['', Validators.required],
      date: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      status: this.fb.nonNullable.control<SessionStatus>('inquiry', Validators.required),
      galleryUrl: [''],
      shotList: this.fb.array<FormControl<string>>([this.createShotControl()]),
    },
    { validators: endTimeAfterStartTimeValidator() },
  );

  protected get shotList(): FormArray<FormControl<string>> {
    return this.form.controls.shotList;
  }

  private readonly patchSessionEffect = effect(() => {
    const session = this.session();

    if (!session) {
      return;
    }

    this.form.patchValue({
      clientId: session.clientId,
      type: session.type,
      date: session.date,
      startTime: session.startTime,
      endTime: session.endTime,
      price: session.price,
      status: session.status,
      galleryUrl: session.galleryUrl ?? '',
    });
    this.replaceShotList(session.shotList);
    this.form.markAsPristine();
  });

  protected addShot(): void {
    this.shotList.push(this.createShotControl());
  }

  protected removeShot(index: number): void {
    if (this.shotList.length === 1) {
      this.shotList.at(0).setValue('');
      return;
    }

    this.shotList.removeAt(index);
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const client = this.clients().find((candidate) => candidate.id === value.clientId);

    if (!client) {
      this.form.controls.clientId.setErrors({ required: true });
      return;
    }

    this.save.emit({
      ...value,
      clientName: client.fullName,
      galleryUrl: value.galleryUrl || undefined,
      shotList: value.shotList.map((shot) => shot.trim()).filter(Boolean),
    });
  }

  isDirty(): boolean {
    return this.form.dirty;
  }

  markSaved(): void {
    this.form.markAsPristine();
  }

  private createShotControl(value = ''): FormControl<string> {
    return this.fb.nonNullable.control(value, Validators.required);
  }

  private replaceShotList(shots: string[]): void {
    this.shotList.clear();

    for (const shot of shots.length ? shots : ['']) {
      this.shotList.push(this.createShotControl(shot));
    }
  }
}
