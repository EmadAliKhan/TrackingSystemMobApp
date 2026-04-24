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
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyABJTEoDMfjrRn-fRmmGB60yFRZWL8cL6k",
  authDomain: "duet-d59f1.firebaseapp.com",
  projectId: "duet-d59f1",
  storageBucket: "duet-d59f1.firebasestorage.app",
  messagingSenderId: "163312644274",
  appId: "1:163312644274:web:e0153b10668ea3d28f99ab",
  measurementId: "G-G4GEH1JJTM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getDatabase(app);
