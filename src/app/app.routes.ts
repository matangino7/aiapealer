import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [authGuard]
  },
  {
    path: 'exam-appeal',
    loadChildren: () => import('./features/exam-appeal/exam-appeal.module').then(m => m.ExamAppealModule),
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
]; 