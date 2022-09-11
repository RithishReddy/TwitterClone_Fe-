import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDTuHWK1gB-hsewQ9YjWFdZRnuudJxNUp4",
  authDomain: "twitter-afda3.firebaseapp.com",
  projectId: "twitter-afda3",
  storageBucket: "twitter-afda3.appspot.com",
  messagingSenderId: "511694247051",
  appId: "1:511694247051:web:a1a9afd71e130a050bb08e",
  measurementId: "G-8LN80R6F31"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);