import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDQFPLQeuq9tjYu-zDaTcCT2FXx8qszoV4",
    authDomain: "tasks-c6940.firebaseapp.com",
    projectId: "tasks-c6940",
    storageBucket: "tasks-c6940.appspot.com",
    messagingSenderId: "379113516652",
    appId: "1:379113516652:web:002da0b34d65ccb03fb249",
    measurementId: "G-1YP99J5KRY"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore();

