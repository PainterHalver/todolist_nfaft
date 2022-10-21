// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAsJjP5XySOq6WbyAGt3JrdHaXKg7_kdqM",
  authDomain: "todo-nextjs-b29ae.firebaseapp.com",
  projectId: "todo-nextjs-b29ae",
  storageBucket: "todo-nextjs-b29ae.appspot.com",
  messagingSenderId: "960087122043",
  appId: "1:960087122043:web:e922bc6f65641d736142de",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);

export default db;
