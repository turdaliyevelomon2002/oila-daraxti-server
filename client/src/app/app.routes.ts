import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home').then((m) => m.HomeComponent),
  },
  {
    path: 'member/:id',
    loadComponent: () => import('./pages/member-profile/member-profile').then((m) => m.MemberProfileComponent),
  },
  {
    path: 'notifications',
    loadComponent: () => import('./pages/notifications-page/notifications-page').then((m) => m.NotificationsPageComponent),
  },
  {
    path: 'admin/login',
    loadComponent: () => import('./pages/admin/login/login').then((m) => m.LoginComponent),
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/admin/dashboard/dashboard').then((m) => m.DashboardComponent),
  },
  {
    path: 'admin/add',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/admin/member-form/member-form').then((m) => m.MemberFormComponent),
  },
  {
    path: 'admin/edit/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/admin/member-form/member-form').then((m) => m.MemberFormComponent),
  },
  {
    path: 'admin/telegram-users',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/admin/telegram-users/telegram-users').then((m) => m.TelegramUsersComponent),
  },
  { path: '**', redirectTo: 'home' },
];
