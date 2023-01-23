import { useEffect } from 'react';

// CSS for this component is in Level.css because of its
//   connection to the game logic.
// This component is always visible and just hides/shows
//   when level image is clicked

/*
  Places drop menu within viewport
  @param element: DOM element
  @param boxCoords: page coordinates of target circle
  @param offset: pixel offset
  Returns true if successful, false if not
*/
function placeMenuInView(element, boxCoords, offset) {
  element.style.visiblity = 'hidden';
  element.style.display = 'grid';
  element.style.top = `${boxCoords.pageY + 40}px`;
  element.style.left = `${boxCoords.pageX + 40}px`;

  const rect = element.getBoundingClientRect();
  if (rect.top < 0 || rect.left < 0) return false;
  if (rect.bottom > (document.documentElement.clientHeight)) {
    // If bottom of element is below viewport, modify it
    element.style.top = `${boxCoords.pageY - offset - rect.height}px`;
  }
  if (rect.right > (window.innerWidth || document.documentElement.clientWidth)) {
    // If right of element is out of viewport, modify it
    element.style.left = `${boxCoords.pageX - offset - rect.width}px`;
  }
  element.style.visiblity = 'visible';
  return true;
}

function CharacterDropDown(props) {
  const {
    showMenu, 
    boxCoords, 
    characterImgArray,
    charactersObj,
    menuItemClickCallback,
  } = props;

  useEffect(() => {
    const dropMenu = document.querySelector('.character-drop-down-menu');
    if (showMenu) {
      // dropMenu.style.top = `${boxCoords.pageY + 40}px`;
      // dropMenu.style.left = `${boxCoords.pageX + 40}px`;
      // dropMenu.style.display = 'grid';
      // if (!isInViewport(dropMenu)) {
      //   console.log('move menu into view');
      // }
      placeMenuInView(dropMenu, boxCoords, 40);
      // dropMenu.style.display = 'grid';
    } else {
      dropMenu.style.display = 'none';
    }
  }, [showMenu]);

  return (
    <div className="character-drop-down-menu">
      <div 
        className="character-menu-container character-1-container"
        onClick={(e) => {menuItemClickCallback(e, 1)}}
      >
        <img 
          className="character-img character-1-img"
          src={characterImgArray[0]} 
          alt="Character 1" 
          draggable="false"
        />
        <p className="character-menu-text">{charactersObj.character1Name}</p>
      </div>
      <div 
        className="character-menu-container character-2-container"
        onClick={(e) => {menuItemClickCallback(e, 2)}}
      >
        <img 
          className="character-img character-2-img"
          src={characterImgArray[1]} 
          alt="Character 2" 
          draggable="false"
        />
        <p className="character-menu-text">{charactersObj.character2Name}</p>
      </div>
      <div 
        className="character-menu-container character-3-container"
        onClick={(e) => {menuItemClickCallback(e, 3)}}
      >
        <img 
          className="character-img character-3-img"
          src={characterImgArray[2]} 
          alt="Character 3" 
          draggable="false"
        />
        <p className="character-menu-text">{charactersObj.character3Name}</p>
      </div>
    </div>
  );
}

export default CharacterDropDown;
