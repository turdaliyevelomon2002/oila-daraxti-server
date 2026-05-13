import { Component, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './shared/header/header';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  template: `
    @if (showHeader()) {
      <app-header />
    }
    <main [class]="showHeader() ? 'main-content' : 'full-content'">
      <router-outlet />
    </main>
  `,
  styles: [`
    .main-content { min-height: calc(100vh - 64px); background: var(--bg-primary); }
    .full-content { min-height: 100vh; background: var(--bg-primary); }
  `]
})
export class App {
  showHeader = signal(true);

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e) => {
        this.showHeader.set(!(e as NavigationEnd).url.startsWith('/admin'));
      });
  }
}
