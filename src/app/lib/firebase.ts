import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyCz0r4TsnOpkGzSvmnzIMgsJqrPdD1qaVI",
  authDomain: "grandes-ligas-barber.firebaseapp.com",
  databaseURL: "https://grandes-ligas-barber-default-rtdb.firebaseio.com",
  projectId: "grandes-ligas-barber",
  storageBucket: "grandes-ligas-barber.firebasestorage.app",
  messagingSenderId: "565990482270",
  appId: "1:565990482270:web:920aeb66f35a07414cefcf",
  measurementId: "G-GYZKZXD6Z2",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
const functions = getFunctions(app);
