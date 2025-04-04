import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ExamAppealService } from '../../../core/services/exam-appeal.service';
import { ExamAppealFormData } from '../../../core/models/exam-appeal.model';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatSnackBarModule
  ],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  
  uploadForm: FormGroup;
  selectedFiles: File[] = [];
  isUploading = false;
  uploadProgress = 0;
  isDragging = false;

  private readonly maxFileSize = 10 * 1024 * 1024; // 10MB
  private readonly maxFiles = 30;
  private readonly allowedFileTypes = ['.pdf', '.png', '.jpg', '.jpeg'];

  constructor(
    private fb: FormBuilder,
    private examAppealService: ExamAppealService,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {
    this.uploadForm = this.fb.group({
      examName: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const files = Array.from(input.files);
      this.handleFiles(files);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      this.handleFiles(fileArray);
    }
  }

  private handleFiles(files: File[]): void {
    // Check if adding these files would exceed the maximum
    if (this.selectedFiles.length + files.length > this.maxFiles) {
      this.snackBar.open(`Maximum ${this.maxFiles} files allowed`, 'Close', {
        duration: 5000,
        panelClass: 'error-snackbar'
      });
      return;
    }

    // Validate each file
    const validFiles = files.filter(file => this.validateFile(file));
    
    // Add valid files to the selection
    this.selectedFiles = [...this.selectedFiles, ...validFiles];
  }

  private validateFile(file: File): boolean {
    // Check file size
    if (file.size > this.maxFileSize) {
      this.snackBar.open('File size must be less than 10MB', 'Close', {
        duration: 5000,
        panelClass: 'error-snackbar'
      });
      return false;
    }

    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!this.allowedFileTypes.includes(fileExtension)) {
      this.snackBar.open('Only PDF, PNG, JPG, and JPEG files are allowed', 'Close', {
        duration: 5000,
        panelClass: 'error-snackbar'
      });
      return false;
    }

    return true;
  }

  removeFile(index: number): void {
    this.selectedFiles = this.selectedFiles.filter((_, i) => i !== index);
  }

  async onSubmit(): Promise<void> {
    if (this.uploadForm.valid && this.selectedFiles.length > 0) {
      this.isUploading = true;
      this.uploadProgress = 0;
      const user = this.authService.userSubject.value;

      try {
        // Extract form values
        const examName = this.uploadForm.get('examName')?.value;
        
        // Create the appeal form data
        const appealFormData: ExamAppealFormData = {
          title: examName,
          description: `Appeal for ${examName}`,
          originalScore: 0
        };
        
        // Create the appeal in Firestore
        this.uploadProgress = 30;
        const appeal = await this.examAppealService.createAppeal(appealFormData);

        // Process the appeal with multiple files
        this.uploadProgress = 60;
        if (appeal) {
          await this.examAppealService.processAppeal(appeal, this.selectedFiles, user?.uid!);
        }
        this.uploadProgress = 100;

        this.snackBar.open('Appeal submitted successfully', 'Close', {
          duration: 5000,
          panelClass: 'success-snackbar'
        });

        // Navigate to appeals list
        setTimeout(() => {
          this.router.navigate(['/appeals']);
        }, 1000);
      } catch (error) {
        console.error('Error submitting appeal:', error);
        this.snackBar.open('Error submitting appeal. Please try again.', 'Close', {
          duration: 5000,
          panelClass: 'error-snackbar'
        });
      } finally {
        this.isUploading = false;
      }
    } else {
      this.markFormGroupTouched(this.uploadForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}

