import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { ExamAppealService } from './services/exam-appeal.service';
import { FirebaseModule } from './firebase.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FirebaseModule
  ],
  providers: [
    AuthService,
    ExamAppealService
  ],
  exports: [
    FirebaseModule
  ]
})
export class CoreModule { }
