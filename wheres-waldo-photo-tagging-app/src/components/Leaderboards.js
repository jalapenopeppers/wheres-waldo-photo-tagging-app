import './Leaderboards.css';
import { useState, useEffect } from 'react';
import { useParams, useRef, useNavigate, Outlet } from 'react-router-dom';

import { importLevels } from '../index.js';

const levelObjsArray = importLevels();

function Leaderboards() {
  let urlParams = useParams();
  const levelIDRef = useParams(urlParams.levelID);

  const navigate = useNavigate();

  const [selectedLevelID, setSelectedLevelID] = useState(urlParams.levelID);
  const [selectedLevelObj, setSelectedLevelObj] = useState(null);
  const [currState, setCurrState] = useState('loading');
  const [levelsArray, setLevelsArray] = useState([]);
  useEffect(() => {
    levelObjsArray.then((objArr) => {
      setLevelsArray(objArr);
      console.log(objArr);
      setCurrState('done');
      return objArr;
    })
    .then((objArr) => {
      assignLevelObj(selectedLevelID, objArr);
      console.log(selectedLevelID);
    });
  }, []);

  const renderLevelPreview = () => {
    if (currState === 'loading') {
      return (<h3 className="preview-pending-data-text">loading...</h3>);
    } else if (selectedLevelObj === null) {
      return (<h3 className="preview-pending-data-text">Select a level on the right to see its leaderboard</h3>);
    } else {
      return (
        <div className="level-preview-card" onClick={handleLevelPreviewClick}>
          <img
            className="level-preview-img"
            src={selectedLevelObj.imgSrc} //FIX
            alt="Level card"
          />
          <p className="level-preview-title">{`${selectedLevelObj.level}: ${selectedLevelObj.title}`}</p>
          <p className="level-preview-description">{selectedLevelObj.description}</p>
        </div>
      )
    }
  }

  const handleLevelSelectClick = (levelID) => {
    setSelectedLevelID(levelID);
    assignLevelObj(levelID, levelsArray);
    navigate(`/leaderboards/${levelID}`);
  }

  const assignLevelObj = (levelID, levelsArray) => {
    for (let i = 0; i < levelsArray.length; i++) {
      if (levelsArray[i].levelID === levelID) {
        setSelectedLevelObj(levelsArray[i]);
        console.log(levelsArray[i]);
        return null;
      }
    }
    console.log(selectedLevelObj);
  }

  const handleLevelPreviewClick = () => {
    navigate(`/${urlParams.levelID}`);
  }

  return (
    <div className="Leaderboards">
      <div className="selected-level-card-container">
        <div className="level-preview-container">
          {renderLevelPreview()}
        </div>
      </div>
      <div className="level-cards-container">
        {currState === 'loading' ? (
            <h3>loading...</h3>
          ) : (
            levelsArray.map(obj => (
              <div key={obj.levelID} className="level-grid-card" onClick={() => handleLevelSelectClick(obj.levelID)}>
                <img 
                  className="level-grid-card-img"
                  src={obj.imgSrc}
                  alt="Level card"
                />
                <p className="level-grid-card-text">{`${obj.level}: ${obj.title}`}</p>
              </div>
            ))
          )}
      </div>
      <div className="leaderboard-container">
        <Outlet />
      </div>
    </div>
  );
}

export default Leaderboards;
