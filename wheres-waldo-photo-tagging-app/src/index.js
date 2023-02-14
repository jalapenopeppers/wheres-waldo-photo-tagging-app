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

/**
 * Imports all level images and their JS files
 * @return {promise} Promise which resolves to an array holding objects
 *   for each level that each have a level image and a level JS object
 */
export async function importLevels() {
  let doneImporting = false;
  let levelObjsArray = [];
  let levelCounter = 1;
  while (!doneImporting) {
    try {
      const module = await import(`./levels/level-${levelCounter}/level-${levelCounter}.js`);
      // console.log(module.LevelObj);
      const module2 = await import(`./levels/level-${levelCounter}/level-${levelCounter}-photo.jpg`);
      module.LevelObj.imgSrc = module2.default;
      levelObjsArray.push(module.LevelObj);
      levelCounter++;
    } catch {
      doneImporting = true;
    }
  }
  // Returned array is actually a Promise
  return levelObjsArray;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouteSwitch />
  </React.StrictMode>
);