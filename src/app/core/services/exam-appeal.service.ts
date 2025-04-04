import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, setDoc, updateDoc, deleteDoc, getDoc, DocumentData, query, where } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { Observable, from, map, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ExamAppeal, ExamAppealFormData } from '../models/exam-appeal.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ExamAppealService {
  private mockAppeals: ExamAppeal[] = [
    {
      id: '1',
      userId: 'demo-user-id',
      title: 'Math Exam Appeal',
      description: 'I believe my grade should be higher on the calculus exam.',
      examImageUrl: 'https://via.placeholder.com/300x400?text=Math+Exam',
      appealText: 'I believe there was an error in the grading of my calculus exam. Question 3 was marked incorrect, but I followed the correct methodology.',
      status: 'completed',
      createdAt: new Date('2023-03-15'),
      updatedAt: new Date('2023-03-16'),
      feedback: 'Your appeal has been reviewed. The grading was correct, but we appreciate your detailed explanation.',
      score: 85,
      originalScore: 75,
      subject: 'Mathematics',
      course: 'Calculus II',
      institution: 'University of Example',
      examName: 'Calculus II Final Exam',
      courseCode: 'MATH201',
      currentGrade: 75,
      targetGrade: 85
    }
  ];

  private appealsCollection = 'appeals';

  constructor(
    private firestore: Firestore,
    private storage: Storage,
    private authService: AuthService
  ) {}

  getAppeals(): Observable<ExamAppeal[]> {
    return of(this.mockAppeals).pipe(delay(1000));
  }

  getAppeal(id: string): Observable<ExamAppeal> {
    const appeal = this.mockAppeals.find(a => a.id === id);
    if (!appeal) {
      throw new Error('Appeal not found');
    }
    return of(appeal).pipe(delay(1000));
  }

  getUserAppeals(): Observable<ExamAppeal[]> {
    const user = this.authService.userSubject.value;
    if (!user) {
      return of([]);
    }

    const appealsRef = collection(this.firestore, this.appealsCollection);
    const userAppealsQuery = query(appealsRef, where('userId', '==', user.uid));
    
    return collectionData(userAppealsQuery, { idField: 'id' }).pipe(
      map(appeals => appeals.map(appeal => this.convertToExamAppeal(appeal as DocumentData & { id: string })))
    );
  }

  createAppeal(formData: ExamAppealFormData): Observable<ExamAppeal> {
    const newAppeal: ExamAppeal = {
      id: (this.mockAppeals.length + 1).toString(),
      userId: 'demo-user-id',
      title: formData.title,
      description: formData.description,
      examImageUrl: formData.examImageUrl,
      appealText: 'AI-generated appeal text will appear here.',
      status: 'processing',
      createdAt: new Date(),
      updatedAt: new Date(),
      subject: formData.subject,
      course: formData.course,
      institution: formData.institution,
      originalScore: formData.originalScore,
      examName: formData.examName,
      courseCode: formData.courseCode,
      currentGrade: formData.currentGrade,
      targetGrade: formData.targetGrade
    };

    this.mockAppeals.push(newAppeal);
    return of(newAppeal).pipe(delay(1500));
  }

  uploadExamAppeal(file: File, examName: string, courseCode: string): Observable<ExamAppeal> {
    const formData: ExamAppealFormData = {
      title: `${examName} Appeal`,
      description: `Appeal for ${examName} in ${courseCode}`,
      examName,
      courseCode,
      currentGrade: 0,
      targetGrade: 0
    };
    return this.createAppeal(formData);
  }

  downloadAppeal(id: string): Observable<void> {
    return of(void 0).pipe(delay(1000));
  }

  deleteAppeal(id: string): Observable<void> {
    this.mockAppeals = this.mockAppeals.filter(a => a.id !== id);
    return of(void 0).pipe(delay(1000));
  }

  processAppeal(appeal: ExamAppeal): Observable<ExamAppeal> {
    const updatedAppeal = {
      ...appeal,
      status: 'completed' as const,
      updatedAt: new Date()
    };
    
    const index = this.mockAppeals.findIndex(a => a.id === appeal.id);
    if (index !== -1) {
      this.mockAppeals[index] = updatedAppeal;
    }
    
    return of(updatedAppeal).pipe(delay(1500));
  }

  private convertToExamAppeal(appeal: DocumentData & { id: string }): ExamAppeal {
    return {
      id: appeal.id,
      userId: appeal.userId,
      title: appeal.title,
      description: appeal.description,
      examImageUrl: appeal.examImageUrl,
      appealText: appeal.appealText,
      status: appeal.status,
      createdAt: new Date(appeal.createdAt.toDate()),
      updatedAt: new Date(appeal.updatedAt.toDate()),
      feedback: appeal.feedback,
      score: appeal.score,
      originalScore: appeal.originalScore,
      subject: appeal.subject,
      course: appeal.course,
      institution: appeal.institution,
      examName: appeal.examName,
      courseCode: appeal.courseCode,
      currentGrade: appeal.currentGrade,
      targetGrade: appeal.targetGrade
    };
  }
} 