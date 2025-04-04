import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { ThemeService } from 'src/app/core/services/theme.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <div class="logo-container">
            <mat-icon class="logo-icon">school</mat-icon>
            <h1 class="app-name">Exam Appealer</h1>
          </div>
          <h2 class="auth-title">Welcome Back</h2>
          <p class="auth-subtitle">Sign in to your account to continue</p>
        </div>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" type="email" placeholder="your@email.com">
            <mat-icon matPrefix>email</mat-icon>
            <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
              Email is required
            </mat-error>
            <mat-error *ngIf="loginForm.get('email')?.hasError('email')">
              Please enter a valid email
            </mat-error>
          </mat-form-field>
          
          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Password</mat-label>
            <input matInput formControlName="password" [type]="hidePassword ? 'password' : 'text'">
            <mat-icon matPrefix>lock</mat-icon>
            <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
              <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
            </button>
            <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
              Password is required
            </mat-error>
            <mat-error *ngIf="loginForm.get('password')?.hasError('minlength')">
              Password must be at least 6 characters
            </mat-error>
          </mat-form-field>
          
          <div class="form-actions">
            <button 
              mat-flat-button 
              color="primary" 
              type="submit" 
              class="submit-button"
              [disabled]="loginForm.invalid || isLoading">
              <mat-icon *ngIf="!isLoading">login</mat-icon>
              <mat-spinner *ngIf="isLoading" diameter="20"></mat-spinner>
              <span>{{ isLoading ? 'Signing in...' : 'Sign in' }}</span>
            </button>
          </div>
        </form>
        
        <div class="auth-footer">
          <p class="auth-redirect">
            Don't have an account? 
            <a routerLink="/auth/register" class="auth-link">Create one</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, var(--background-color) 0%, var(--card-background) 100%);
      padding: 20px;
    }
    
    .auth-card {
      width: 100%;
      max-width: 420px;
      background-color: var(--card-background);
      border-radius: 16px;
      box-shadow: 0 8px 30px var(--shadow-color);
      padding: 40px;
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
      transition: background-color 0.3s ease, box-shadow 0.3s ease;
      
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, var(--primary-color) 0%, var(--primary-dark) 100%);
      }
    }
    
    .logo-container {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 24px;
    }
    
    .logo-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      margin-right: 12px;
      color: var(--primary-color);
    }
    
    .app-name {
      font-size: 24px;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0;
    }
    
    .auth-header {
      text-align: center;
      margin-bottom: 32px;
    }
    
    .auth-title {
      font-size: 28px;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 8px 0;
    }
    
    .auth-subtitle {
      font-size: 16px;
      color: var(--text-secondary);
      margin: 0;
    }
    
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    
    .form-field {
      width: 100%;
      
      ::ng-deep {
        .mat-mdc-form-field-flex {
          background-color: var(--input-background);
        }
        
        .mat-mdc-form-field-focus-overlay {
          background-color: var(--hover-color);
        }
        
        .mdc-text-field--outlined {
          --mdc-outlined-text-field-container-shape: 12px;
        }
        
        .mat-mdc-form-field-icon-prefix {
          color: var(--primary-color);
        }
        
        .mat-mdc-text-field-wrapper {
          padding: 0;
        }
        
        .mat-mdc-form-field-infix {
          padding-top: 12px;
          padding-bottom: 12px;
          min-height: 48px;
          width: auto;
        }
        
        .mdc-text-field--outlined .mdc-notched-outline {
          border-radius: 12px;
        }
        
        .mat-mdc-input-element {
          padding-left: 8px;
          box-sizing: border-box;
          width: 100%;
        }
        
        .mat-mdc-form-field-subscript-wrapper {
          display: none;
        }
        
        .mat-mdc-form-field-icon-suffix {
          margin-right: 8px;
        }
        
        .mat-mdc-form-field-icon-prefix {
          margin-left: 8px;
        }
        
        .mdc-notched-outline__notch {
          border-right: none;
        }
      }
    }
    
    .form-actions {
      margin-top: 8px;
    }
    
    .submit-button {
      width: 100%;
      height: 48px;
      font-size: 16px;
      font-weight: 500;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      border-radius: 12px;
      background: linear-gradient(90deg, var(--primary-color) 0%, var(--primary-dark) 100%);
      transition: transform 0.2s ease;
      
      &:hover:not(:disabled) {
        transform: translateY(-1px);
      }
      
      &:active:not(:disabled) {
        transform: translateY(0);
      }
      
      &:disabled {
        background: var(--border-color);
      }
    }
    
    .auth-footer {
      margin-top: 32px;
      text-align: center;
    }
    
    .auth-redirect {
      color: var(--text-secondary);
      font-size: 14px;
      margin: 0;
    }
    
    .auth-link {
      color: var(--primary-color);
      font-weight: 500;
      text-decoration: none;
      transition: color 0.2s ease;
      
      &:hover {
        color: var(--primary-dark);
        text-decoration: underline;
      }
    }
    
    @media (max-width: 480px) {
      .auth-card {
        padding: 32px 24px;
      }
      
      .auth-title {
        font-size: 24px;
      }
      
      .auth-subtitle {
        font-size: 14px;
      }
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private themeService: ThemeService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Subscribe to theme changes to ensure component updates when theme changes
    this.themeService.darkMode$.subscribe();
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      try {
        const { email, password } = this.loginForm.value;
        await this.authService.loginWithEmail(email, password);
        this.router.navigate(['/dashboard']);
      } catch (error) {
        console.error('Login failed:', error);
        this.snackBar.open('Login failed. Please check your credentials and try again.', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      } finally {
        this.isLoading = false;
      }
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
