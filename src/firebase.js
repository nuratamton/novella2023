// Import the functions you need from the SDKs you need
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth/react-native";
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyCPgq2IE97GwGvPp-pjwik5y5n0Bl63FdQ",
  authDomain: "novella-final-1.firebaseapp.com",
  projectId: "novella-final-1",
  storageBucket: "novella-final-1.appspot.com",
  messagingSenderId: "443875417576",
  appId: "1:443875417576:web:3d51a394f1efe91942985d"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const db = getFirestore(app);
export { auth };
export { db };
export default app;
