import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

const API = `${environment.apiUrl}/api`;

export interface TelegramUser {
  id: number;
  chat_id: string;
  telegram_username?: string;
  first_name?: string;
  last_name?: string;
  member_id?: number;
  name_uz?: string;
  name_ru?: string;
  name_en?: string;
  photo_url?: string;
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class TelegramUsersService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<TelegramUser[]> {
    return this.http.get<TelegramUser[]>(`${API}/telegram-users`);
  }

  linkMember(id: number, memberId: number | null): Observable<TelegramUser> {
    return this.http.put<TelegramUser>(`${API}/telegram-users/${id}/link`, { member_id: memberId });
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${API}/telegram-users/${id}`);
  }
}
