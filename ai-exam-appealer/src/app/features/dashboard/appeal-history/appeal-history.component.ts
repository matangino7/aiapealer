import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ExamAppealService } from '../../../core/services/exam-appeal.service';
import { ExamAppeal } from '../../../core/models/exam-appeal.model';

@Component({
  selector: 'app-appeal-history',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatSnackBarModule
  ],
  template: `
    <div class="min-h-screen bg-gray-100">
      <header class="bg-white shadow">
        <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 class="text-3xl font-bold text-gray-900">Appeal History</h1>
        </div>
      </header>

      <main>
        <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div class="px-4 py-6 sm:px-0">
            <div class="grid grid-cols-1 gap-6">
              <div *ngFor="let appeal of appeals" class="bg-white shadow rounded-lg overflow-hidden">
                <mat-card>
                  <mat-card-header>
                    <mat-card-title>{{ appeal.examName }}</mat-card-title>
                    <mat-card-subtitle>{{ appeal.courseCode }}</mat-card-subtitle>
                  </mat-card-header>
                  <mat-card-content>
                    <div class="mt-4">
                      <p class="text-sm text-gray-600">Status:</p>
                      <mat-chip-listbox>
                        <mat-chip [color]="getStatusColor(appeal.status)" selected>
                          {{ appeal.status }}
                        </mat-chip>
                      </mat-chip-listbox>
                    </div>
                    <div class="mt-4">
                      <p class="text-sm text-gray-600">Created:</p>
                      <p class="text-sm">{{ appeal.createdAt | date:'medium' }}</p>
                    </div>
                  </mat-card-content>
                  <mat-card-actions>
                    <button mat-button color="primary" (click)="viewAppeal(appeal)">
                      <mat-icon>visibility</mat-icon>
                      View
                    </button>
                    <button mat-button color="accent" (click)="downloadAppeal(appeal)">
                      <mat-icon>download</mat-icon>
                      Download
                    </button>
                    <button mat-button color="warn" (click)="deleteAppeal(appeal)">
                      <mat-icon>delete</mat-icon>
                      Delete
                    </button>
                  </mat-card-actions>
                </mat-card>
              </div>

              <div *ngIf="appeals.length === 0" class="text-center py-12">
                <mat-icon class="text-gray-400" style="font-size: 48px; width: 48px; height: 48px;">
                  history
                </mat-icon>
                <h3 class="mt-2 text-sm font-medium text-gray-900">No appeals yet</h3>
                <p class="mt-1 text-sm text-gray-500">
                  Get started by creating a new appeal.
                </p>
                <div class="mt-6">
                  <button mat-raised-button color="primary" routerLink="/dashboard/new">
                    Create New Appeal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `
})
export class AppealHistoryComponent implements OnInit {
  appeals: ExamAppeal[] = [];

  constructor(
    private examAppealService: ExamAppealService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadAppeals();
  }

  loadAppeals() {
    this.examAppealService.getUserAppeals().subscribe({
      next: (appeals) => {
        this.appeals = appeals;
      },
      error: (error) => {
        console.error('Error loading appeals:', error);
        this.snackBar.open('Error loading appeals. Please try again.', 'Close', {
          duration: 5000
        });
      }
    });
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'primary';
      case 'completed':
        return 'accent';
      case 'failed':
        return 'warn';
      default:
        return '';
    }
  }

  viewAppeal(appeal: ExamAppeal) {
    // TODO: Implement view appeal functionality
    console.log('View appeal:', appeal);
  }

  async downloadAppeal(appeal: ExamAppeal) {
    try {
      await this.examAppealService.downloadAppeal(appeal.id);
      this.snackBar.open('Appeal downloaded successfully!', 'Close', {
        duration: 5000
      });
    } catch (error) {
      console.error('Error downloading appeal:', error);
      this.snackBar.open('Error downloading appeal. Please try again.', 'Close', {
        duration: 5000
      });
    }
  }

  async deleteAppeal(appeal: ExamAppeal) {
    if (confirm('Are you sure you want to delete this appeal?')) {
      try {
        await this.examAppealService.deleteAppeal(appeal.id);
        this.appeals = this.appeals.filter(a => a.id !== appeal.id);
        this.snackBar.open('Appeal deleted successfully!', 'Close', {
          duration: 5000
        });
      } catch (error) {
        console.error('Error deleting appeal:', error);
        this.snackBar.open('Error deleting appeal. Please try again.', 'Close', {
          duration: 5000
        });
      }
    }
  }
} 