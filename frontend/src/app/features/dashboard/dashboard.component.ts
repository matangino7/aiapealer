import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ExamAppealService } from '../../core/services/exam-appeal.service';
import { ExamAppeal } from '../../core/models/exam-appeal.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule
  ],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p class="text-gray-600">Welcome to your exam appeal management dashboard</p>
      </div>

      <div class="stats-grid">
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon bg-blue-100">
              <mat-icon class="text-blue-600">description</mat-icon>
            </div>
            <div class="stat-content">
              <h3 class="stat-value">{{ totalAppeals }}</h3>
              <p class="stat-label">Total Appeals</p>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon bg-green-100">
              <mat-icon class="text-green-600">check_circle</mat-icon>
            </div>
            <div class="stat-content">
              <h3 class="stat-value">{{ completedAppeals }}</h3>
              <p class="stat-label">Completed</p>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon bg-yellow-100">
              <mat-icon class="text-yellow-600">pending</mat-icon>
            </div>
            <div class="stat-content">
              <h3 class="stat-value">{{ processingAppeals }}</h3>
              <p class="stat-label">Processing</p>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon bg-red-100">
              <mat-icon class="text-red-600">error</mat-icon>
            </div>
            <div class="stat-content">
              <h3 class="stat-value">{{ failedAppeals }}</h3>
              <p class="stat-label">Failed</p>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="recent-appeals">
        <div class="section-header">
          <h2 class="text-xl font-semibold text-gray-900">Recent Appeals</h2>
          <button mat-raised-button color="primary" routerLink="/new-appeal">
            <mat-icon>add</mat-icon>
            New Appeal
          </button>
        </div>

        <div class="appeals-grid">
          <mat-card *ngFor="let appeal of recentAppeals" class="appeal-card">
            <mat-card-header>
              <mat-card-title>{{ appeal.examName }}</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="appeal-status">
                <span class="status-badge" [ngClass]="getStatusClass(appeal.status)">
                  {{ appeal.status }}
                </span>
                <mat-progress-bar
                  *ngIf="appeal.status === 'processing'"
                  mode="indeterminate"
                  class="mt-2"
                ></mat-progress-bar>
              </div>
              <p class="appeal-date">Submitted: {{ appeal.createdAt | date }}</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-button color="primary" [routerLink]="['/appeals', appeal.id]">
                View Details
              </button>
            </mat-card-actions>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      @apply space-y-8;
    }

    .dashboard-header {
      @apply mb-8;
    }

    .stats-grid {
      @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6;
    }

    .stat-card {
      @apply overflow-hidden;
    }

    .stat-card mat-card-content {
      @apply flex items-center p-6;
    }

    .stat-icon {
      @apply p-3 rounded-full mr-4;
    }

    .stat-content {
      @apply flex-1;
    }

    .stat-value {
      @apply text-2xl font-bold text-gray-900;
    }

    .stat-label {
      @apply text-sm text-gray-600;
    }

    .section-header {
      @apply flex justify-between items-center mb-6;
    }

    .appeals-grid {
      @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6;
    }

    .appeal-card {
      @apply h-full;
    }

    .appeal-status {
      @apply mt-4;
    }

    .appeal-date {
      @apply text-sm text-gray-500 mt-2;
    }

    .status-badge {
      @apply px-3 py-1 rounded-full text-xs font-medium;
    }

    .status-completed {
      @apply bg-green-100 text-green-800;
    }

    .status-processing {
      @apply bg-blue-100 text-blue-800;
    }

    .status-failed {
      @apply bg-red-100 text-red-800;
    }
  `]
})
export class DashboardComponent implements OnInit {
  recentAppeals: ExamAppeal[] = [];
  totalAppeals = 0;
  completedAppeals = 0;
  processingAppeals = 0;
  failedAppeals = 0;

  constructor(private examAppealService: ExamAppealService) {}

  ngOnInit(): void {
    this.loadAppeals();
  }

  private loadAppeals(): void {
    this.examAppealService.getUserAppeals().subscribe({
      next: (appeals) => {
        this.recentAppeals = appeals.slice(0, 6);
        this.totalAppeals = appeals.length;
        this.completedAppeals = appeals.filter(a => a.status === 'completed').length;
        this.processingAppeals = appeals.filter(a => a.status === 'processing').length;
        this.failedAppeals = appeals.filter(a => a.status === 'failed').length;
      },
      error: (error) => {
        console.error('Error loading appeals:', error);
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'status-completed';
      case 'processing':
        return 'status-processing';
      case 'failed':
        return 'status-failed';
      default:
        return '';
    }
  }
} 