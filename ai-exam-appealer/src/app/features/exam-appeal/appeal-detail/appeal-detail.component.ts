import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ExamAppealService } from '../../../core/services/exam-appeal.service';
import { ExamAppeal } from '../../../core/models/exam-appeal.model';

@Component({
  selector: 'app-appeal-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule
  ],
  templateUrl: './appeal-detail.component.html',
  styleUrls: ['./appeal-detail.component.scss']
})
export class AppealDetailComponent implements OnInit {
  appeal: ExamAppeal | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private examAppealService: ExamAppealService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadAppeal(id);
    } else {
      this.error = 'Appeal ID not found';
      this.isLoading = false;
    }
  }

  async loadAppeal(id: string): Promise<void> {
    try {
      this.isLoading = true;
      this.appeal = await this.examAppealService.getAppeal(id);
    } catch (err) {
      this.error = 'Failed to load appeal';
      console.error(err);
    } finally {
      this.isLoading = false;
    }
  }

  async downloadAppeal(): Promise<void> {
    if (this.appeal) {
      try {
        await this.examAppealService.downloadAppeal(this.appeal.id);
      } catch (err) {
        console.error('Error downloading appeal:', err);
      }
    }
  }
}
