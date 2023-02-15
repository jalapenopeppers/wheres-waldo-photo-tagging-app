import './Level.css';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

// Firebase
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../index.js';

import Timer from './Timer';
import CharacterDropDown from './CharacterDropDown';

// TEST
import char1 from '../levels/level-2/character-1-photo.jpg';
import char2 from '../levels/level-2/character-2-photo.jpg';
import char3 from '../levels/level-2/character-3-photo.jpg';

Number.prototype.map = function (in_min, in_max, out_min, out_max) {
  return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

async function importLevel(levelID) {
  let module = {};
  try {
    module = await import(`../levels/${levelID}/${levelID}.js`);
  } catch (e) {
    console.log(e);
  }
  // Returned object is actually a Promise
  return module.LevelObj;
}
async function importLevelImage(levelID) {
  let module = {};
  try {
    module = await import(`../levels/${levelID}/${levelID}-photo.jpg`);
  } catch (e) {
    console.log(e);
  }
  // Returned object is actually a Promise
  return module;
}
async function importCharacterImages(levelID) {
  let module1 = {};
  let module2 = {};
  let module3 = {};
  try {
    module1 = await import(`../levels/${levelID}/character-1-photo.jpg`);
    module2 = await import(`../levels/${levelID}/character-2-photo.jpg`);
    module3 = await import(`../levels/${levelID}/character-3-photo.jpg`);
  } catch (e) {
    console.log(e);
  }
  // Returned object is actually a Promise
  return [
    module1.default,
    module2.default,
    module3.default
  ];
}

/*
  Gets character coords and img base coords from fireStore given a levelObj
  Returns object with each character's coords in the image and the img's base coords
    (used for window resizing calculations)
  */ 
async function importCoords(levelObj) {
  const docRefCharCoords = doc(db, `/levels/${levelObj.levelID}/characters/characters-coords`);
  const docSnapCharCoords = await getDoc(docRefCharCoords);
  const docRefImgBaseCoords = doc(db, `/levels/${levelObj.levelID}/characters/level-img-base-size`);
  const docSnapImgBaseCoords = await getDoc(docRefImgBaseCoords);
  if (docSnapCharCoords.exists() && docSnapImgBaseCoords.exists()) {
    console.log("Document data:", docSnapCharCoords.data(), docSnapImgBaseCoords.data());
    return await {
      'img-base-coords': docSnapImgBaseCoords.data(),
      'char-coords': docSnapCharCoords.data()
    };

  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
    return null;
  }
}

function Level() {
  const urlParams = useParams();
  const levelID = urlParams.levelID;

  const [showTargetingBox, setShowTargetingBox] = useState(false);
  const [targetingBoxArr, _setTargetingBoxArr] = useState([]);
  const targetingBoxArrRef = useRef(targetingBoxArr);
  const setTargetingBoxArr = (newTargetingBoxArr) => {
    targetingBoxArrRef.current = newTargetingBoxArr;
    _setTargetingBoxArr(newTargetingBoxArr);
  }
  const [currState, setCurrState] = useState('loading');
  const [levelImg, setLevelImg] = useState('');
  const [characterImgArray, setCharacterImgArray] = useState([]);
  const [levelObj, setLevelObj] = useState({});
  const imgBaseCoordsRef = useRef([]);
  const [charactersCoords, _setCharactersCoords] = useState({});
  const fireStoreCharCoordsRef = useRef(charactersCoords); // Stores initial coords from fireStore, should not change after initialization
  const charCoordsRef = useRef(charactersCoords);
  const setCharactersCoords = (charCoordsObj) => {
    charCoordsRef.current = charCoordsObj;
    _setCharactersCoords(charCoordsObj);
  }
  const levelObjPromise = importLevel(levelID);
  useEffect(() => {
    levelObjPromise
      .then((obj) => {
        console.log(obj);
        setLevelObj(obj);
        const charCoords = importCoords(obj);
        charCoords.then((coordsObj) => {
          const imgBaseCoords = coordsObj['img-base-coords'];
          imgBaseCoordsRef.current = imgBaseCoords;

          const charCoords = coordsObj['char-coords'];
          setCharactersCoords(charCoords)
          fireStoreCharCoordsRef.current = charCoords;
          console.log(`coordsObj['character-1'] from fireStore: ${charCoords['character-1']}`);
          return importLevelImage(obj.levelID);
        })
        .then((img) => {
          // console.log(img.default);
          setLevelImg(img.default);
          return importCharacterImages(levelID);
        })
        .then((characterImgArray) => {
          setCharacterImgArray(characterImgArray);
          setCurrState('done');
          console.log('promise chain done');
        });
        })
  }, []);
  useEffect(() => {
    // Recalculate coords on mount after render in case current resolution is different from 
    //   resolution at which coords were first captured for the characters
    if (currState === 'done') recalcCharCoords();
  }, [currState]);

  // Recalculates character coords after window is resized
  const recalcCharCoords = () => {
    const levelImg = document.querySelector('img.level-img');
    const levelImgClientRects = levelImg.getClientRects()[0];
    const newWidth = levelImgClientRects.width;
    const newHeight = levelImgClientRects.height;
    // console.log(levelImgClientRects);
    let newCharactersCoords = {};
    // console.log(Object.keys(charCoordsRef.current));
    for (let i = 1; i <= Object.keys(charCoordsRef.current).length; i++) {
      // console.log('hi');
      let oldImgX = fireStoreCharCoordsRef.current[`character-${i}`][0];
      let oldImgY = fireStoreCharCoordsRef.current[`character-${i}`][1];
      // console.log(`oldImgX: ${oldImgX}, oldImgY:${oldImgY}`);
      console.warn(imgBaseCoordsRef.current);
      newCharactersCoords[`character-${i}`] = [
        oldImgX.map(0, imgBaseCoordsRef.current['base-size'][0], 0, newWidth), // imgBaseCoordsRef...[0] is img width in browser when coords were recorded to firebase
        oldImgY.map(0, imgBaseCoordsRef.current['base-size'][1], 0, newHeight) // imgBaseCoordsRef...[1] is img height in browser when coords were recorded to firebase
      ]
    }
    console.log('---------------------');
    console.log(`New img width/height: ${newWidth}/${newHeight}`);
    console.log(`New char coords: 
      character-1: (${newCharactersCoords['character-1'][0]}, ${newCharactersCoords['character-1'][1]})
      character-2: (${newCharactersCoords['character-2'][0]}, ${newCharactersCoords['character-2'][1]})
      character-3: (${newCharactersCoords['character-3'][0]}, ${newCharactersCoords['character-3'][1]})
    `);
    setCharactersCoords(newCharactersCoords);
  }
  const recalcBoxCoords = () => {
    let newWidth = document.documentElement.scrollWidth;
    let newHeight = document.documentElement.scrollHeight;
    let newTargetingBoxArr = [];
    // console.log('recalculating box coords...');
    // console.log(targetingBoxArrRef);
    for (let i = 0; i < targetingBoxArrRef.current.length; i++) {
      let boxObj = targetingBoxArrRef.current[i];
      let newBoxObj = {
        ...boxObj,
        'boxX': boxObj.initialBoxX.map(0, boxObj.initialScrollWidth, 0, newWidth),
        'boxY': boxObj.initialBoxY.map(0, boxObj.initialScrollHeight, 0, newHeight)
      }
      newTargetingBoxArr.push(newBoxObj);

      // move the box in the DOM
      let boxElem = document.querySelector(`.${newBoxObj.boxID}.valid-box`);
      boxElem.style.top = `${newBoxObj.boxX}px`;
      boxElem.style.left = `${newBoxObj.boxY}px`;
      console.log(`Old boxX: ${boxObj.boxX}}, new boxX: ${newBoxObj.boxX}`);
      console.log(`Old boxY: ${boxObj.boxY}}, new boxY: ${newBoxObj.boxY}`);
    }
    setTargetingBoxArr(newTargetingBoxArr);
  }
  useEffect(() => {
    let resizeID;
    const recalcCharCoordsOnResize = () => {
      clearTimeout(resizeID);
      resizeID = setTimeout(recalcCharCoords, 500);
    }
    window.addEventListener('resize', recalcCharCoordsOnResize);

    // Recalculate targeting box coords and move them to new coords
    // const recalcBoxCoordsOnResize = () => {
    //   recalcBoxCoords();
    // }
    // window.addEventListener('resize', recalcBoxCoordsOnResize);

    return () => {
      window.removeEventListener('resize', recalcCharCoordsOnResize);
      // window.removeEventListener('resize', recalcBoxCoordsOnResize);
    }
  }, []);

  const navigate = useNavigate();
  const handleGoHomeClick = () => navigate('/');
  const canClickBGImg = useRef(true);
  const handleLevelImgClick = (e) => {
    if (canClickBGImg.current) {
      let imgCoords = getImgPos(e);
      console.log(`Click location in img pixels: ${imgCoords.imgX}, ${imgCoords.imgY}`);
      adjustTargetingBox(e);
    }
  }

  // Gets coordinates of point clicked on within the level image
  // Useful if I decide to style the image to be smaller than the viewport
  const getImgPos = (e) => {
    const levelImg = document.querySelector('img.level-img');
    const levelImgClientRects = levelImg.getClientRects()[0];
    // console.log(levelImgClientRects);
    const levelImgStyles = window.getComputedStyle(levelImg);
    const paddingLeft = Number(levelImgStyles.getPropertyValue('padding-left').match(/\d+/)); // in pixels
    const paddingTop = Number(levelImgStyles.getPropertyValue('padding-top').match(/\d+/)); // in pixels
    const pageX = e.pageX;
    const clientX = e.clientX;
    const imgBorderBoxLeft = levelImgClientRects.left;
    const pageY = e.pageY;
    const clientY = e.clientY;
    const imgBorderBoxTop = levelImgClientRects.top;
    let imgX = null;
    let imgY = null;
    
    if (imgBorderBoxLeft >= 0) imgX = pageX - imgBorderBoxLeft - paddingLeft;
    else imgX = (-1 * imgBorderBoxLeft) + clientX - paddingLeft;
    if (imgBorderBoxTop >= 0) imgY = pageY - imgBorderBoxTop - paddingTop;
    else imgY = (-1 * imgBorderBoxTop) + clientY - paddingTop;
    // console.log(`Img coord clicked: (${imgX}, ${imgY})`);
    return {
      imgX,
      imgY
    }
  }
  const adjustTargetingBox = (e) => {
    if (!showTargetingBox) {
      setShowTargetingBox(true);
      // console.log(e);
      const boxX = e.pageX;
      const boxY = e.pageY;
      let newTargetingBoxArr = targetingBoxArr.concat([{
        'boxID': `box-${targetingBoxArr.length + 1}`, // used as a class name
        'isCorrect': false,
        'character': null,
        boxX,
        boxY,
        // entries below are used for recalc of coords on window resize
        'initialScrollWidth': document.documentElement.scrollWidth,
        'initialScrollHeight': document.documentElement.scrollHeight,
        'initialBoxX': boxX,
        'initialBoxY': boxY
      }]);
      setTargetingBoxArr(newTargetingBoxArr);
      const boxElem = document.createElement('div');
      boxElem.className = `targeting-box ${newTargetingBoxArr.at(-1).boxID}`;
      boxElem.style['position'] = 'absolute'
      boxElem.style['top'] = String(boxY - 27) + 'px';
      boxElem.style['left'] = String(boxX - 27) + 'px';
      console.log(`Targeting box position in page pixels: (${boxX}, ${boxY})`);
      const levelContainer = document.querySelector('.Level');
      levelContainer.appendChild(boxElem);
    } else {
      setShowTargetingBox(false);
      if (!targetingBoxArr.at(-1).isCorrect) {
        // If last box was not correct, adjust array to remove last placed box
        const newTargetingBoxArr = [];
        for (let i = 0; i < targetingBoxArr.length - 1; i++) newTargetingBoxArr.push(targetingBoxArr[i]);
        setTargetingBoxArr(newTargetingBoxArr);
      }
      
      // Remove from DOM
      // const lastBoxID = targetingBoxArr.length;
      // const lastBox = document.querySelector(`.box-${lastBoxID}`);
      // lastBox.remove();
      const targetingBox = document.querySelector('.targeting-box');
      targetingBox.remove();
    }
    // console.log(targetingBoxArr);
  }
  const isCharInTargetBox = (characterInt) => {
    const boxX = targetingBoxArr.at(-1).boxX;
    const boxY = targetingBoxArr.at(-1).boxY;
    // console.log(charactersCoords);
    const correctCharX = charactersCoords[`character-${characterInt}`][0];
    const correctCharY = charactersCoords[`character-${characterInt}`][1];
    if (
      correctCharX > (boxX - 27) &&
      correctCharX < (boxX + 27) &&
      correctCharY > (boxY - 27) &&
      correctCharY < (boxY + 27)
    ) {
      return true;
    } else {
      return false;
    }
  }
  const handleMenuItemClickCallback = (e, characterInt) => {
    console.log(`Clicked character-${characterInt}`);
    console.log(`Is character in target box?: ${isCharInTargetBox(characterInt)}`);
    console.log(targetingBoxArr);
    if (isCharInTargetBox(characterInt)) {
      let newTargetingBoxArr = [...targetingBoxArr];
      // Check if new targeting box is targeting a character that was already picked
      // If it is a duplicate, then don't flag it as correct--it will get removed by a different function
      let characterID = `character-${characterInt}`;
      let lastChoiceIsDup = false;
      for (let i = 0; i < newTargetingBoxArr.length - 1; i++) {
        if (newTargetingBoxArr[i].character === characterID) {
          lastChoiceIsDup = true;
        }
      }
      if (!lastChoiceIsDup) {
        newTargetingBoxArr.at(-1).isCorrect = true;
        newTargetingBoxArr.at(-1).character = `character-${characterInt}`;
        setTargetingBoxArr(newTargetingBoxArr);

        // visual cue of correct choice in level header
        const charImgElem = document.querySelector(`.character-${characterInt}-img`);
        charImgElem.style.opacity = '0.1';

        // show notification box
        showNotificationBox('You found one!', true);

        // check if all characters have been found
        if (newTargetingBoxArr.length === Object.keys(charCoordsRef.current).length) {
          // Disable clicking on bg image
          canClickBGImg.current = false;
          // Get the finish time and save it
          finishedTimeStrRef.current = timeStrRef.current;
          // pop up the leaderboard name entry form
          const leaderboardBox = document.querySelector('.add-to-leaderboard-box');
          leaderboardBox.style.visibility = 'visible';
          // blur background behind the popup
          const elemArr = document.querySelectorAll('.Level > *:not(.add-to-leaderboard-box)');
          for (let i = 0; i < elemArr.length; i++) {
            elemArr[i].style.filter = 'blur(3px)';
          }
        }
      }
    } else {
      showNotificationBox('Not quite, keep looking!', false);
    }
    adjustTargetingBox(); // normally requires 'e' arg but not for removing boxes
  }
  const showNotificationBox = (msg, isCorrect) => {
    const notifBoxElem = document.querySelector('.notification-box');
    const notifTextElem = document.querySelector('.notification-text');
    if (isCorrect) {
      notifTextElem.style.border = '2px solid green';
      notifTextElem.style['box-shadow'] = '0 0 0 2px green';
    } else {
      notifTextElem.style.border = '2px solid red';
      notifTextElem.style['box-shadow'] = '0 0 0 2px red';
    }
    notifTextElem.textContent = msg;
    notifBoxElem.style.visibility = 'visible';
    notifBoxElem.style.opacity = '1';
    notifBoxElem.style.animation = 'none';
    notifBoxElem.style.animation = 'popInFadeOut 4s linear forwards';
    const timeoutID = setTimeout(() => {
      // notifBoxElem.classList.remove('.display-notification-box');
      notifBoxElem.style.animation = 'none';
      notifBoxElem.style.visibility = 'hidden';
      console.log('ready to do again');
      clearInterval(timeoutID);
    }, 4000);
  }
  const finishedTimeStrRef = useRef('');
  const timeStrRef = useRef('');
  const fetchTimeStrCallback = (timeStr) => {
    timeStrRef.current = timeStr;
  }
  // This function handles adding a player's name and time to the fireStore leaderboard
  // The function is run once a player has typed a name and clicked the "add" button
  async function handleAddToLeaderboardClick (e) {
    e.preventDefault();
    const nameInputElem = document.querySelector('input.leaderboard-name-input');
    const playerName = nameInputElem.value;
    if (playerName !== '') {
      // Send time to fireStore leaderboard
      const docRef = doc(db, `/levels/${levelObj.levelID}/leaderboard/leaderboard-entries`);
      let leaderboardObj = {};
      leaderboardObj[playerName] = finishedTimeStrRef.current;
      const setDocResult = await setDoc(docRef, leaderboardObj, { merge: true });
      if (setDocResult === undefined) {
        console.log(setDocResult);
        // Doc was updated successfully, redirect to the level's leaderboard page
        navigate(`/leaderboards/${levelID}`);
      } else {
        // Doc was not updated successfully, log error in console
        console.error('Document update failed');
      }
    }
    
  }

  return (
    <div className="Level">
      <img 
        className="level-img" 
        src={levelImg} 
        alt="background"
        onClick={handleLevelImgClick}
        draggable="false"
      />
      {currState === 'loading' ? (
        <h3>loading...</h3>
      ) : (
        <div className="level-container">
          <div className="level-header">
            <h3 className="level-title">{`${levelObj.level}: ${levelObj.title}`}</h3>
            <Timer 
              fetchTimeStrCallback={fetchTimeStrCallback}
            />
            <div className="target-images-container">
              Find these:
              <img className="character-img character-1-img" src={characterImgArray[0]} alt="Character 1" draggable="false" />
              <img className="character-img character-2-img" src={characterImgArray[1]} alt="Character 2" draggable="false" />
              <img className="character-img character-3-img" src={characterImgArray[2]} alt="Character 3" draggable="false" />
            </div>
          </div>
        </div>
      )}
      <div className="notification-box">
        <div className="notification-text">You found one!</div>
      </div>
      <button className="go-home-button" onClick={handleGoHomeClick}>Go back home</button>
      <CharacterDropDown 
        showMenu={showTargetingBox} 
        boxCoords={{
          'pageX': (targetingBoxArr.length) > 0 ? targetingBoxArr.at(-1).boxX : null,
          'pageY': (targetingBoxArr.length) > 0 ? targetingBoxArr.at(-1).boxY : null
        }}
        characterImgArray={characterImgArray}
        charactersObj={levelObj.characters === undefined ? {} : levelObj.characters}
        menuItemClickCallback={handleMenuItemClickCallback}
      />
      <div className="add-to-leaderboard-box">
        <p>You win!</p>
        <p>Your time was: {finishedTimeStrRef.current}</p>
        <p className="add-your-name-text">Add your name to the leaderboard:</p>
        <div className="leaderboard-input-container">
          <form className="name-input-form">
            <input
              type="text"
              className="leaderboard-name-input"
              placeholder="Type your name"
              required
            />
          <button className="add-to-leaderboard-button" onClick={handleAddToLeaderboardClick}>Add</button>
          </form>
        </div>
        <button className="leaderboard-go-home-button" onClick={handleGoHomeClick}>Go back home</button>
      </div>
    </div>
  );
}

export default Level;
