import './Level.css';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

// Firebase
import { doc, getDoc } from 'firebase/firestore';
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
  Gets character coords from fireStore given a levelObj
  Returns object with each character's coords in the image
  */ 
async function importCharacterCoords(levelObj) {
  const docRef = doc(db, `/levels/${levelObj.levelID}/characters/characters-coords`);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    return await docSnap.data();
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
  const [targetingBoxArr, setTargetingBoxArr] = useState([]);
  const [currState, setCurrState] = useState('loading');
  const [levelImg, setLevelImg] = useState('');
  const [characterImgArray, setCharacterImgArray] = useState([]);
  const [levelObj, setLevelObj] = useState({});
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
        const charCoords = importCharacterCoords(obj);
        charCoords.then((coordsObj) => {
          setCharactersCoords(coordsObj)
          fireStoreCharCoordsRef.current = coordsObj;
          console.log(`coordsObj['character-1'] from fireStore: ${coordsObj['character-1']}`);
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
        // return importLevelImage(obj.levelID);
        })
      // .then((img) => {
      //   // console.log(img.default);
      //   setLevelImg(img.default);
      //   return importCharacterImages(levelID);
      // })
      // .then((characterImgArray) => {
      //   setCharacterImgArray(characterImgArray);
      //   setCurrState('done');
      // });
  }, []);

  const handleWindowResize = (e) => {
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
      newCharactersCoords[`character-${i}`] = [
        oldImgX.map(0, 699, 0, newWidth), // 699 is img width in browser when coords were recorded to firebase
        oldImgY.map(0, 1375, 0, newHeight) // 1375 is img height in browser when coords were recorded to firebase
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
  useEffect(() => {
    // window.addEventListener('resize', handleWindowResize);
    // return () => {
    //   window.removeEventListener('resize', handleWindowResize);
    // }
    let resizeID;
    window.onresize = () => {
      clearTimeout(resizeID);
      resizeID = setTimeout(handleWindowResize, 500);
    }
    return () => window.onresize = null;
  }, []);

  const navigate = useNavigate();
  const handleGoHomeClick = () => navigate('/');
  const handleLevelImgClick = (e) => {
    let imgCoords = getImgPos(e);
    console.log(`Click location in img pixels: ${imgCoords.imgX}, ${imgCoords.imgY}`);
    adjustTargetingBox(e);
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
      const boxX = e.pageX;
      const boxY = e.pageY;
      let newTargetingBoxArr = targetingBoxArr.concat([{
        'character': null,
        boxX,
        boxY
      }]);
      setTargetingBoxArr(newTargetingBoxArr);
      const boxElem = document.createElement('div');
      boxElem.className = `targeting-box box-${newTargetingBoxArr.length}`;
      boxElem.style['position'] = 'absolute'
      boxElem.style['top'] = String(boxY - 27) + 'px';
      boxElem.style['left'] = String(boxX - 27) + 'px';
      console.log(`Targeting box position in page pixels: (${boxX}, ${boxY})`);
      const levelContainer = document.querySelector('.Level');
      levelContainer.appendChild(boxElem);
    } else {
      setShowTargetingBox(false);
      // Adjust array to remove box
      const newTargetingBoxArr = [];
      for (let i = 0; i < targetingBoxArr.length - 1; i++) newTargetingBoxArr.push(targetingBoxArr[i]);
      setTargetingBoxArr(newTargetingBoxArr);
      
      // Remove from DOM
      const lastBoxID = targetingBoxArr.length;
      const lastBox = document.querySelector(`.box-${lastBoxID}`);
      lastBox.remove();
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
    // CONTINUE 
    // If correct, place permanent target box at same target box location
    //   Boxes must track characters when window is resized
    // Make dropdown disappear
    // Show that char was foudn in level header using visual cue
    // Show notification box with success message
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
            <Timer />
            <div className="target-images-container">
              Find these:
              <img className="character-img" src={characterImgArray[0]} alt="Character 1" draggable="false" />
              <img className="character-img" src={characterImgArray[1]} alt="Character 2" draggable="false" />
              <img className="character-img" src={characterImgArray[2]} alt="Character 3" draggable="false" />
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
    </div>
  );
}

export default Level;
