import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MembersService, Member } from '../../../core/services/members';
import { TranslateService } from '../../../core/services/translate';
import { AdminBarComponent } from '../../../shared/admin-bar/admin-bar';

@Component({
  selector: 'app-member-form',
  imports: [FormsModule, RouterLink, AdminBarComponent],
  templateUrl: './member-form.html',
  styleUrl: './member-form.scss',
})
export class MemberFormComponent implements OnInit {
  isEdit = false;
  editId: number | null = null;
  loading = signal(false);
  saving = signal(false);
  message = signal('');
  error = signal('');
  allMembers = signal<Member[]>([]);
  selectedPhoto: File | null = null;
  selectedMedia: File[] = [];
  photoPreview = signal<string | null>(null);
  existingMember = signal<Member | null>(null);

  form = {
    name_uz: '', name_ru: '', name_en: '',
    birth_date: '', death_date: '',
    gender: 'male' as 'male' | 'female',
    generation: 1,
    parent_id: '', mother_id: '', spouse_id: '',
    bio_uz: '', bio_ru: '', bio_en: '',
    phone: '', email: '', telegram_chat_id: '',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private membersService: MembersService,
    public translate: TranslateService
  ) {}

  ngOnInit() {
    this.membersService.getAll().subscribe((list) => this.allMembers.set(list));

    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdit = true;
      this.editId = +id;
      this.loading.set(true);
      this.membersService.getById(+id).subscribe({
        next: (m) => {
          this.existingMember.set(m);
          this.form = {
            name_uz: m.name_uz || '',
            name_ru: m.name_ru || '',
            name_en: m.name_en || '',
            birth_date: m.birth_date ? m.birth_date.slice(0, 10) : '',
            death_date: m.death_date ? m.death_date.slice(0, 10) : '',
            gender: m.gender,
            generation: m.generation,
            parent_id: m.parent_id ? String(m.parent_id) : '',
            mother_id: m.mother_id ? String(m.mother_id) : '',
            spouse_id: m.spouse_id ? String(m.spouse_id) : '',
            bio_uz: m.bio_uz || '',
            bio_ru: m.bio_ru || '',
            bio_en: m.bio_en || '',
            phone: m.phone || '',
            email: m.email || '',
            telegram_chat_id: m.telegram_chat_id ? String(m.telegram_chat_id) : '',
          };
          if (m.photo_url) this.photoPreview.set(`https://oila-daraxti-server.onrender.com${m.photo_url}`);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
    }
  }

  onPhotoChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedPhoto = file;
      const reader = new FileReader();
      reader.onload = (ev) => this.photoPreview.set(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  }

  onMediaChange(e: Event) {
    const files = (e.target as HTMLInputElement).files;
    if (files) this.selectedMedia = Array.from(files);
  }

  buildFormData(): FormData {
    const fd = new FormData();
    Object.entries(this.form).forEach(([key, val]) => {
      if (val !== '' && val !== null && val !== undefined) fd.append(key, String(val));
    });
    if (this.selectedPhoto) fd.append('photo', this.selectedPhoto);
    return fd;
  }

  submit() {
    if (!this.form.name_uz) { this.error.set('Ismi (O\'zbek) majburiy'); return; }
    this.saving.set(true);
    this.error.set('');

    const fd = this.buildFormData();
    const req = this.isEdit && this.editId
      ? this.membersService.update(this.editId, fd)
      : this.membersService.create(fd);

    req.subscribe({
      next: (saved) => {
        if (this.selectedMedia.length > 0 && saved.id) {
          this.uploadMedia(saved.id);
        } else {
          this.onSaved();
        }
      },
      error: (err) => {
        this.error.set(err?.error?.message || this.translate.t('ERROR'));
        this.saving.set(false);
      },
    });
  }

  uploadMedia(memberId: number) {
    let pending = this.selectedMedia.length;
    this.selectedMedia.forEach((file) => {
      const fd = new FormData();
      fd.append('member_id', String(memberId));
      fd.append('file', file);
      this.membersService.addMedia(fd).subscribe({
        next: () => { if (--pending === 0) this.onSaved(); },
        error: () => { if (--pending === 0) this.onSaved(); },
      });
    });
  }

  onSaved() {
    this.saving.set(false);
    this.message.set(this.translate.t('SUCCESS'));
    setTimeout(() => this.router.navigate(['/admin']), 1000);
  }

  get filteredFathers(): Member[] {
    return this.allMembers().filter((m) => m.id !== this.editId && m.gender === 'male');
  }

  get filteredMothers(): Member[] {
    return this.allMembers().filter((m) => m.id !== this.editId && m.gender === 'female');
  }

  get filteredSpouses(): Member[] {
    const opposite = this.form.gender === 'male' ? 'female' : 'male';
    return this.allMembers().filter((m) => m.id !== this.editId && m.gender === opposite);
  }

  t(k: string) { return this.translate.t(k); }
  getName(m: Member) { return this.translate.getName(m); }
}
