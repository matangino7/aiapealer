import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, setDoc, updateDoc, deleteDoc, getDoc, DocumentData, query, where, getDocs } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { Observable, from, map, of } from 'rxjs';
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
    const user = this.authService.userSubject.value;
    if (!user) {
      return of([]);
    }

    // Use the Firebase JavaScript SDK directly
    const appealsRef = collection(this.firestore, this.appealsCollection);
    
    // Create a query using the Firebase SDK
    const q = query(appealsRef, where('userId', '==', user.uid));
    
    // Use the Firebase SDK's getDocs function
    return from(getDocs(q)).pipe(
      map(querySnapshot => 
        querySnapshot.docs.map(doc => 
          this.convertToExamAppeal({ id: doc.id, ...doc.data() } as DocumentData & { id: string })
        )
      )
    );
  }

  getAppealById(id: string): Observable<ExamAppeal | undefined> {
    const appealRef = doc(this.firestore, this.appealsCollection, id);
    return from(getDoc(appealRef)).pipe(
      map(doc => doc.exists() ? this.convertToExamAppeal({ id: doc.id, ...doc.data() } as DocumentData & { id: string }) : undefined)
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
      status: 'processing',
      createdAt: new Date(),
      updatedAt: new Date(),
      examName: formData.title,
    };

    const appealsRef = collection(this.firestore, this.appealsCollection);
    const newAppealRef = doc(appealsRef);
    await setDoc(newAppealRef, { ...appeal, id: newAppealRef.id });
    return { ...appeal, id: newAppealRef.id };
  }


  async updateAppeal(id: string, updates: Partial<ExamAppeal>): Promise<void> {
    const appealRef = doc(this.firestore, this.appealsCollection, id);
    await updateDoc(appealRef, { ...updates, updatedAt: new Date() });
  }

  async deleteAppeal(id: string): Promise<void> {
    const appealRef = doc(this.firestore, this.appealsCollection, id);
    await deleteDoc(appealRef);
  }

  async processAppeal(appeal: ExamAppeal, files: File[], user: string): Promise<void> {
    const appealRef = doc(this.firestore, this.appealsCollection, appeal.id);
  
    // Step 1: Update to 'processing'
    await updateDoc(appealRef, {
      status: 'processing',
      updatedAt: new Date()
    });
  
    try {
      // Step 2: Send files to your Python Cloud Function
      const formData = new FormData();
      
      // Add each file with the key 'file' as expected by the backend
      files.forEach(file => {
        formData.append('file', file);
      });
      
      formData.append('appeal_id', appeal.id);
      formData.append('file_count', files.length.toString());
      
      const response = await fetch('http://localhost:8080', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user}`
        },
        body: formData
      });
  
      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }
  
      const data = await response.json();
  
      await updateDoc(appealRef, {
        status: 'completed',
        updatedAt: new Date(),
      });
  
    } catch (error) {
      console.error('Error processing appeal:', error);
      await updateDoc(appealRef, {
        status: 'failed',
        updatedAt: new Date()
      });
    }
  }
  

  async getAppeal(id: string): Promise<ExamAppeal | null> {
    const appealRef = doc(this.firestore, this.appealsCollection, id);
    const appealDoc = await getDoc(appealRef);
    if (!appealDoc.exists()) return null;
    return this.convertToExamAppeal({ id: appealDoc.id, ...appealDoc.data() } as DocumentData & { id: string });
  }


  private convertToExamAppeal(data: DocumentData & { id: string }): ExamAppeal {
    console.log('Converting data to ExamAppeal:', data);
    
    const appeal = {
      id: data.id,
      userId: data['userId'] as string,
      title: data['title'] as string,
      status: (data['status'] as 'processing' | 'completed' | 'failed') || 'processing',
      createdAt: (data['createdAt'] as any)?.toDate() || new Date(),
      updatedAt: (data['updatedAt'] as any)?.toDate() || new Date(),
      feedback: data['feedback'] as string | undefined,
      subject: data['subject'] as string | undefined,
      course: data['course'] as string | undefined,
      examName: data['examName'] as string || '',
      originalText: data['original_text'] as string | undefined,
      generatedAppeal: data['appeal'] as string | undefined,
    };
    
    console.log('Converted appeal:', appeal);
    return appeal;
  }
} 