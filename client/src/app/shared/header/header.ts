import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateService, Lang } from '../../core/services/translate';
import { NotificationService } from '../../core/services/notification';
import { ThemeService } from '../../core/services/theme';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent {
  langs: Lang[] = ['uz', 'ru', 'en'];

  constructor(
    public translate: TranslateService,
    public notif: NotificationService,
    public themeService: ThemeService
  ) {}

  t(key: string) { return this.translate.t(key); }
  setLang(lang: Lang) { this.translate.load(lang); }
}
