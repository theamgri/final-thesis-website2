// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs,  deleteDoc, doc } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC2vt_wOW9FaY-XpftR6Mac4rrna7M2_sk",
  authDomain: "capstone-e6f46.firebaseapp.com",
  projectId: "capstone-e6f46",
  storageBucket: "capstone-e6f46.appspot.com",
  messagingSenderId: "683458610099",
  appId: "1:683458610099:web:b29156b120cbe74cefc1c6",
  measurementId: "G-F4TMM0M53Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, app, collection, getDocs, deleteDoc, doc};