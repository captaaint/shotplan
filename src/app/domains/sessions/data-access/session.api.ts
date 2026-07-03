import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { CreateSessionRequest, Session, UpdateSessionRequest } from './session.models';

@Injectable({ providedIn: 'root' })
export class SessionApi {
  private readonly http = inject(HttpClient);
  private readonly sessionsUrl = '/sessions';

  getSessions(): Observable<Session[]> {
    return this.http.get<Session[]>(this.sessionsUrl);
  }

  getSession(sessionId: string): Observable<Session> {
    return this.http.get<Session>(`${this.sessionsUrl}/${sessionId}`);
  }

  createSession(session: CreateSessionRequest): Observable<Session> {
    return this.http.post<Session>(this.sessionsUrl, session);
  }

  updateSession(sessionId: string, changes: UpdateSessionRequest): Observable<Session> {
    return this.http.patch<Session>(`${this.sessionsUrl}/${sessionId}`, changes);
  }
}
