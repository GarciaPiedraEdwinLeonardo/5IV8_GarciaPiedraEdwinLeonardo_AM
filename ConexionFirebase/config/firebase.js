import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBoQ8SNoiNNy_Q8SgZhiI5DKMUdvaptJLA",
  authDomain: "apps-mov-ff086.firebaseapp.com",
  projectId: "apps-mov-ff086",
  storageBucket: "apps-mov-ff086.firebasestorage.app",
  messagingSenderId: "672740336094",
  appId: "1:672740336094:web:626ff0b5be45c0bee0fd4f"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);