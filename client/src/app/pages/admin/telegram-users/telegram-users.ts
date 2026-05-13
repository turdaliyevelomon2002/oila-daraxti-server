import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TelegramUsersService, TelegramUser } from '../../../core/services/telegram-users';
import { MembersService, Member } from '../../../core/services/members';
import { AdminBarComponent } from '../../../shared/admin-bar/admin-bar';

@Component({
  selector: 'app-telegram-users',
  imports: [FormsModule, RouterLink, AdminBarComponent],
  templateUrl: './telegram-users.html',
  styleUrl: './telegram-users.scss',
})
export class TelegramUsersComponent implements OnInit {
  users = signal<TelegramUser[]>([]);
  members = signal<Member[]>([]);
  loading = signal(true);
  linkingId: number | null = null;

  constructor(
    private tgService: TelegramUsersService,
    private membersService: MembersService
  ) {}

  ngOnInit() {
    this.membersService.getAll().subscribe((list) => this.members.set(list));
    this.tgService.getAll().subscribe({
      next: (list) => { this.users.set(list); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  linkMember(user: TelegramUser, memberId: string) {
    const id = memberId ? Number(memberId) : null;
    this.tgService.linkMember(user.id, id).subscribe((updated) => {
      const member = id ? this.members().find((m) => m.id === id) : null;
      this.users.update((list) =>
        list.map((u) =>
          u.id === user.id
            ? { ...u, member_id: updated.member_id, name_uz: member?.name_uz, name_ru: member?.name_ru }
            : u
        )
      );
      this.linkingId = null;
    });
  }

  remove(id: number) {
    if (!confirm('O\'chirishni tasdiqlaysizmi?')) return;
    this.tgService.delete(id).subscribe(() => {
      this.users.update((list) => list.filter((u) => u.id !== id));
    });
  }

  displayName(u: TelegramUser): string {
    const parts = [u.first_name, u.last_name].filter(Boolean);
    return parts.length ? parts.join(' ') : '—';
  }

  formatDate(d: string) { return new Date(d).toLocaleDateString('uz-UZ'); }
}
