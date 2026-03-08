import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyARF8XjBz9ZBt1aGEG0rbxIVz3i_Lmklv4",
   authDomain: "urmit-assignment.firebaseapp.com",
   projectId: "urmit-assignment",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);