// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC0QF8D2nUSSlKmP5kNcfhBZ66UwdzaaUA",
  authDomain: "genibi-ng.firebaseapp.com",
  projectId: "genibi-ng",
  storageBucket: "genibi-ng.firebasestorage.app",
  messagingSenderId: "1052847797341",
  appId: "1:1052847797341:web:9bac5a8ad73a5e732e49b4",
  measurementId: "G-7E8R67CCEH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);