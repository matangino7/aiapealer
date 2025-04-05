import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ExamAppealService } from '../../../core/services/exam-appeal.service';
import { ExamAppeal } from '../../../core/models/exam-appeal.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-appeal-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './appeal-list.component.html',
  styleUrls: ['./appeal-list.component.scss']
})
export class AppealListComponent implements OnInit {
  appeals$: Observable<ExamAppeal[]>;

  constructor(private examAppealService: ExamAppealService) {
    this.appeals$ = this.examAppealService.getUserAppeals();
  }

  ngOnInit(): void {
    // Additional initialization if needed
  }
}
