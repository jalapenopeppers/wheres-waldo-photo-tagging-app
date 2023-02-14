import './Leaderboard.css';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { db } from '..';
import { doc, getDoc } from 'firebase/firestore';

function Leaderboard() {
  let urlParams = useParams();

  const [ leaderboardDataObj, setLeaderboardDataObj ] = useState({});
  const [ sortedLeaderboardArr, setSortedLeaderboardArr ] = useState([]);
  useEffect(() => {
    async function getLeaderboardData() {
      const docRef = doc(db, `/levels/${urlParams.levelID}/leaderboard/leaderboard-entries`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        let obj = await docSnap.data();
        console.log("Document data:", obj);
        setLeaderboardDataObj(obj);
        setSortedLeaderboardArr(sortLeaderboardObj(obj));
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    }
    getLeaderboardData();
  }, [urlParams.levelID])
  const sortLeaderboardObj = (obj) => {
    let lbObj = {...obj}
    return Object.keys(lbObj).sort((a, b) => {
      return timeStrToSeconds(lbObj[a]) - timeStrToSeconds(lbObj[b]);
    });
  }
  const timeStrToSeconds = (timeStr) => {
    let arr = timeStr.split(':');
    return (Number(arr[0]) * 60) + Number(arr[1]);
  }

  return (
    <div className="Leaderboard">
      <h1 className="leaderboard-title-text">Leaderboard</h1>
      <div className="leaderboard-entries">
        {
          Object.keys(leaderboardDataObj).length === 0 ? 
            (<h3 className="leaderboard-empty-message">No records to show!</h3>) :
            (sortedLeaderboardArr.map((key, index) => {
              return (
                <div className="leaderboard-entry" key={index}>
                  <div className="rank">#{index + 1}</div>
                  <div className="time">{leaderboardDataObj[key]}</div>
                  <div className="player-name">{key}</div>
                </div>
              );
            }))
        }
      </div>
    </div>
  );
}

export default Leaderboard;
