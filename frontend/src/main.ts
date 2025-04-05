import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { environment } from './environments/environment';
import { appConfig } from './app/app.config';

// Initialize Firebase
const app = initializeApp(environment.firebase);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

// Make Firebase Auth available globally
(window as any).firebase = {
  auth: () => auth
};

// Add Firebase providers to appConfig
const config = {
  ...appConfig,
  providers: [
    ...appConfig.providers,
    { provide: 'FIREBASE_APP', useValue: app },
    { provide: 'FIREBASE_AUTH', useValue: auth },
    { provide: 'FIREBASE_FIRESTORE', useValue: firestore },
    { provide: 'FIREBASE_STORAGE', useValue: storage }
  ]
};

bootstrapApplication(AppComponent, config).catch(err => console.error(err));
