import './LevelCard.css';
import waldo from './whereswaldo.jpg';

function LevelCard({ levelObj }) {
  const { 
    description, 
    difficulty, 
    level, 
    levelID, 
    title 
  } = levelObj;

  const imgSrc = `../levels/${levelID}/${levelID}-photo.jpg`;
  console.log(imgSrc);

  return (
    <div className="LevelCard">
      <img 
        className="level-card-photo-preview" 
        src={waldo}
        alt= 'Level preview'
      />
      <h4>{level}: {title} ({difficulty})</h4>
    </div>
  );
}

export default LevelCard;
