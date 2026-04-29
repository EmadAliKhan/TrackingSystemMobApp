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
// import { getAnalytics } from "firebase/analytics";
// import { initializeApp } from "firebase/app";
// import { getDatabase } from "firebase/database";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyABJTEoDMfjrRn-fRmmGB60yFRZWL8cL6k",
//   authDomain: "duet-d59f1.firebaseapp.com",
//   databaseURL: "https://duet-d59f1-default-rtdb.asia-southeast1.firebasedatabase.app", //added
//   projectId: "duet-d59f1",
//   storageBucket: "duet-d59f1.firebasestorage.app",
//   messagingSenderId: "163312644274",
//   appId: "1:163312644274:web:e0153b10668ea3d28f99ab",
//   measurementId: "G-G4GEH1JJTM",
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// export const db = getDatabase(app);

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDTeGyfKdvPUyw4iG0_JOv8q4DzNqJ9jkE",
  authDomain: "tracking-system-9381a.firebaseapp.com",
  databaseURL: "https://tracking-system-9381a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tracking-system-9381a",
  storageBucket: "tracking-system-9381a.firebasestorage.app",
  messagingSenderId: "87382367144",
  appId: "1:87382367144:web:3a1474c909ff504bb7db9d",
  measurementId: "G-P86DE9DVN7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getDatabase(app);