import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Session } from './session.models';

@Injectable({ providedIn: 'root' })
export class SessionApi {
  private readonly http = inject(HttpClient);
  private readonly sessionsUrl = 'http://localhost:3000/sessions';

  getSessions(): Observable<Session[]> {
    return this.http.get<Session[]>(this.sessionsUrl);
  }

  createSession(session: Session): Observable<Session> {
    return this.http.post<Session>(this.sessionsUrl, session);
  }

  updateSession(sessionId: string, changes: Partial<Session>): Observable<Session> {
    return this.http.patch<Session>(`${this.sessionsUrl}/${sessionId}`, changes);
  }
}
