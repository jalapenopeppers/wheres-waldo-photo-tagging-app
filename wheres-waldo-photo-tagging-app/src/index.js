import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBOF-8f9NOq8v-hIVZDorIIMKWRB0wgV5Q",
  authDomain: "where-s-waldo-a40e3.firebaseapp.com",
  projectId: "where-s-waldo-a40e3",
  storageBucket: "where-s-waldo-a40e3.appspot.com",
  messagingSenderId: "203974093335",
  appId: "1:203974093335:web:28d28241df1e4f940d4a52"
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
