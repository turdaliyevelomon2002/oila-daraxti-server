import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
const API = `${environment.apiUrl}/api`;

export interface Notification {
  id: number;
  member_id: number;
  type: string;
  message_uz?: string;
  message_ru?: string;
  message_en?: string;
  is_read: boolean;
  scheduled_for?: string;
  created_at: string;
  name_uz?: string;
  photo_url?: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  unreadCount = signal(0);

  constructor(private http: HttpClient) {
    this.loadUnread();
  }

  getAll(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${API}/notifications`);
  }

  getUnread(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${API}/notifications/unread`).pipe(
      tap((list) => this.unreadCount.set(list.length))
    );
  }

  markRead(id: number): Observable<any> {
    return this.http.patch(`${API}/notifications/${id}/read`, {}).pipe(
      tap(() => this.unreadCount.update((n) => Math.max(0, n - 1)))
    );
  }

  markAllRead(): Observable<any> {
    return this.http.patch(`${API}/notifications/read-all`, {}).pipe(
      tap(() => this.unreadCount.set(0))
    );
  }

  private loadUnread(): void {
    this.getUnread().subscribe();
  }
}
