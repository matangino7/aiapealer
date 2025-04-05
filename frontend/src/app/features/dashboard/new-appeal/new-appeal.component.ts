import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ExamAppealService } from '../../../core/services/exam-appeal.service';
import { ExamAppealFormData } from '../../../core/models/exam-appeal.model';

@Component({
  selector: 'app-new-appeal',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatSnackBarModule
  ],
  template: `
    <div class="new-appeal-container">
      <div class="page-header">
        <h1 class="text-3xl font-bold text-gray-900">New Appeal</h1>
        <p class="text-gray-600">Create a new exam appeal using our AI-powered system</p>
      </div>

      <mat-stepper linear #stepper>
        <!-- Step 1: Basic Information -->
        <mat-step [stepControl]="basicInfoForm">
          <form [formGroup]="basicInfoForm">
            <ng-template matStepLabel>Basic Information</ng-template>
            
            <div class="step-content">
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Exam Name</mat-label>
                <input matInput formControlName="examName" placeholder="e.g., Final Exam">
                <mat-error *ngIf="basicInfoForm.get('examName')?.hasError('required')">
                  Exam name is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Current Grade</mat-label>
                <input matInput formControlName="currentGrade" placeholder="e.g., B+">
                <mat-error *ngIf="basicInfoForm.get('currentGrade')?.hasError('required')">
                  Current grade is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Target Grade</mat-label>
                <input matInput formControlName="targetGrade" placeholder="e.g., A-">
                <mat-error *ngIf="basicInfoForm.get('targetGrade')?.hasError('required')">
                  Target grade is required
                </mat-error>
              </mat-form-field>
            </div>

            <div class="step-actions">
              <button mat-button matStepperNext>Next</button>
            </div>
          </form>
        </mat-step>

        <!-- Step 2: Upload Exam -->
        <mat-step [stepControl]="examUploadForm">
          <form [formGroup]="examUploadForm">
            <ng-template matStepLabel>Upload Exam</ng-template>
            
            <div class="step-content">
              <div class="upload-area" (click)="fileInput.click()" [class.has-file]="selectedFile">
                <input
                  #fileInput
                  type="file"
                  (change)="onFileSelected($event)"
                  accept=".pdf,.jpg,.jpeg,.png"
                  class="hidden"
                >
                <mat-icon>cloud_upload</mat-icon>
                <p class="upload-text">
                  {{ selectedFile ? selectedFile.name : 'Click to upload your exam paper' }}
                </p>
                <p class="upload-hint">Supported formats: PDF, JPG, PNG</p>
              </div>

              <mat-progress-bar
                *ngIf="isUploading"
                mode="determinate"
                [value]="uploadProgress"
                class="mt-4"
              ></mat-progress-bar>
            </div>

            <div class="step-actions">
              <button mat-button matStepperPrevious>Back</button>
              <button
                mat-button
                matStepperNext
                [disabled]="!selectedFile || isUploading"
              >
                Next
              </button>
            </div>
          </form>
        </mat-step>

        <!-- Step 3: Review & Submit -->
        <mat-step>
          <ng-template matStepLabel>Review & Submit</ng-template>
          
          <div class="step-content">
            <div class="review-card">
              <h3 class="review-title">Appeal Summary</h3>
              
              <div class="review-item">
                <span class="review-label">Exam Name:</span>
                <span class="review-value">{{ basicInfoForm.get('examName')?.value }}</span>
              </div>
              
              <div class="review-item">
                <span class="review-label">Current Grade:</span>
                <span class="review-value">{{ basicInfoForm.get('currentGrade')?.value }}</span>
              </div>
              
              <div class="review-item">
                <span class="review-label">Target Grade:</span>
                <span class="review-value">{{ basicInfoForm.get('targetGrade')?.value }}</span>
              </div>
              
              <div class="review-item">
                <span class="review-label">Uploaded File:</span>
                <span class="review-value">{{ selectedFile?.name }}</span>
              </div>
            </div>
          </div>

          <div class="step-actions">
            <button mat-button matStepperPrevious>Back</button>
            <button
              mat-raised-button
              color="primary"
              (click)="onSubmit()"
              [disabled]="isUploading"
            >
              Submit Appeal
            </button>
          </div>
        </mat-step>
      </mat-stepper>
    </div>
  `,
  styles: [`
    .new-appeal-container {
      @apply space-y-8;
    }

    .page-header {
      @apply mb-8;
    }

    .step-content {
      @apply space-y-6 mt-6;
    }

    .step-actions {
      @apply flex justify-end space-x-2 mt-6;
    }

    .upload-area {
      @apply border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors;
    }

    .upload-area.has-file {
      @apply border-blue-500 bg-blue-50;
    }

    .upload-area mat-icon {
      @apply text-4xl text-gray-400 mb-2;
    }

    .upload-text {
      @apply text-lg font-medium text-gray-900 mb-1;
    }

    .upload-hint {
      @apply text-sm text-gray-500;
    }

    .review-card {
      @apply bg-white rounded-lg shadow p-6;
    }

    .review-title {
      @apply text-xl font-semibold text-gray-900 mb-4;
    }

    .review-item {
      @apply flex justify-between py-2 border-b border-gray-100 last:border-0;
    }

    .review-label {
      @apply text-gray-600;
    }

    .review-value {
      @apply font-medium text-gray-900;
    }
  `]
})
export class NewAppealComponent {
  basicInfoForm: FormGroup;
  examUploadForm: FormGroup;
  selectedFile: File | null = null;
  isUploading = false;
  uploadProgress = 0;

  constructor(
    private fb: FormBuilder,
    private examAppealService: ExamAppealService
  ) {
    this.basicInfoForm = this.fb.group({
      examName: ['', Validators.required],
      currentGrade: ['', Validators.required],
      targetGrade: ['', Validators.required]
    });

    this.examUploadForm = this.fb.group({});
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  async onSubmit(): Promise<void> {
    if (this.basicInfoForm.valid && this.selectedFile) {
      this.isUploading = true;
      try {
        const appealData: ExamAppealFormData = {
          title: this.basicInfoForm.get('examName')?.value,
          description: `Appeal for ${this.basicInfoForm.get('examName')?.value}`,
          examImageUrl: '',
          institution: '',
          originalScore: this.basicInfoForm.get('currentGrade')?.value
        };

        await this.examAppealService.createAppeal(appealData);
        // Handle success (e.g., show success message, navigate to appeals list)
      } catch (error) {
        console.error('Error creating appeal:', error);
        // Handle error (e.g., show error message)
      } finally {
        this.isUploading = false;
      }
    }
  }
} 