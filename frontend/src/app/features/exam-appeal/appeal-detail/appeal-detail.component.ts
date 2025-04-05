import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ExamAppealService } from '../../../core/services/exam-appeal.service';
import { ExamAppeal } from '../../../core/models/exam-appeal.model';

@Component({
  selector: 'app-appeal-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatDialogModule
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
    private router: Router,
    private examAppealService: ExamAppealService,
    private dialog: MatDialog
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
      
      console.log('Loaded appeal:', this.appeal);
      
      if (!this.appeal) {
        this.error = 'Appeal not found';
      }
    } catch (err) {
      this.error = 'Failed to load appeal';
      console.error(err);
    } finally {
      this.isLoading = false;
    }
  }

  async deleteAppeal(): Promise<void> {
    if (!this.appeal) return;
    
    if (confirm('Are you sure you want to delete this appeal? This action cannot be undone.')) {
      try {
        this.isLoading = true;
        await this.examAppealService.deleteAppeal(this.appeal.id);
        this.router.navigate(['/appeals']);
      } catch (err) {
        this.error = 'Failed to delete appeal';
        console.error(err);
        this.isLoading = false;
      }
    }
  }
}
