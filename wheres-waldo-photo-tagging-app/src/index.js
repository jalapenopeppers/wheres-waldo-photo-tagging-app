import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import RouteSwitch from './RouteSwitch';

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAxQ3tiGuBwAceE5T14m8fojOfMRCuhZuI",
  authDomain: "wheres-waldo-31bd7.firebaseapp.com",
  projectId: "wheres-waldo-31bd7",
  storageBucket: "wheres-waldo-31bd7.appspot.com",
  messagingSenderId: "377940125644",
  appId: "1:377940125644:web:fad96d395495fb4a8f1f69"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get reference to the service
export const db = getFirestore(app);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouteSwitch />
  </React.StrictMode>
);