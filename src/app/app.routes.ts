import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about-page'),
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact-page'),
  },
  {
    path: 'pricing',
    loadComponent: () => import('./pages/pricing/pricing-page'),
  },
  {
    path: '',
    loadComponent: () => import('./pages/about/about-page'),
  },
  {
    path: '**',
    redirectTo: () => {
      console.log('redirecting to about');
      return 'about';
    },
    pathMatch: 'full',
  },
];
