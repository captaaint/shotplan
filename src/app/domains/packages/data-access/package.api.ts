import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { CreatePackageRequest, PhotoPackage } from './package.models';

@Injectable({ providedIn: 'root' })
export class PackageApi {
  private readonly http = inject(HttpClient);
  private readonly packagesUrl = '/packages';

  getPackages(): Observable<PhotoPackage[]> {
    return this.http.get<PhotoPackage[]>(this.packagesUrl);
  }

  getPackage(packageId: string): Observable<PhotoPackage> {
    return this.http.get<PhotoPackage>(`${this.packagesUrl}/${packageId}`);
  }

  createPackage(photoPackage: CreatePackageRequest): Observable<PhotoPackage> {
    return this.http.post<PhotoPackage>(this.packagesUrl, photoPackage);
  }
}
