import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export type Lang = 'uz' | 'ru' | 'en';

@Injectable({ providedIn: 'root' })
export class TranslateService {
  private translations: Record<string, string> = {};
  currentLang = signal<Lang>('uz');

  constructor(private http: HttpClient) {
    const saved = (localStorage.getItem('lang') as Lang) || 'uz';
    this.load(saved);
  }

  load(lang: Lang): void {
    this.http.get<Record<string, string>>(`/assets/i18n/${lang}.json`).subscribe((data) => {
      this.translations = data;
      this.currentLang.set(lang);
      localStorage.setItem('lang', lang);
    });
  }

  t(key: string): string {
    return this.translations[key] || key;
  }

  getName(item: any): string {
    if (!item) return '';
    const lang = this.currentLang();
    return item[`name_${lang}`] || item.name_uz || '';
  }

  getBio(item: any): string {
    if (!item) return '';
    const lang = this.currentLang();
    return item[`bio_${lang}`] || item.bio_uz || '';
  }

  getMessage(item: any): string {
    if (!item) return '';
    const lang = this.currentLang();
    return item[`message_${lang}`] || item.message_uz || '';
  }
}
