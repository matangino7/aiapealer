import { Injectable } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User } from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { User as AppUser } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<AppUser | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private auth: Auth) {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.userSubject.next(this.mapFirebaseUser(user));
      } else {
        this.userSubject.next(null);
      }
    });
  }

  async loginWithEmail(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async loginWithGoogle(): Promise<void> {
    try {
      const provider = new GoogleAuthProvider();
      await this.auth.signInWithPopup(provider);
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  }

  async register(email: string, password: string, displayName: string): Promise<void> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      await userCredential.user.updateProfile({ displayName });
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  private mapFirebaseUser(user: User): AppUser {
    return {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || undefined,
      photoURL: user.photoURL || undefined,
      createdAt: new Date(),
      lastLogin: new Date()
    };
  }
} 