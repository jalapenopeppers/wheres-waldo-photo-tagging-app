import './About.css';

function About() {
  return (
    <div className="About">
      <h1 className="about-page-title">About</h1>
      <p className="paragraph">
        This web application was made as part of The Odin Project's curriculum
        for full-stack web development. 
      </p>
      <p className="paragraph">
        This website was made using ReactJS with React DOM Router and features cloud storage using Firestore, the 
        Firebase cloud storage database. The cloud storage holds coordinates for 
        each level's target characters and it also holds the leaderboards of each level.
      </p>
      <p className="paragraph">
        The data for each level is stored as files in the site repository, but their structure
        is simple so that anyone can easily create their own levels. All that is needed is
        the JPG file of the level, the JPG files of the target characters, and the level
        Javascript file which contains all the unique data pertaining to that level. Simply
        adding a folder following the existing folder structure automatically adds the level
        to the website, and the required cloud storage is automatically set up too.
      </p>
      <p className="paragraph">
        For more information/instructions, 
        visit the github repository <a href="https://github.com/jalapenopeppers/wheres-waldo-photo-tagging-app"> here.</a>
      </p>
    </div>
  );
}

export default About;
