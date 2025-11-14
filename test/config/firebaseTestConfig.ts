// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseTestConfig = {
  apiKey: "AIzaSyCM0Y0XGRkPvQZzhfv0tavYo6c4R7WBD3Q",
  authDomain: "bell-i-test.firebaseapp.com",
  projectId: "bell-i-test",
  storageBucket: "bell-i-test.firebasestorage.app",
  messagingSenderId: "270083152668",
  appId: "1:270083152668:web:2903afb9c1be51dd50b8d9",
  measurementId: "G-LDDVRTLEEC"
};

// Initialize Firebase
export const app =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp(firebaseTestConfig);
// Only enable analytics when truly supported
isSupported().then((supported) => {
  if (supported) {
    getAnalytics(app);
  }
}).catch(() => {
  /** ignore — analytics not supported */
});
export const db = getFirestore(app);
export const auth = getAuth(app);