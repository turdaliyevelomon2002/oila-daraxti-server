import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SlicePipe } from '@angular/common';
import { MembersService, Member } from '../../../core/services/members';
import { TranslateService } from '../../../core/services/translate';
import { AdminBarComponent } from '../../../shared/admin-bar/admin-bar';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, SlicePipe, AdminBarComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit {
  members = signal<Member[]>([]);
  loading = signal(true);
  deleteId = signal<number | null>(null);
  message = signal('');

  constructor(
    private membersService: MembersService,
    public translate: TranslateService
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.membersService.getAll().subscribe({
      next: (data) => {
        const sorted = [...data].sort((a, b) => {
          if (a.generation !== b.generation) return a.generation - b.generation;
          return a.id - b.id;
        });
        this.members.set(sorted);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  confirmDelete(id: number) { this.deleteId.set(id); }
  cancelDelete() { this.deleteId.set(null); }

  doDelete() {
    const id = this.deleteId();
    if (!id) return;
    this.membersService.delete(id).subscribe(() => {
      this.members.update((list) => list.filter((m) => m.id !== id));
      this.deleteId.set(null);
      this.message.set(this.translate.t('DELETED'));
      setTimeout(() => this.message.set(''), 3000);
    });
  }

  get totalCount() { return this.members().length; }
  get maleCount() { return this.members().filter((m) => m.gender === 'male').length; }
  get femaleCount() { return this.members().filter((m) => m.gender === 'female').length; }
  get generationCount() {
    return new Set(this.members().map((m) => m.generation)).size;
  }
  get todayBirthdays() {
    const today = new Date();
    return this.members().filter((m) => {
      if (!m.birth_date) return false;
      const d = new Date(m.birth_date);
      return d.getMonth() === today.getMonth() && d.getDate() === today.getDate();
    }).length;
  }

  isTodayBirthday(m: Member): boolean {
    if (!m.birth_date) return false;
    const today = new Date();
    const d = new Date(m.birth_date);
    return d.getMonth() === today.getMonth() && d.getDate() === today.getDate();
  }

  getName(m: Member) { return this.translate.getName(m); }
  t(k: string) { return this.translate.t(k); }
}
