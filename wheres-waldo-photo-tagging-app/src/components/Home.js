import { useEffect, useState } from 'react';
import './Home.css';

import LevelCard from './LevelCard';

async function importLevels() {
  let doneImporting = false;
  let levelObjsArray = [];
  let levelCounter = 1;
  while (!doneImporting) {
    try {
      const module = await import(`../levels/level-${levelCounter}/level-${levelCounter}.js`);
      // console.log(module.LevelObj);
      levelObjsArray.push(module.LevelObj);
      levelCounter++;
    } catch {
      doneImporting = true;
    }
  }
  // Returned array is actually a Promise
  return levelObjsArray;
}
const levelObjsArray = importLevels();

function Home() {
  const [currState, setCurrState] = useState('loading');

  const [levelsArray, setLevelsArray] = useState([]);
  useEffect(() => {
    levelObjsArray.then((objArr) => {
      setLevelsArray(objArr);
      console.log(objArr);
      setCurrState('done');
    });
  }, []);

  return (
    <div className="Home">
      <div className="level-card-container">
        {currState === 'loading' ? (
          <h3>loading.......</h3>
        ) : (
          levelsArray.map(obj => (<LevelCard key={obj.levelID} levelObj={obj} />)
        ))}
      </div>
    </div>
  );
}

export default Home;
