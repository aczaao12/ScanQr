import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// TODO: Replace the following with your app's Firebase project configuration
// For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is optional
const firebaseConfig = {
  apiKey: "AIzaSyBTRQFiKpLewm8SeB_VVUnhj3r2ZdkufXM",
  authDomain: "scanqr-4244d.firebaseapp.com",
  databaseURL: "https://scanqr-4244d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "scanqr-4244d",
  storageBucket: "scanqr-4244d.firebasestorage.app",
  messagingSenderId: "685315039479",
  appId: "1:685315039479:web:75736fa3b3a25cbcd073f2",
  measurementId: "G-1GMV3PMVRM"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the database service
const database = getDatabase(app);

export { database };