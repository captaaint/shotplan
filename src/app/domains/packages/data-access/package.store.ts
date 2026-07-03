import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { CreatePackageRequest, PhotoPackage } from './package.models';
import { PackageApi } from './package.api';

@Injectable({ providedIn: 'root' })
export class PackageStore {
  private readonly api = inject(PackageApi);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly packagesSignal = signal<PhotoPackage[]>([]);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly packages = this.packagesSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadPackages();
    }
  }

  loadPackages(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.api.getPackages().subscribe({
      next: (packages) => {
        this.packagesSignal.set(packages);
        this.loadingSignal.set(false);
      },
      error: () => {
        this.loadingSignal.set(false);
        this.errorSignal.set('Could not load packages.');
      },
    });
  }

  loadPackage(packageId: string): Observable<PhotoPackage> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.api.getPackage(packageId).pipe(
      tap({
        next: (photoPackage) => {
          this.upsertPackage(photoPackage);
          this.loadingSignal.set(false);
        },
        error: () => {
          this.loadingSignal.set(false);
          this.errorSignal.set('Could not load this package.');
        },
      }),
    );
  }

  packageById(packageId: string): PhotoPackage | null {
    return this.packagesSignal().find((photoPackage) => photoPackage.id === packageId) ?? null;
  }

  createPackage(photoPackage: CreatePackageRequest): Observable<PhotoPackage> {
    return this.api.createPackage(photoPackage).pipe(tap((created) => this.upsertPackage(created)));
  }

  private upsertPackage(nextPackage: PhotoPackage): void {
    this.packagesSignal.update((packages) => {
      const exists = packages.some((photoPackage) => photoPackage.id === nextPackage.id);

      return exists
        ? packages.map((photoPackage) =>
            photoPackage.id === nextPackage.id ? nextPackage : photoPackage,
          )
        : [...packages, nextPackage];
    });
  }
}
