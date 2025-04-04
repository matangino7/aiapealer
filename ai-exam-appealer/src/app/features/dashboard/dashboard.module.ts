import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { DashboardComponent } from './dashboard.component';
import { NewAppealComponent } from './new-appeal/new-appeal.component';
import { AppealHistoryComponent } from './appeal-history/appeal-history.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'new', component: NewAppealComponent },
  { path: 'history', component: AppealHistoryComponent }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatCardModule,
    MatProgressBarModule,
    MatSnackBarModule
  ]
})
export class DashboardModule { }
