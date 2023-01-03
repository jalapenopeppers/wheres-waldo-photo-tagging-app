import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// import reportWebVitals from './reportWebVitals';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

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

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
