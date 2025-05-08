import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBNeD2FqjAWAf8MaKhk2FeqfY3Fn08wA5I",
  authDomain: "shoppingapp-4fb82.firebaseapp.com",
  projectId: "shoppingapp-4fb82",
  storageBucket: "shoppingapp-4fb82.firebasestorage.app",
  messagingSenderId: "724169005899",
  appId: "1:724169005899:web:ed909abccdd9ae287a26ce",
  measurementId: "G-DLZDQCN8YZ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
