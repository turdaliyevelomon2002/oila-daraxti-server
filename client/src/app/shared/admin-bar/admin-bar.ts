import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-admin-bar',
  imports: [RouterLink],
  template: `
    <div class="admin-bar">
      <div class="admin-bar-inner">
        <div class="admin-brand">
          <span class="admin-badge">ADMIN</span>
          <span class="admin-panel-label">Boshqaruv paneli</span>
        </div>
        <nav class="admin-nav">
          <a routerLink="/admin" class="admin-nav-link">⚙️ Dashboard</a>
          <a routerLink="/admin/add" class="admin-nav-link gold">+ A'zo qo'shish</a>
          <a routerLink="/admin/telegram-users" class="admin-nav-link tg">🤖 Telegram</a>
        </nav>
        <button class="admin-logout" (click)="logout()">Chiqish →</button>
      </div>
    </div>
  `,
  styles: [`
    .admin-bar {
      background: #0a0a0a;
      border-bottom: 1px solid rgba(255,215,0,0.15);
      padding: 0;
      margin-bottom: 0;
    }
    .admin-bar-inner {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 24px;
      height: 44px;
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .admin-brand { display: flex; align-items: center; gap: 10px; }
    .admin-badge {
      background: rgba(255,215,0,0.15);
      border: 1px solid rgba(255,215,0,0.3);
      color: #ffd700;
      font-size: 10px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 4px;
      letter-spacing: 1px;
    }
    .admin-panel-label { font-size: 12px; color: #666; }
    .admin-nav { display: flex; align-items: center; gap: 4px; flex: 1; }
    .admin-nav-link {
      padding: 4px 12px;
      border-radius: 6px;
      color: #888;
      font-size: 13px;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.2s;
      &:hover { color: #ddd; background: rgba(255,255,255,0.06); }
      &.gold { color: #ffd700; &:hover { background: rgba(255,215,0,0.1); } }
      &.tg { color: #29a8e0; &:hover { background: rgba(41,168,224,0.1); } }
    }
    .admin-logout {
      background: transparent;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 6px;
      color: #666;
      font-size: 12px;
      padding: 4px 12px;
      cursor: pointer;
      transition: all 0.2s;
      font-family: 'Inter', sans-serif;
      &:hover { color: #f44336; border-color: rgba(244,67,54,0.3); }
    }
  `],
})
export class AdminBarComponent {
  constructor(private auth: AuthService, private router: Router) {}
  logout() { this.auth.logout(); this.router.navigate(['/home']); }
}
