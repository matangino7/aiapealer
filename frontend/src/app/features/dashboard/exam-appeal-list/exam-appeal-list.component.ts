import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ExamAppealService } from '../../../core/services/exam-appeal.service';

@Component({
  selector: 'app-exam-appeal-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
      <div class="px-4 py-5 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
          My Exam Appeals
        </h3>
        <p class="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
          A list of all your exam appeals and their current status.
        </p>
      </div>
      <ul class="divide-y divide-gray-200 dark:divide-gray-700">
        <li *ngFor="let appeal of appeals$ | async">
          <a [routerLink]="['/dashboard', appeal.id]" class="block hover:bg-gray-50 dark:hover:bg-gray-700">
            <div class="px-4 py-4 sm:px-6">
              <div class="flex items-center justify-between">
                <p class="text-sm font-medium text-blue-600 truncate">
                  {{ appeal.examName }}
                </p>
                <div class="ml-2 flex-shrink-0 flex">
                  <p class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                     [ngClass]="{
                       'bg-green-100 text-green-800': appeal.status === 'completed',
                       'bg-yellow-100 text-yellow-800': appeal.status === 'processing',
                       'bg-red-100 text-red-800': appeal.status === 'failed'
                     }">
                    {{ appeal.status }}
                  </p>
                </div>
              </div>
              <div class="mt-2 sm:flex sm:justify-between">
                <div class="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                  <p>
                    Created on {{ appeal.createdAt | date }}
                  </p>
                </div>
              </div>
            </div>
          </a>
        </li>
      </ul>
      <div class="px-4 py-4 sm:px-6">
        <a
          routerLink="/dashboard/new"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Create New Appeal
        </a>
      </div>
    </div>
  `
})
export class ExamAppealListComponent implements OnInit {
  appeals$ = this.examAppealService.getUserAppeals();

  constructor(private examAppealService: ExamAppealService) {}

  ngOnInit() {}
} 