// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDhvl-1OaLVQe7BS745YJRm6719Zxkk-cc",
    authDomain: "languagelearning-5bf8f.firebaseapp.com",
    projectId: "languagelearning-5bf8f",
    storageBucket: "languagelearning-5bf8f.appspot.com",
    messagingSenderId: "785099551174",
    appId: "1:785099551174:web:27cff8f8dd4319fa2b82c7",
    measurementId: "G-K9BL52QC4M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
