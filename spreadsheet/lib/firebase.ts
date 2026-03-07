// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyARF8XjBz9ZBt1aGEG0rbxIVz3i_Lmklv4",
  authDomain: "urmit-assignment.firebaseapp.com",
  projectId: "urmit-assignment",
  storageBucket: "urmit-assignment.firebasestorage.app",
  messagingSenderId: "207007943180",
  appId: "1:207007943180:web:8d2b8a5e544fe8eea5bc29",
  measurementId: "G-5X6XL9T98G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app)