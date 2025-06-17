import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyD7iXbRnlVWaNXSO6LPB6ISFs2ysLyAjEQ",
  authDomain: "ca-wan.firebaseapp.com",
  projectId: "ca-wan",
  storageBucket: "ca-wan.firebasestorage.app",
  messagingSenderId: "260088418676",
  appId: "1:260088418676:web:fa43eab1e7b428675c9c21",
  measurementId: "G-ZNGLQ2G828"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);