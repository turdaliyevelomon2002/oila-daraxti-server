import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Member } from '../../core/services/members';
import { TranslateService } from '../../core/services/translate';
import { resolveUrl } from '../../../environments/environment';

@Component({
  selector: 'app-member-card',
  imports: [RouterLink],
  templateUrl: './member-card.html',
  styleUrl: './member-card.scss',
})
export class MemberCardComponent {
  @Input() member!: Member;
  @Input() compact = false;

  constructor(public translate: TranslateService) {}

  get name() { return this.translate.getName(this.member); }
  get photoUrl() { return resolveUrl(this.member.photo_url); }
  get initials() {
    const n = this.member.name_uz || '';
    return n.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);
  }
  get age(): number | null {
    if (!this.member.birth_date) return null;
    const end = this.member.death_date ? new Date(this.member.death_date) : new Date();
    return end.getFullYear() - new Date(this.member.birth_date).getFullYear();
  }
  get birthYear() { return this.member.birth_date ? new Date(this.member.birth_date).getFullYear() : null; }
  get isAlive() { return !this.member.death_date; }
  t(k: string) { return this.translate.t(k); }
}
