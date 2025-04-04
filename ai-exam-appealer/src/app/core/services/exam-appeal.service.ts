import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, setDoc, updateDoc, deleteDoc, getDoc, DocumentData } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { Observable, from, map } from 'rxjs';
import { ExamAppeal, ExamAppealFormData } from '../models/exam-appeal.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ExamAppealService {
  private appealsCollection = 'appeals';

  constructor(
    private firestore: Firestore,
    private storage: Storage,
    private authService: AuthService
  ) {}

  getAppeals(): Observable<ExamAppeal[]> {
    const appealsRef = collection(this.firestore, this.appealsCollection);
    return collectionData(appealsRef, { idField: 'id' }).pipe(
      map(appeals => appeals.map(appeal => this.convertToExamAppeal(appeal as DocumentData & { id: string })))
    );
  }

  getUserAppeals(): Observable<ExamAppeal[]> {
    return this.getAppeals().pipe(
      map(appeals => appeals.filter(appeal => appeal.userId === this.authService.userSubject.value?.uid))
    );
  }

  getAppealById(id: string): Observable<ExamAppeal | undefined> {
    const appealRef = doc(this.firestore, this.appealsCollection, id);
    return from(getDoc(appealRef)).pipe(
      map(doc => doc.exists() ? { id: doc.id, ...doc.data() } as ExamAppeal : undefined)
    );
  }

  async createAppeal(formData: ExamAppealFormData): Promise<ExamAppeal> {
    const user = this.authService.userSubject.value;
    if (!user) {
      throw new Error('User must be logged in to create an appeal');
    }

    const appeal: ExamAppeal = {
      id: '', // Will be set by Firestore
      userId: user.uid,
      title: formData.title,
      description: formData.description,
      examImageUrl: formData.examImageUrl,
      appealText: '',
      status: 'processing',
      createdAt: new Date(),
      updatedAt: new Date(),
      subject: formData.subject,
      course: formData.course,
      institution: formData.institution,
      originalScore: formData.originalScore,
      examName: formData.title,
      courseCode: formData.subject || '',
      currentGrade: formData.originalScore || 0,
      targetGrade: (formData.originalScore || 0) + 10 // Default to 10 points higher
    };

    const appealsRef = collection(this.firestore, this.appealsCollection);
    const newAppealRef = doc(appealsRef);
    await setDoc(newAppealRef, { ...appeal, id: newAppealRef.id });
    return { ...appeal, id: newAppealRef.id };
  }

  async uploadExamAppeal(file: File, examName: string, courseCode: string): Promise<string> {
    const user = this.authService.userSubject.value;
    if (!user) {
      throw new Error('User must be logged in to upload an appeal');
    }

    const filePath = `appeals/${user.uid}/${examName}_${courseCode}_${Date.now()}`;
    const storageRef = ref(this.storage, filePath);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  }

  async updateAppeal(id: string, updates: Partial<ExamAppeal>): Promise<void> {
    const appealRef = doc(this.firestore, this.appealsCollection, id);
    await updateDoc(appealRef, { ...updates, updatedAt: new Date() });
  }

  async deleteAppeal(id: string): Promise<void> {
    const appealRef = doc(this.firestore, this.appealsCollection, id);
    await deleteDoc(appealRef);
  }

  async processAppeal(appeal: ExamAppeal): Promise<void> {
    // Here you would implement the actual appeal processing logic
    // For now, we'll just update the status
    await this.updateAppeal(appeal.id, {
      status: 'completed',
      appealText: 'AI-generated appeal text will appear here.',
      feedback: 'Your appeal has been processed successfully.'
    });
  }

  async getAppeal(id: string): Promise<ExamAppeal | null> {
    const appealRef = doc(this.firestore, this.appealsCollection, id);
    const appealDoc = await getDoc(appealRef);
    if (!appealDoc.exists()) return null;
    return this.convertToExamAppeal({ id: appealDoc.id, ...appealDoc.data() } as DocumentData & { id: string });
  }

  async downloadAppeal(id: string): Promise<void> {
    const appeal = await this.getAppeal(id);
    if (appeal?.examImageUrl) {
      window.open(appeal.examImageUrl, '_blank');
    }
  }

  private convertToExamAppeal(data: DocumentData & { id: string }): ExamAppeal {
    return {
      id: data.id,
      userId: data['userId'] as string,
      title: data['title'] as string,
      description: data['description'] as string,
      examImageUrl: data['examImageUrl'] as string | undefined,
      appealText: data['appealText'] as string,
      status: (data['status'] as 'processing' | 'completed' | 'failed') || 'processing',
      createdAt: (data['createdAt'] as any)?.toDate() || new Date(),
      updatedAt: (data['updatedAt'] as any)?.toDate() || new Date(),
      feedback: data['feedback'] as string | undefined,
      score: data['score'] as number | undefined,
      originalScore: data['originalScore'] as number | undefined,
      subject: data['subject'] as string | undefined,
      course: data['course'] as string | undefined,
      institution: data['institution'] as string | undefined,
      examName: data['examName'] as string || '',
      courseCode: data['courseCode'] as string || '',
      currentGrade: Number(data['currentGrade']) || 0,
      targetGrade: Number(data['targetGrade']) || 0
    };
  }
} 