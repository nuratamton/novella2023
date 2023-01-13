// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth/react-native";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCI5yFoq9B0Loxj2f_2F52yLhyNo9BpFU8",
  authDomain: "novella-29596.firebaseapp.com",
  projectId: "novella-29596",
  storageBucket: "novella-29596.appspot.com",
  messagingSenderId: "100201402057",
  appId: "1:100201402057:web:5ddd1aac2743f3872e0718",
  measurementId: "G-SFPQQ1VLZ4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export { auth };
export default app;
