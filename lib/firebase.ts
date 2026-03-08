import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyARF8XjBz9ZBt1aGEG0rbxIVz3i_Lmklv4",
  authDomain: "urmit-assignment.firebaseapp.com",
  projectId: "urmit-assignment",
  storageBucket: "urmit-assignment.firebasestorage.app",
  messagingSenderId: "207007943180",
  appId: "1:207007943180:web:8d2b8a5e544fe8eea5bc29",
  measurementId: "G-5X6XL9T98G"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);