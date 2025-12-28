// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCcSFpckPHXzneYJdkCggg1XJ1bR_-nzgg",
  authDomain: "student-b3709.firebaseapp.com",
  projectId: "student-b3709",
  storageBucket: "student-b3709.firebasestorage.app",
  messagingSenderId: "234452118724",
  appId: "1:234452118724:web:36e4a79b23225cfbc7ad91",
  measurementId: "G-0L33YJEZFK",
  databaseURL:"https://student-b3709-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);