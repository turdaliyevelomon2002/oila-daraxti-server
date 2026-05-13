import { Component, OnInit, signal } from '@angular/core';
import { MembersService, Member } from '../../core/services/members';
import { TranslateService } from '../../core/services/translate';
import { FamilyTreeComponent } from '../../shared/family-tree/family-tree';
import { MemberCardComponent } from '../../shared/member-card/member-card';

@Component({
  selector: 'app-home',
  imports: [FamilyTreeComponent, MemberCardComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent implements OnInit {
  treeData = signal<Member[]>([]);
  allMembers = signal<Member[]>([]);
  loading = signal(true);
  view = signal<'tree' | 'grid'>('tree');
  searchQuery = signal('');

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
    const members = this.allMembers();
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

  get totalCount() { return this.allMembers().length; }

  get generationCount() {
    const gens = new Set(this.allMembers().map((m) => m.generation));
    return gens.size;
  }

  get todayBirthdays() {
    const today = new Date();
    return this.allMembers().filter((m) => {
      if (!m.birth_date) return false;
      const d = new Date(m.birth_date);
      return d.getMonth() === today.getMonth() && d.getDate() === today.getDate();
    });
  }

  t(key: string) { return this.translate.t(key); }
  setView(v: 'tree' | 'grid') { this.view.set(v); }
  setSearch(e: Event) { this.searchQuery.set((e.target as HTMLInputElement).value); }
}
