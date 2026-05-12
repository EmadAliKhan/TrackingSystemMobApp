// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAvFGCaGFowbhspu9CVgZN0FQBKPj098ek",
  authDomain: "duet-7d65a.firebaseapp.com",
  databaseURL:
    "https://duet-7d65a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "duet-7d65a",
  storageBucket: "duet-7d65a.firebasestorage.app",
  messagingSenderId: "484371506558",
  appId: "1:484371506558:web:892e825c58a89398bfff2f",
  measurementId: "G-L5KVEMZJM3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getDatabase(app);
