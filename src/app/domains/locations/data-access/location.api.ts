import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { CreateLocationRequest, Location } from './location.models';

@Injectable({ providedIn: 'root' })
export class LocationApi {
  private readonly http = inject(HttpClient);
  private readonly locationsUrl = '/locations';

  getLocations(): Observable<Location[]> {
    return this.http.get<Location[]>(this.locationsUrl);
  }

  getLocation(locationId: string): Observable<Location> {
    return this.http.get<Location>(`${this.locationsUrl}/${locationId}`);
  }

  createLocation(location: CreateLocationRequest): Observable<Location> {
    return this.http.post<Location>(this.locationsUrl, location);
  }
}
