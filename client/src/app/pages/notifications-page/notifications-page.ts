import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NotificationService, Notification } from '../../core/services/notification';
import { TranslateService } from '../../core/services/translate';
import { resolveUrl } from '../../../environments/environment';

@Component({
  selector: 'app-notifications-page',
  imports: [RouterLink],
  templateUrl: './notifications-page.html',
  styleUrl: './notifications-page.scss',
})
export class NotificationsPageComponent implements OnInit {
  notifications = signal<Notification[]>([]);
  loading = signal(true);

  constructor(
    public notifService: NotificationService,
    public translate: TranslateService
  ) {}

  ngOnInit() {
    this.notifService.getAll().subscribe({
      next: (list) => { this.notifications.set(list); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  markRead(n: Notification) {
    if (n.is_read) return;
    this.notifService.markRead(n.id).subscribe(() => {
      this.notifications.update((list) => list.map((x) => x.id === n.id ? { ...x, is_read: true } : x));
    });
  }

  markAll() {
    this.notifService.markAllRead().subscribe(() => {
      this.notifications.update((list) => list.map((x) => ({ ...x, is_read: true })));
    });
  }

  get unreadCount() { return this.notifications().filter(n => !n.is_read).length; }

  photoUrl(url?: string) { return resolveUrl(url); }
  t(k: string) { return this.translate.t(k); }
  getMessage(n: Notification) { return this.translate.getMessage(n); }
  formatDate(d: string) { return new Date(d).toLocaleDateString('uz-UZ'); }
}
