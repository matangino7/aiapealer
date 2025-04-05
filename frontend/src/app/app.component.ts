import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { ThemeService } from './core/services/theme.service';
import { filter } from 'rxjs/operators';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatMenuModule,
    MatTooltipModule,
    MatSlideToggleModule,
    FormsModule
  ],
  template: `
    <div class="app-container" [@fadeAnimation]>
      <mat-sidenav-container class="app-sidenav-container">
        <mat-sidenav #sidenav [mode]="isMobile ? 'over' : 'side'" [opened]="!isMobile" class="app-sidenav">
          <div class="sidenav-header">
            <div class="logo-container" [@logoAnimation]>
              <div class="logo-icon">
                <mat-icon>psychology</mat-icon>
              </div>
              <div class="logo-text">
                <span class="logo-title">AI Exam</span>
                <span class="logo-subtitle">Appealer</span>
              </div>
            </div>
          </div>
          
          <mat-nav-list [@listAnimation]>
            <a mat-list-item routerLink="/home" routerLinkActive="active" [@itemAnimation] (click)="closeSidenavIfMobile()">
              <mat-icon matListItemIcon>home</mat-icon>
              <span matListItemTitle>Home</span>
            </a>
            <a mat-list-item routerLink="/dashboard" routerLinkActive="active" [@itemAnimation] (click)="closeSidenavIfMobile()">
              <mat-icon matListItemIcon>dashboard</mat-icon>
              <span matListItemTitle>Dashboard</span>
            </a>
            <a mat-list-item routerLink="/appeals" routerLinkActive="active" [@itemAnimation] (click)="closeSidenavIfMobile()">
              <mat-icon matListItemIcon>description</mat-icon>
              <span matListItemTitle>My Appeals</span>
            </a>
            <a mat-list-item routerLink="/new-appeal" routerLinkActive="active" [@itemAnimation] (click)="closeSidenavIfMobile()">
              <mat-icon matListItemIcon>add_circle</mat-icon>
              <span matListItemTitle>New Appeal</span>
            </a>
          </mat-nav-list>
          
          <mat-divider></mat-divider>
          
          <div class="sidenav-footer">
            <ng-container *ngIf="authService.user$ | async as user; else loginButton">
              <div class="user-section" [@userAnimation]>
                <mat-icon class="user-icon">account_circle</mat-icon>
                <div class="user-info">
                  <span class="user-email">{{ user.email }}</span>
                  <button mat-button class="logout-button" (click)="authService.logout()">
                    <mat-icon>logout</mat-icon>
                    Sign out
                  </button>
                </div>
              </div>
            </ng-container>
            <ng-template #loginButton>
              <div class="user-section" [@userAnimation]>
                <mat-icon class="user-icon">account_circle</mat-icon>
                <div class="user-info">
                  <button mat-button class="login-button" routerLink="/auth/login">
                    <mat-icon>login</mat-icon>
                    Sign in
                  </button>
                </div>
              </div>
            </ng-template>
            
            <div class="theme-toggle-container">
              <div class="theme-toggle-wrapper" [@toggleAnimation]>
                <mat-icon class="theme-icon">{{ isDarkMode ? 'dark_mode' : 'light_mode' }}</mat-icon>
                <mat-slide-toggle 
                  [checked]="isDarkMode" 
                  (change)="toggleTheme()"
                  color="primary"
                  class="theme-toggle">
                  {{ isDarkMode ? 'Dark Mode' : 'Light Mode' }}
                </mat-slide-toggle>
              </div>
            </div>
          </div>
        </mat-sidenav>

        <mat-sidenav-content class="app-sidenav-content">
          <mat-toolbar class="app-toolbar" *ngIf="isMobile">
            <button mat-icon-button (click)="sidenav.toggle()">
              <mat-icon>menu</mat-icon>
            </button>
            <span class="toolbar-title">AI Exam Appealer</span>
            <span class="toolbar-spacer"></span>
            <button mat-icon-button [matMenuTriggerFor]="themeMenu">
              <mat-icon>{{ isDarkMode ? 'dark_mode' : 'light_mode' }}</mat-icon>
            </button>
            <mat-menu #themeMenu="matMenu">
              <button mat-menu-item (click)="toggleTheme()">
                <mat-icon>{{ isDarkMode ? 'light_mode' : 'dark_mode' }}</mat-icon>
                <span>Switch to {{ isDarkMode ? 'Light' : 'Dark' }} Mode</span>
              </button>
            </mat-menu>
          </mat-toolbar>
          
          <div class="content-container" [@routeAnimation]="getRouteAnimationData()">
            <router-outlet></router-outlet>
          </div>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
      background-color: var(--background-color);
    }

    .app-sidenav-container {
      flex: 1;
    }

    .app-sidenav {
      width: 260px;
      background-color: var(--card-background);
      border-right: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
    }

    .app-toolbar {
      background-color: var(--card-background);
      color: var(--text-primary);
      border-bottom: 1px solid var(--border-color);
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .toolbar-title {
      margin-left: 16px;
      font-weight: 500;
    }

    .toolbar-spacer {
      flex: 1 1 auto;
    }

    .sidenav-header {
      padding: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-bottom: 1px solid var(--border-color);
    }

    .logo-container {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 16px;
      border-radius: 12px;
      background: linear-gradient(135deg, 
        rgba(var(--primary-rgb), 0.1) 0%, 
        rgba(var(--primary-rgb), 0.05) 100%);
      border: 1px solid rgba(var(--primary-rgb), 0.2);
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.15);
      }
    }

    .logo-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background-color: var(--primary-color);
      color: white;
      
      mat-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
      }
    }

    .logo-text {
      display: flex;
      flex-direction: column;
    }

    .logo-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary);
      line-height: 1.2;
    }

    .logo-subtitle {
      font-size: 1rem;
      font-weight: 500;
      color: var(--primary-color);
      line-height: 1.2;
    }

    .app-sidenav-content {
      background-color: var(--background-color);
    }

    .content-container {
      padding: 32px;
      max-width: 1200px;
      margin: 0 auto;
      
      @media (max-width: 768px) {
        padding: 16px;
      }
    }

    mat-nav-list {
      padding: 8px 0;
    }

    .mat-mdc-list-item {
      margin: 4px 8px;
      border-radius: 8px;
      transition: all 0.3s ease;
      
      &.active {
        background-color: var(--primary-color);
        color: white;
        
        mat-icon {
          color: white;
        }
      }
      
      &:hover:not(.active) {
        background-color: var(--hover-color);
        transform: translateX(4px);
      }
      
      mat-icon {
        color: var(--text-secondary);
        transition: color 0.3s ease;
      }
      
      span {
        color: var(--text-primary);
        transition: color 0.3s ease;
      }
    }

    .sidenav-footer {
      margin-top: auto;
      padding: 16px;
      border-top: 1px solid var(--border-color);
    }

    .user-section {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px;
      border-radius: 8px;
      background-color: var(--background-color);
      transition: all 0.3s ease;
      
      &:hover {
        background-color: var(--hover-color);
      }
    }

    .user-icon {
      color: var(--text-secondary);
      transition: color 0.3s ease;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .user-email {
      font-size: 0.875rem;
      color: var(--text-primary);
    }

    .logout-button {
      color: var(--text-secondary);
      font-size: 0.875rem;
      transition: all 0.3s ease;
      
      &:hover {
        color: var(--primary-color);
      }
      
      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
    }

    .theme-toggle-container {
      margin-top: 16px;
    }

    .theme-toggle-wrapper {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px;
      border-radius: 8px;
      background-color: var(--background-color);
      transition: all 0.3s ease;
      
      &:hover {
        background-color: var(--hover-color);
      }
    }

    .theme-icon {
      color: var(--text-secondary);
      transition: color 0.3s ease;
    }

    .theme-toggle {
      flex: 1;
      
      ::ng-deep .mdc-form-field {
        width: 100%;
      }
      
      ::ng-deep .mdc-label {
        color: var(--text-primary);
      }
      
      ::ng-deep .mdc-switch__track {
        background-color: var(--border-color);
      }
      
      ::ng-deep .mdc-switch__handle-track {
        background-color: var(--primary-color);
      }
    }

    .login-button {
      color: var(--text-secondary);
      font-size: 0.875rem;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: 8px;
      background: none;
      border: none;
      
      &:hover {
        background-color: var(--hover-color);
        transform: translateY(-1px);
        color: var(--primary-color);
      }
      
      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
        color: var(--text-secondary);
        transition: color 0.3s ease;
      }

      &:hover mat-icon {
        color: var(--primary-color);
      }
    }

    @media (max-width: 768px) {
      .app-sidenav {
        width: 100%;
        max-width: 260px;
      }
      
      .sidenav-header {
        padding: 16px;
      }
      
      .logo-container {
        padding: 6px 12px;
      }
      
      .logo-icon {
        width: 36px;
        height: 36px;
      }
      
      .logo-title {
        font-size: 1.125rem;
      }
      
      .logo-subtitle {
        font-size: 0.875rem;
      }
      
      .sidenav-footer {
        padding: 12px;
      }
      
      .user-section {
        padding: 6px;
      }
      
      .user-email {
        font-size: 0.8rem;
      }
      
      .logout-button {
        font-size: 0.8rem;
      }
      
      .theme-toggle-container {
        margin-top: 12px;
      }
    }
  `],
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.5s ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('0.5s ease-in', style({ opacity: 0 }))
      ])
    ]),
    trigger('logoAnimation', [
      transition(':enter', [
        style({ transform: 'scale(0.8)', opacity: 0 }),
        animate('0.5s 0.2s cubic-bezier(0.35, 0, 0.25, 1)', 
          style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ]),
    trigger('listAnimation', [
      transition(':enter', [
        query('a', [
          style({ opacity: 0, transform: 'translateX(-20px)' }),
          stagger(100, [
            animate('0.5s cubic-bezier(0.35, 0, 0.25, 1)', 
              style({ opacity: 1, transform: 'translateX(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('itemAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate('0.5s cubic-bezier(0.35, 0, 0.25, 1)', 
          style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('userAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.5s cubic-bezier(0.35, 0, 0.25, 1)', 
          style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('buttonAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('0.5s cubic-bezier(0.35, 0, 0.25, 1)', 
          style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ]),
    trigger('toggleAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.5s cubic-bezier(0.35, 0, 0.25, 1)', 
          style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('routeAnimation', [
      transition('* <=> *', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.5s cubic-bezier(0.35, 0, 0.25, 1)', 
          style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class AppComponent implements OnInit {
  isDarkMode = false;
  currentRoute = '';
  isMobile = false;

  constructor(
    private themeService: ThemeService,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.themeService.darkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
    
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.urlAfterRedirects;
    });
    
    // Check if the device is mobile
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small
    ]).subscribe(result => {
      this.isMobile = result.matches;
    });
  }

  getRouteAnimationData() {
    return this.currentRoute;
  }

  toggleTheme(): void {
    this.themeService.toggleDarkMode();
  }
  
  closeSidenavIfMobile(): void {
    if (this.isMobile) {
      // We need to access the sidenav reference here
      // This is a workaround since we can't directly access the sidenav in the template
      const sidenavElement = document.querySelector('mat-sidenav');
      if (sidenavElement) {
        // @ts-ignore - Accessing the opened property
        sidenavElement.opened = false;
      }
    }
  }
}
