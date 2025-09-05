import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCy6eBmunNtPOpRylqYNV4BEoj_KHmuLDs",
  authDomain: "genibi-app.firebaseapp.com",
  projectId: "genibi-app",
  storageBucket: "genibi-app.firebasestorage.app",
  messagingSenderId: "1063726901677",
  appId: "1:1063726901677:web:8fc0678edce8b6457a5924",
  measurementId: "G-G2SMJLD013"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics (disabled for React Native to prevent crashes)
// Analytics is not supported in React Native environment
let analytics = null;
export { analytics };

export default app;
