import './Level.css';
import { useParams } from 'react-router-dom';
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

function Level() {
  const urlParams = useParams();
  const levelID = urlParams.levelID;

  const [currState, setCurrState] = useState('loading');
  const [levelObj, setLevelObj] = useState({});
  const levelObjPromise = importLevel(levelID);
  useEffect(() => {
    levelObjPromise.then((obj) => {
      console.log(obj);
      setCurrState('done');
      setLevelObj(obj);
    });
  }, []);

  return (
    <div className="Level">
      {currState === 'loading' ? (
        <h3>loading...</h3>
      ) : (
        <div className="level-container">
          <div className="level-header">
            <h3 className="level-title">{`${levelObj.level}: ${levelObj.title}`}</h3>
            <Timer />
          </div>
          <h1>Level page {urlParams.levelID}</h1>
        </div>
      )}
    </div>
  );
}

export default Level;
