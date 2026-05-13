import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
const API = `${environment.apiUrl}/api`;

export interface Member {
  id: number;
  name_uz: string;
  name_ru?: string;
  name_en?: string;
  birth_date?: string;
  death_date?: string;
  gender: 'male' | 'female';
  generation: number;
  parent_id?: number;
  mother_id?: number;
  spouse_id?: number;
  photo_url?: string;
  bio_uz?: string;
  bio_ru?: string;
  bio_en?: string;
  phone?: string;
  email?: string;
  telegram_chat_id?: string;
  children?: Member[];
  spouse?: Member;
  parent?: Member;
  mother?: Member;
  media?: MediaItem[];
}

export interface MediaItem {
  id: number;
  member_id: number;
  media_type: 'image' | 'video';
  url: string;
  caption?: string;
}

@Injectable({ providedIn: 'root' })
export class MembersService {
  constructor(private http: HttpClient) {}

  getTree(): Observable<Member[]> {
    return this.http.get<Member[]>(`${API}/members/tree`);
  }

  getAll(): Observable<Member[]> {
    return this.http.get<Member[]>(`${API}/members`);
  }

  getById(id: number): Observable<Member> {
    return this.http.get<Member>(`${API}/members/${id}`);
  }

  create(data: FormData): Observable<Member> {
    return this.http.post<Member>(`${API}/members`, data);
  }

  update(id: number, data: FormData): Observable<Member> {
    return this.http.put<Member>(`${API}/members/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${API}/members/${id}`);
  }

  addMedia(data: FormData): Observable<MediaItem> {
    return this.http.post<MediaItem>(`${API}/media`, data);
  }

  deleteMedia(id: number): Observable<any> {
    return this.http.delete(`${API}/media/${id}`);
  }
}
