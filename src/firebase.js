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
  apiKey: "AIzaSyCLJ1P-cXaiUtJnPw0q55AkJMEdkowuYIo",
  authDomain: "novellaplusultra.firebaseapp.com",
  projectId: "novellaplusultra",
  storageBucket: "novellaplusultra.appspot.com",
  messagingSenderId: "582611680492",
  appId: "1:582611680492:web:4b7aa5f71cce48517939c9"
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
