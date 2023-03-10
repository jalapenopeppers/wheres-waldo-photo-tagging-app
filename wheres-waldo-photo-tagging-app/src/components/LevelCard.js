import './LevelCard.css';
import waldo from './whereswaldo.jpg';
import {useNavigate} from 'react-router-dom';

function LevelCard({ levelObj }) {
  const { 
    description, 
    difficulty, 
    level, 
    levelID, 
    title,
    imgSrc
  } = levelObj;

  // const imgSrc = `../levels/${levelID}/${levelID}-photo.jpg`;
  console.log(imgSrc);

  const navigate = useNavigate();
  const handleClick = () => navigate(`/${levelID}`);

  return (
    <div className="LevelCard" onClick={handleClick}>
      <img 
        className="level-card-photo-preview" 
        src={imgSrc}
        alt= 'Level preview'
      />
      <h4 className="level-title-text">{level}: {title} ({difficulty})</h4>
    </div>
  );
}

export default LevelCard;
