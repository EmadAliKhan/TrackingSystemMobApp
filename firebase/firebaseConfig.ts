// import { initializeApp } from "firebase/app";
// import { getDatabase } from "firebase/database";

// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_DOMAIN",
//   databaseURL: "YOUR_DB_URL",
//   projectId: "YOUR_ID",
//   storageBucket: "YOUR_BUCKET",
//   messagingSenderId: "YOUR_SENDER_ID",
//   appId: "YOUR_APP_ID",
// };

// const app = initializeApp(firebaseConfig);

// export const db = getDatabase(app);

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAvFGCaGFowbhspu9CVgZN0FQBKPj098ek",
  authDomain: "duet-7d65a.firebaseapp.com",
  projectId: "duet-7d65a",
  storageBucket: "duet-7d65a.firebasestorage.app",
  databaseURL:
    "https://duet-7d65a-default-rtdb.asia-southeast1.firebasedatabase.app/",
  messagingSenderId: "484371506558",
  appId: "1:484371506558:web:892e825c58a89398bfff2f",
  measurementId: "G-L5KVEMZJM3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
