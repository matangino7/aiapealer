import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { ExamAppealService } from '../../../core/services/exam-appeal.service';
import { ExamAppeal } from '../../../core/models/exam-appeal.model';

@Component({
  selector: 'app-appeal-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatMenuModule,
    MatDialogModule
  ],
  template: `
    <div class="appeal-list-container">
      <div class="list-header">
        <h1 class="text-3xl font-bold text-gray-900">My Appeals</h1>
        <button mat-raised-button color="primary" routerLink="/new-appeal">
          <mat-icon>add</mat-icon>
          New Appeal
        </button>
      </div>

      <div class="filters">
        <mat-card class="filter-card">
          <mat-card-content>
            <div class="filter-stats">
              <div class="filter-stat">
                <span class="filter-label">Total</span>
                <span class="filter-value">{{ appeals.length }}</span>
              </div>
              <div class="filter-stat">
                <span class="filter-label">Completed</span>
                <span class="filter-value">{{ getCompletedCount() }}</span>
              </div>
              <div class="filter-stat">
                <span class="filter-label">Processing</span>
                <span class="filter-value">{{ getProcessingCount() }}</span>
              </div>
              <div class="filter-stat">
                <span class="filter-label">Failed</span>
                <span class="filter-value">{{ getFailedCount() }}</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="appeals-grid">
        <mat-card *ngFor="let appeal of appeals" class="appeal-card">
          <mat-card-header>
            <mat-card-title>{{ appeal.examName }}</mat-card-title>
            <mat-card-subtitle>{{ appeal.courseCode }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="appeal-details">
              <div class="detail-item">
                <mat-icon>calendar_today</mat-icon>
                <span>Submitted: {{ appeal.createdAt | date }}</span>
              </div>
              <div class="detail-item">
                <mat-icon>school</mat-icon>
                <span>Grade: {{ appeal.currentGrade }}</span>
              </div>
              <div class="detail-item">
                <mat-icon>target</mat-icon>
                <span>Target Grade: {{ appeal.targetGrade }}</span>
              </div>
            </div>
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
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary" [routerLink]="['/appeals', appeal.id]">
              <mat-icon>visibility</mat-icon>
              View Details
            </button>
            <button mat-button color="accent" [routerLink]="['/appeals', appeal.id, 'edit']">
              <mat-icon>edit</mat-icon>
              Edit
            </button>
            <button mat-button color="warn" (click)="deleteAppeal(appeal)">
              <mat-icon>delete</mat-icon>
              Delete
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <div *ngIf="appeals.length === 0" class="empty-state">
        <mat-icon>inbox</mat-icon>
        <h2>No Appeals Yet</h2>
        <p>Start by creating your first exam appeal</p>
        <button mat-raised-button color="primary" routerLink="/new-appeal">
          Create Appeal
        </button>
      </div>
    </div>
  `,
  styles: [`
    .appeal-list-container {
      @apply space-y-8;
    }

    .list-header {
      @apply flex justify-between items-center mb-8;
    }

    .filters {
      @apply mb-8;
    }

    .filter-card {
      @apply bg-white;
    }

    .filter-stats {
      @apply grid grid-cols-2 md:grid-cols-4 gap-4;
    }

    .filter-stat {
      @apply flex flex-col items-center p-4;
    }

    .filter-label {
      @apply text-sm text-gray-600;
    }

    .filter-value {
      @apply text-2xl font-bold text-gray-900 mt-1;
    }

    .appeals-grid {
      @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6;
    }

    .appeal-card {
      @apply h-full;
    }

    .appeal-details {
      @apply space-y-2 mt-4;
    }

    .detail-item {
      @apply flex items-center text-gray-600;
    }

    .detail-item mat-icon {
      @apply mr-2 text-gray-400;
    }

    .appeal-status {
      @apply mt-4;
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

    .empty-state {
      @apply flex flex-col items-center justify-center py-12 text-center;
    }

    .empty-state mat-icon {
      @apply text-6xl text-gray-400 mb-4;
    }

    .empty-state h2 {
      @apply text-xl font-semibold text-gray-900 mb-2;
    }

    .empty-state p {
      @apply text-gray-600 mb-4;
    }
  `]
})
export class AppealListComponent implements OnInit {
  appeals: ExamAppeal[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(private examAppealService: ExamAppealService) {}

  ngOnInit(): void {
    this.loadAppeals();
  }

  private loadAppeals(): void {
    this.isLoading = true;
    this.examAppealService.getUserAppeals().subscribe({
      next: (appeals: ExamAppeal[]) => {
        this.appeals = appeals;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load appeals';
        this.isLoading = false;
        console.error('Error loading appeals:', error);
      }
    });
  }

  async deleteAppeal(appeal: ExamAppeal): Promise<void> {
    if (confirm('Are you sure you want to delete this appeal?')) {
      try {
        await this.examAppealService.deleteAppeal(appeal.id);
        this.appeals = this.appeals.filter(a => a.id !== appeal.id);
      } catch (error) {
        console.error('Error deleting appeal:', error);
        alert('Failed to delete appeal');
      }
    }
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

  getCompletedCount(): number {
    return this.appeals.filter(a => a.status === 'completed').length;
  }

  getProcessingCount(): number {
    return this.appeals.filter(a => a.status === 'processing').length;
  }

  getFailedCount(): number {
    return this.appeals.filter(a => a.status === 'failed').length;
  }
}
