import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app-routing.module';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AuthService } from './core/services/auth.service';
import { ExamAppealService } from './core/services/exam-appeal.service';
import { FirebaseModule } from './core/firebase.module';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    importProvidersFrom(FirebaseModule),
    AuthService,
    ExamAppealService
  ]
};
