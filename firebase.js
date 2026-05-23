import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getFirestore, collection, doc, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit, serverTimestamp, increment } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js';

const firebaseConfig = {
  apiKey: "AIzaSyAkZIagcuOzJvguZUbxmly6hWiRt9nFG7s",
  authDomain: "fibo-trading.firebaseapp.com",
  projectId: "fibo-trading",
  storageBucket: "fibo-trading.firebasestorage.app",
  messagingSenderId: "1087097748601",
  appId: "1:1087097748601:web:da9ab9148f25ed9799a8a8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export {
  db, auth, storage,
  collection, doc, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, limit, serverTimestamp, increment,
  signInWithEmailAndPassword, onAuthStateChanged, signOut,
  ref, uploadBytes, getDownloadURL
};
