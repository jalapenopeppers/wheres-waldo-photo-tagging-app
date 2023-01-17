import './Level.css';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Timer from './Timer';

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

  return (
    <div className="Level">
      <img className="level-img" src={levelImg} alt='background'/>
      {currState === 'loading' ? (
        <h3>loading...</h3>
      ) : (
        <div className="level-container">
          <div className="level-header">
            <h3 className="level-title">{`${levelObj.level}: ${levelObj.title}`}</h3>
            <Timer />
            <div className="target-images-container">
              Find these:
              <img className="character-img" src={characterImgArray[0]} alt="Character 1" />
              <img className="character-img" src={characterImgArray[1]} alt="Character 2" />
              <img className="character-img" src={characterImgArray[2]} alt="Character 3" />
            </div>
          </div>
        </div>
      )}
      <div className="notification-box">
        <div className="notification-text">You found one!</div>
      </div>
      <button className="go-home-button" onClick={handleGoHomeClick}>Go back home</button>
    </div>
  );
}

export default Level;
