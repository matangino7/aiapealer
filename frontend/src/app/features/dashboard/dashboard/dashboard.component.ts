import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable } from 'rxjs';
import { ExamAppealService } from '../../../core/services/exam-appeal.service';
import { ExamAppeal } from '../../../core/models/exam-appeal.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  appeals$: Observable<ExamAppeal[]>;
  displayedColumns: string[] = ['examName', 'createdAt', 'status', 'actions'];

  constructor(private examAppealService: ExamAppealService) {
    this.appeals$ = this.examAppealService.getUserAppeals();
  }

  ngOnInit(): void {
    // Additional initialization if needed
  }

  getCompletedCount(appeals: ExamAppeal[]): number {
    return appeals.filter(appeal => appeal.status === 'completed').length;
  }

  getProcessingCount(appeals: ExamAppeal[]): number {
    return appeals.filter(appeal => appeal.status === 'processing').length;
  }

  getFailedCount(appeals: ExamAppeal[]): number {
    return appeals.filter(appeal => appeal.status === 'failed').length;
  }
}
