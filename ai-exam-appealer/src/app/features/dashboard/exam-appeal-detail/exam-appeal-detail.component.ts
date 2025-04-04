import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ExamAppealService } from '../../../core/services/exam-appeal.service';

@Component({
  selector: 'app-exam-appeal-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
      <div class="px-4 py-5 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
          Appeal Details
        </h3>
        <p class="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
          View and manage your exam appeal.
        </p>
      </div>
      <div class="border-t border-gray-200 dark:border-gray-700">
        <dl>
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Exam Name
            </dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
              {{ appeal?.examName }}
            </dd>
          </div>
          <div class="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Course Code
            </dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
              {{ appeal?.courseCode }}
            </dd>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Status
            </dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
              <span
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                [ngClass]="{
                  'bg-green-100 text-green-800': appeal?.status === 'completed',
                  'bg-yellow-100 text-yellow-800': appeal?.status === 'processing',
                  'bg-red-100 text-red-800': appeal?.status === 'failed'
                }"
              >
                {{ appeal?.status }}
              </span>
            </dd>
          </div>
          <div class="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Created At
            </dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
              {{ appeal?.createdAt | date }}
            </dd>
          </div>
        </dl>
      </div>

      <div class="px-4 py-5 sm:p-6" *ngIf="appeal?.status === 'completed'">
        <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Generated Appeal Letter
        </h4>
        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <pre class="whitespace-pre-wrap text-sm text-gray-900 dark:text-white">{{ appeal?.response }}</pre>
        </div>
        <div class="mt-4 flex justify-end">
          <button
            (click)="downloadAppeal()"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Download Appeal
          </button>
        </div>
      </div>

      <div class="px-4 py-5 sm:p-6" *ngIf="appeal?.status === 'processing'">
        <div class="flex items-center justify-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span class="ml-2 text-sm text-gray-500 dark:text-gray-400">Processing your appeal...</span>
        </div>
      </div>

      <div class="px-4 py-5 sm:p-6" *ngIf="appeal?.status === 'failed'">
        <div class="rounded-md bg-red-50 dark:bg-red-900 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
                Failed to process appeal
              </h3>
              <div class="mt-2 text-sm text-red-700 dark:text-red-300">
                <p>There was an error processing your appeal. Please try again or contact support if the problem persists.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ExamAppealDetailComponent implements OnInit {
  appeal: any;

  constructor(
    private route: ActivatedRoute,
    private examAppealService: ExamAppealService
  ) {}

  async ngOnInit() {
    const appealId = this.route.snapshot.paramMap.get('id');
    if (appealId) {
      this.appeal = await this.examAppealService.getAppeal(appealId);
    }
  }

  downloadAppeal() {
    if (this.appeal?.response) {
      const blob = new Blob([this.appeal.response], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `appeal-${this.appeal.examName}.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  }
} 