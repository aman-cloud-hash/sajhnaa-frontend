import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAhxSwS8AFPxtP08b1PflPH1sP1asX6Eds",
    authDomain: "sajhnaa-12cdd.firebaseapp.com",
    projectId: "sajhnaa-12cdd",
    storageBucket: "sajhnaa-12cdd.firebasestorage.app",
    messagingSenderId: "1048749566414",
    appId: "1:1048749566414:web:5658f83d93b552af03e39f",
    measurementId: "G-074HWDMDW7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
