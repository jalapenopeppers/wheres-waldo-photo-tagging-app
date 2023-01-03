import './Leaderboards.css';
import { Outlet } from 'react-router-dom';

function Leaderboards() {
  return (
    <div className="Leaderboards">
      <h1>Leaderboards page</h1>
      <Outlet />
    </div>
  );
}

export default Leaderboards;
