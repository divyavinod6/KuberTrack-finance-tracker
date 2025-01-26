// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCqIFg6sipRpykHUc_vOKBakTlpP_cHTAw',
  authDomain: 'kubertrack-fin.firebaseapp.com',
  projectId: 'kubertrack-fin',
  storageBucket: 'kubertrack-fin.appspot.com',
  messagingSenderId: '426566586136',
  appId: '1:426566586136:web:40d55b7e10641bd80e186d',
  measurementId: 'G-CDFHQT45LP',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { db, auth, provider, doc, setDoc };
