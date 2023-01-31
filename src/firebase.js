// Import the functions you need from the SDKs you need
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeAuth, getReactNativePersistence} from 'firebase/auth/react-native';
import { getFirestore } from 'firebase/firestore';
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyCrmdQtlG8tDNmkBMwC2j8DZ187rMx3ACg",
  authDomain: "novella2023-33344.firebaseapp.com",
  projectId: "novella2023-33344",
  storageBucket: "novella2023-33344.appspot.com",
  messagingSenderId: "73821318900",
  appId: "1:73821318900:web:2cf0117529924a13bab8a1"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
  });
const db = getFirestore(app);
export {auth};
export {db};
export default app;
