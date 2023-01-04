import './PageLayout.css';
import { Outlet, Link } from 'react-router-dom';

function PageLayout() {
  return (
    <div className="PageLayout">
      <div className="header">
        <h1 className="header-title">Seeker</h1>
        <div className="nav-buttons-container">
          <Link 
            className="nav-button nav-button-home" 
            to="/"
          >Home</Link>
          <Link 
            className="nav-button nav-button-leaderboards"
            to="/leaderboards"
          >Leaderboards</Link>
          <Link 
            className="nav-button nav-button-about"
            to="/about"
          >About</Link>
        </div>
      </div>
      <Outlet />
    </div>
  );
}

export default PageLayout;
