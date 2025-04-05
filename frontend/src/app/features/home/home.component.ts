import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from 'src/app/core/services/auth.service';
import { trigger, transition, style, animate, query, stagger, state } from '@angular/animations';
import { Observable, interval, of } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.8s ease-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('slideInFromLeft', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-50px)' }),
        animate('0.8s cubic-bezier(0.35, 0, 0.25, 1)', 
          style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('slideInFromRight', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(50px)' }),
        animate('0.8s cubic-bezier(0.35, 0, 0.25, 1)', 
          style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('slideInFromBottom', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(50px)' }),
        animate('0.8s cubic-bezier(0.35, 0, 0.25, 1)', 
          style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('staggerList', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(30px)' }),
          stagger(200, [
            animate('0.8s cubic-bezier(0.35, 0, 0.25, 1)', 
              style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('pulseAnimation', [
      state('normal', style({ transform: 'scale(1)' })),
      state('pulsed', style({ transform: 'scale(1.05)' })),
      transition('normal <=> pulsed', [
        animate('1s ease-in-out')
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {
  currentUser$ = this.authService.user$;
  featureCards = [
    {
      icon: 'upload_file',
      title: 'Upload Your Exam',
      description: 'Upload your exam document in PDF, DOC, or DOCX format. Our system supports files up to 10MB.',
      animation: 'slideInFromLeft'
    },
    {
      icon: 'psychology',
      title: 'AI Analysis',
      description: 'Our advanced AI analyzes your exam answers and identifies potential areas for appeal based on grading criteria.',
      animation: 'slideInFromBottom'
    },
    {
      icon: 'description',
      title: 'Generate Appeal',
      description: 'Receive a professionally crafted appeal document with supporting arguments and evidence from your exam.',
      animation: 'slideInFromRight'
    }
  ];
  
  // Animated text for hero section
  animatedTitle$: Observable<string> = of('');
  private titleText = 'Transform Your Exam Appeals with AI';
  private titleWords: string[] = [];
  
  // Animation states
  pulseState = 'normal';

  constructor(private authService: AuthService) {
    this.titleWords = this.titleText.split(' ');
  }
  
  ngOnInit(): void {
    // Create animated title effect with slower typing
    this.animatedTitle$ = interval(300).pipe(
      take(this.titleWords.length),
      map(i => this.titleWords.slice(0, i + 1).join(' '))
    );
    
    // Start pulse animation
    this.startPulseAnimation();
  }
  
  private startPulseAnimation(): void {
    setInterval(() => {
      this.pulseState = this.pulseState === 'normal' ? 'pulsed' : 'normal';
    }, 3000);
  }
} 