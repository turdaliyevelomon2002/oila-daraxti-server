import { Component, OnInit, signal } from '@angular/core';
import { MembersService, Member } from '../../core/services/members';
import { TranslateService } from '../../core/services/translate';
import { FamilyTreeComponent } from '../../shared/family-tree/family-tree';
import { MemberCardComponent } from '../../shared/member-card/member-card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [FamilyTreeComponent, MemberCardComponent, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent implements OnInit {
  treeData = signal<Member[]>([]);
  allMembers = signal<Member[]>([]);
  loading = signal(true);
  view = signal<'tree' | 'grid'>('grid');
  searchQuery = signal('');
  selectedGen = signal<number | null>(null);

  constructor(
    private membersService: MembersService,
    public translate: TranslateService
  ) {}

  ngOnInit() {
    this.membersService.getTree().subscribe({
      next: (data) => { this.treeData.set(data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
    this.membersService.getAll().subscribe((data) => this.allMembers.set(data));
  }

  get filteredMembers() {
    const q = this.searchQuery().toLowerCase();
    if (!q) return this.allMembers();
    return this.allMembers().filter((m) =>
      [m.name_uz, m.name_ru, m.name_en].some((n) => n?.toLowerCase().includes(q))
    );
  }

  get generationGroups() {
    const members = this.selectedGen() !== null
      ? this.allMembers().filter(m => m.generation === this.selectedGen())
      : this.allMembers();
    const map = new Map<number, Member[]>();
    for (const m of members) {
      const g = m.generation || 1;
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(m);
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => a - b)
      .map(([num, members]) => ({ num, members }));
  }

  get allGenerations(): number[] {
    const gens = new Set(this.allMembers().map((m) => m.generation || 1));
    return Array.from(gens).sort((a, b) => a - b);
  }

  get totalCount() { return this.allMembers().length; }
  get maleCount() { return this.allMembers().filter(m => m.gender === 'male').length; }
  get femaleCount() { return this.allMembers().filter(m => m.gender === 'female').length; }

  get generationCount() {
    return new Set(this.allMembers().map((m) => m.generation)).size;
  }

  get todayBirthdays() {
    const today = new Date();
    return this.allMembers().filter((m) => {
      if (!m.birth_date || m.death_date) return false;
      const d = new Date(m.birth_date);
      return d.getMonth() === today.getMonth() && d.getDate() === today.getDate();
    });
  }

  get upcomingBirthdays(): Array<Member & { daysLeft: number }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.allMembers()
      .filter(m => m.birth_date && !m.death_date)
      .map(m => {
        const bd = new Date(m.birth_date!);
        let next = new Date(today.getFullYear(), bd.getMonth(), bd.getDate());
        if (next <= today) next = new Date(today.getFullYear() + 1, bd.getMonth(), bd.getDate());
        const diff = Math.round((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return { ...m, daysLeft: diff };
      })
      .filter(m => m.daysLeft > 0 && m.daysLeft <= 14)
      .sort((a, b) => a.daysLeft - b.daysLeft);
  }

  t(key: string) { return this.translate.t(key); }
  setView(v: 'tree' | 'grid') { this.view.set(v); }
  setSearch(e: Event) { this.searchQuery.set((e.target as HTMLInputElement).value); }
  setGen(gen: number | null) { this.selectedGen.set(gen); }
  getName(m: Member) { return this.translate.getName(m); }
}
