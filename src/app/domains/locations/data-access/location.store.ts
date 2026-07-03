import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { CreateLocationRequest, Location } from './location.models';
import { LocationApi } from './location.api';

@Injectable({ providedIn: 'root' })
export class LocationStore {
  private readonly api = inject(LocationApi);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly locationsSignal = signal<Location[]>([]);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly locations = this.locationsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadLocations();
    }
  }

  loadLocations(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.api.getLocations().subscribe({
      next: (locations) => {
        this.locationsSignal.set(locations);
        this.loadingSignal.set(false);
      },
      error: () => {
        this.loadingSignal.set(false);
        this.errorSignal.set('Could not load locations.');
      },
    });
  }

  loadLocation(locationId: string): Observable<Location> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.api.getLocation(locationId).pipe(
      tap({
        next: (location) => {
          this.upsertLocation(location);
          this.loadingSignal.set(false);
        },
        error: () => {
          this.loadingSignal.set(false);
          this.errorSignal.set('Could not load this location.');
        },
      }),
    );
  }

  locationById(locationId: string): Location | null {
    return this.locationsSignal().find((location) => location.id === locationId) ?? null;
  }

  createLocation(location: CreateLocationRequest): Observable<Location> {
    return this.api.createLocation(location).pipe(tap((created) => this.upsertLocation(created)));
  }

  private upsertLocation(nextLocation: Location): void {
    this.locationsSignal.update((locations) => {
      const exists = locations.some((location) => location.id === nextLocation.id);

      return exists
        ? locations.map((location) => (location.id === nextLocation.id ? nextLocation : location))
        : [...locations, nextLocation];
    });
  }
}
