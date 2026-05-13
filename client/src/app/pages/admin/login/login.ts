import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { TranslateService } from '../../../core/services/translate';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  username = '';
  password = '';
  error = signal('');
  loading = signal(false);

  constructor(
    private auth: AuthService,
    private router: Router,
    public translate: TranslateService
  ) {
    if (this.auth.isLoggedIn()) this.router.navigate(['/admin']);
  }

  submit() {
    if (!this.username || !this.password) return;
    this.loading.set(true);
    this.error.set('');
    this.auth.login(this.username, this.password).subscribe({
      next: () => this.router.navigate(['/admin']),
      error: () => { this.error.set(this.translate.t('ERROR')); this.loading.set(false); },
    });
  }

  t(k: string) { return this.translate.t(k); }
}
