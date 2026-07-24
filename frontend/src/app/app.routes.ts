import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/landing/landing.page').then((m) => m.LandingPage),
  },
  {
    path: 'portfolios',
    loadComponent: () => import('./pages/dashboard/dashboard.page').then((m) => m.DashboardPage),
  },
  {
    path: 'editor/:layoutId',
    loadComponent: () => import('./pages/editor/editor.page').then((m) => m.EditorPage),
  },
  {
    path: 'preview/:layoutId',
    loadComponent: () => import('./pages/preview/preview.page').then((m) => m.PreviewPage),
  },
  { path: '**', redirectTo: '' },
];
