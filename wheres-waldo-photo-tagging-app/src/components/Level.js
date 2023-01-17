import './Level.css';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Timer from './Timer';

async function importLevel(levelID) {
  let module = {};
  try {
    module = await import(`../levels/${levelID}/${levelID}.js`);
  } catch (e) {
    console.log(e);
  }
  // Returned array is actually a Promise
  return module.LevelObj;
}
async function importImage(levelID) {
  let module = {};
  try {
    module = await import(`../levels/${levelID}/${levelID}-photo.jpg`);
  } catch (e) {
    console.log(e);
  }
  // Returned array is actually a Promise
  return module;
}

function Level() {
  const urlParams = useParams();
  const levelID = urlParams.levelID;

  const [currState, setCurrState] = useState('loading');
  const [levelImg, setLevelImg] = useState('');
  const [levelObj, setLevelObj] = useState({});
  const levelObjPromise = importLevel(levelID);
  useEffect(() => {
    levelObjPromise
      .then((obj) => {
        // console.log(obj);
        // setCurrState('done');
        setLevelObj(obj);
        return importImage(obj.levelID);
        })
      .then((img) => {
        // console.log(img.default);
        setLevelImg(img.default);
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
              <img className="character-img" src="" alt="Character 1" />
              <img className="character-img" src="" alt="Character 2" />
              <img className="character-img" src="" alt="Character 3" />
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
