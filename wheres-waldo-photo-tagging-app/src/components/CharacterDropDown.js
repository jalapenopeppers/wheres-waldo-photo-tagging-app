import { useEffect } from 'react';

// CSS for this component is in Level.css because of its
//   connection to the game logic

function CharacterDropDown(props) {
  const {showMenu, boxCoords, characterImgArray} = props;

  useEffect(() => {
    const dropMenu = document.querySelector('.character-drop-down-menu');
    if (showMenu) {
      dropMenu.style.top = `${boxCoords.pageY + 40}px`;
      dropMenu.style.left = `${boxCoords.pageX + 40}px`;
      dropMenu.style.display = 'grid';
    } else {
      dropMenu.style.display = 'none';
    }
  }, [showMenu]);

  return (
    <div className="character-drop-down-menu">
      <div className="character-menu-container character-1-container">
        <img 
          className="character-img character-1-img"
          src={characterImgArray[0]} 
          alt="Character 1" 
          draggable="false"
        />
        <p className="character-menu-text">Monkey</p>
      </div>
      <div className="character-menu-container character-2-container">
        <img 
          className="character-img character-2-img"
          src={characterImgArray[1]} 
          alt="Character 2" 
          draggable="false"
        />
        <p className="character-menu-text">Skater man</p>
      </div>
      <div className="character-menu-container character-3-container">
        <img 
          className="character-img character-3-img"
          src={characterImgArray[2]} 
          alt="Character 3" 
          draggable="false"
        />
        <p className="character-menu-text">Nigel</p>
      </div>
    </div>
  );
}

export default CharacterDropDown;
