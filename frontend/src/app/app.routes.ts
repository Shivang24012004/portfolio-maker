import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/landing/landing.page').then((m) => m.LandingPage),
  },
  {
    path: 'portfolios',
    loadComponent: () => import('./features/dashboard/dashboard.page').then((m) => m.DashboardPage),
  },
  {
    path: 'editor/:layoutId',
    loadComponent: () => import('./features/editor/editor.page').then((m) => m.EditorPage),
  },
  {
    path: 'preview/:layoutId',
    loadComponent: () => import('./features/preview/preview.page').then((m) => m.PreviewPage),
  },
  { path: '**', redirectTo: '' },
];
