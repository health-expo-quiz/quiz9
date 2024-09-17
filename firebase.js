import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCW8I1Cr-4WGfbqaBWtz5A3ajAOZUqjJTc",
    authDomain: "health-expo-quiz-test.firebaseapp.com",
    projectId: "health-expo-quiz-test",
    storageBucket: "health-expo-quiz-test.appspot.com",
    messagingSenderId: "992897944471",
    appId: "1:992897944471:web:ef0bc55963d3c10f1ad2d2",
    measurementId: "G-DSR6BVM3V2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
