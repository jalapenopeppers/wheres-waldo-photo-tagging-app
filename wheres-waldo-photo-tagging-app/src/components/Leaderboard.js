import './Leaderboard.css';
import { useParams } from 'react-router-dom';

function Leaderboard() {
  let urlParams = useParams();

  return (
    <div className="Leaderboard">
      <h1>A Leaderboard page for {urlParams.levelID}</h1>
    </div>
  );
}

export default Leaderboard;
