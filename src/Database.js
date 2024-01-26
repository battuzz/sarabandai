import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyA41wDOP_rRFNw0AILOieCrxnRPOnzb_a8",
  authDomain: "sarabandai.firebaseapp.com",
  projectId: "sarabandai",
  storageBucket: "sarabandai.appspot.com",
  messagingSenderId: "290172196545",
  appId: "1:290172196545:web:8fde0bcd03c8d7d0946640"
};


const app = initializeApp(firebaseConfig);
// Initialize Firebase
export const db = getFirestore(app);