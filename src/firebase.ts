// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC9YLZ-xBPX2BDNBCtrNdnR8TOT3ANO37g",
  authDomain: "bell-i.firebaseapp.com",
  projectId: "bell-i",
  storageBucket: "bell-i.appspot.com",
  messagingSenderId: "855759559335",
  appId: "1:855759559335:web:dc7945fd13cf81af249982",
  measurementId: "G-B7BJH0G2W8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);