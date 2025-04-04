import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ExamAppealService } from '../../../core/services/exam-appeal.service';

@Component({
  selector: 'app-exam-appeal-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
          Create New Exam Appeal
        </h3>
        <div class="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-400">
          <p>Upload your exam feedback and we'll help you generate a professional appeal letter.</p>
        </div>
        <form [formGroup]="appealForm" (ngSubmit)="onSubmit()" class="mt-5 space-y-6">
          <div>
            <label for="examName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Exam Name
            </label>
            <div class="mt-1">
              <input
                type="text"
                id="examName"
                formControlName="examName"
                class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="e.g., Final Exam"
              />
            </div>
          </div>

          <div>
            <label for="courseCode" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Course Code
            </label>
            <div class="mt-1">
              <input
                type="text"
                id="courseCode"
                formControlName="courseCode"
                class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="e.g., CS101"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Exam Feedback Image
            </label>
            <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md dark:border-gray-600">
              <div class="space-y-1 text-center">
                <svg
                  class="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <div class="flex text-sm text-gray-600 dark:text-gray-400">
                  <label
                    for="file-upload"
                    class="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      type="file"
                      (change)="onFileSelected($event)"
                      class="sr-only"
                      accept="image/*"
                    />
                  </label>
                  <p class="pl-1">or drag and drop</p>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
          </div>

          <div class="flex justify-end">
            <button
              type="submit"
              [disabled]="appealForm.invalid || !selectedFile"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Submit Appeal
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class ExamAppealFormComponent {
  appealForm: FormGroup;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private examAppealService: ExamAppealService,
    private router: Router
  ) {
    this.appealForm = this.fb.group({
      examName: ['', Validators.required],
      courseCode: ['', Validators.required]
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  async onSubmit() {
    if (this.appealForm.valid && this.selectedFile) {
      try {
        const { examName, courseCode } = this.appealForm.value;
        await this.examAppealService.uploadExamAppeal(
          this.selectedFile,
          examName,
          courseCode
        );
        this.router.navigate(['/dashboard']);
      } catch (error) {
        console.error('Failed to submit appeal:', error);
        // TODO: Show error message to user
      }
    }
  }
} 