import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Member } from '../../core/services/members';
import { TranslateService } from '../../core/services/translate';
import { resolveUrl } from '../../../environments/environment';

@Component({
  selector: 'app-family-tree',
  imports: [RouterLink],
  templateUrl: './family-tree.html',
  styleUrl: './family-tree.scss',
})
export class FamilyTreeComponent {
  @Input() nodes: Member[] = [];

  constructor(public translate: TranslateService) {}

  getName(m: Member) { return this.translate.getName(m); }
  getPhoto(m: Member) { return resolveUrl(m.photo_url); }
  getInitials(m: Member) {
    return (m.name_uz || '').split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);
  }
  getBirthYear(m: Member) {
    return m.birth_date ? new Date(m.birth_date).getFullYear() : null;
  }
  hasChildren(m: Member) { return m.children && m.children.length > 0; }
  trackById(_: number, m: Member) { return m.id; }
}
