import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MembersService, Member } from '../../core/services/members';
import { TranslateService } from '../../core/services/translate';
import { MemberCardComponent } from '../../shared/member-card/member-card';
import { AuthService } from '../../core/services/auth';
import { resolveUrl } from '../../../environments/environment';

@Component({
  selector: 'app-member-profile',
  imports: [RouterLink, MemberCardComponent],
  templateUrl: './member-profile.html',
  styleUrl: './member-profile.scss',
})
export class MemberProfileComponent implements OnInit {
  member = signal<Member | null>(null);
  loading = signal(true);
  lightboxSrc = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private membersService: MembersService,
    public translate: TranslateService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(({ id }) => {
      this.loading.set(true);
      this.membersService.getById(+id).subscribe({
        next: (m) => { this.member.set(m); this.loading.set(false); },
        error: () => this.loading.set(false),
      });
    });
  }

  get photoUrl() { return resolveUrl(this.member()?.photo_url); }

  get age(): number | null {
    const m = this.member();
    if (!m?.birth_date) return null;
    const end = m.death_date ? new Date(m.death_date) : new Date();
    return end.getFullYear() - new Date(m.birth_date).getFullYear();
  }

  formatDate(date: string | undefined) {
    if (!date) return '';
    return new Date(date).toLocaleDateString(this.translate.currentLang() === 'ru' ? 'ru-RU' : 'uz-UZ', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  mediaUrl(url: string) { return resolveUrl(url) ?? url; }
  openLightbox(url: string) { this.lightboxSrc.set(url); }
  closeLightbox() { this.lightboxSrc.set(null); }

  getInitials(m: any): string {
    const name = this.translate.getName(m) || '';
    return name.split(' ').map((p: string) => p.charAt(0)).join('').toUpperCase().slice(0, 2);
  }
  t(k: string) { return this.translate.t(k); }
  getName(m: any) { return this.translate.getName(m); }
  getBio(m: any) { return this.translate.getBio(m); }

  linkCopied = signal(false);

  copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      this.linkCopied.set(true);
      setTimeout(() => this.linkCopied.set(false), 2000);
    });
  }

  get images() { return this.member()?.media?.filter(m => m.media_type === 'image') || []; }
  get videos() { return this.member()?.media?.filter(m => m.media_type === 'video') || []; }
}
