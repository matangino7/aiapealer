import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'home', 
    pathMatch: 'full' 
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'appeals',
    loadComponent: () => import('./features/exam-appeal/appeal-list/appeal-list.component').then(m => m.AppealListComponent)
  },
  {
    path: 'appeals/:id',
    loadComponent: () => import('./features/exam-appeal/appeal-detail/appeal-detail.component').then(m => m.AppealDetailComponent)
  },
  {
    path: 'new-appeal',
    loadComponent: () => import('./features/exam-appeal/upload/upload.component').then(m => m.UploadComponent)
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
