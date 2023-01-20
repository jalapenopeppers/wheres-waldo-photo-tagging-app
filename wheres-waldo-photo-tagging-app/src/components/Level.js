import './Level.css';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Timer from './Timer';
import CharacterDropDown from './CharacterDropDown';

// TEST
import char1 from '../levels/level-2/character-1-photo.jpg';
import char2 from '../levels/level-2/character-2-photo.jpg';
import char3 from '../levels/level-2/character-3-photo.jpg';

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

function Level() {
  const urlParams = useParams();
  const levelID = urlParams.levelID;

  const [showTargetingBox, setShowTargetingBox] = useState(false);
  const [targetingBoxArr, setTargetingBoxArr] = useState([]);
  const [currState, setCurrState] = useState('loading');
  const [levelImg, setLevelImg] = useState('');
  const [characterImgArray, setCharacterImgArray] = useState([]);
  const [levelObj, setLevelObj] = useState({});
  const levelObjPromise = importLevel(levelID);
  useEffect(() => {
    levelObjPromise
      .then((obj) => {
        console.log(obj);
        setLevelObj(obj);
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
      });
  }, []);

  const navigate = useNavigate();
  const handleGoHomeClick = () => navigate('/');
  const handleLevelImgClick = (e) => {
    console.log(getImgPos(e));
    adjustTargetingBox(e);
    //CONTINUE
    // On click, Place targeting circle at mouse cursor
    // Open drop-down character menu next to cursor
    // Make them disappear when clicking somewhere else
  }

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
      console.log(`Box position: (${boxX}, ${boxY})`);
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
    console.log(targetingBoxArr);
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
      />
    </div>
  );
}

export default Level;
