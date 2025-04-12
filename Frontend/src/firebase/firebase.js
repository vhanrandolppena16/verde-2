// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"; // Firebase initialization
import { getAuth } from "firebase/auth"; // Firebase authentication function     
import { getFirestore } from "firebase/firestore"; // ✅ Firestore added
import { getDatabase } from "firebase/database";

// import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDetiOAy6PqK1G7Elnp2zX7Poyl9x4lsYs",
  authDomain: "trial-verde-firestore-realtime.firebaseapp.com",
  databaseURL: "https://trial-verde-firestore-realtime-default-rtdb.firebaseio.com",
  projectId: "trial-verde-firestore-realtime",
  storageBucket: "trial-verde-firestore-realtime.firebasestorage.app",
  messagingSenderId: "247643878009",
  appId: "1:247643878009:web:bc8d04fd5c2d9c13a21aa8",
  measurementId: "G-DV4ZVDKSCS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const authentication = getAuth(app);
const db = getFirestore(app);
const rtdb = getDatabase(app);

// const analytics = getAnalytics(app);

// export authentication for checking of credentials
// export db for storing Company Name and Username
export { authentication, db, rtdb }; 