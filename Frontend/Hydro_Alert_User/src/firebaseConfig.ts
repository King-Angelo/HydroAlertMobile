// Import Firebase Web SDK functions
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getAnalytics, Analytics } from 'firebase/analytics';

/**
 * NOTE: The following Firebase configuration uses environment variables 
 * (VITE_..._KEY) which are loaded from your .env file in the project root.
 * This is crucial for security and separation of concerns in a Vite project.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBZOZUCWltSVebiL8sAnOTjk-28Oj6-bq0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "hydroalert-user.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "hydroalert-user",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "hydroalert-user.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "326280723017",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:326280723017:web:71cc175864ae7408c09d98",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-5KTPNNMG7F"
};

// Initialize Firebase App
const app: FirebaseApp = initializeApp(firebaseConfig);

// Export initialized services
export const db: Firestore = getFirestore(app);
export const auth: Auth = getAuth(app);
export const analytics: Analytics = getAnalytics(app);

export default app;