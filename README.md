# wheres-waldo-photo-tagging-app

A photo tagging game web app that features ReactJS and Firebase cloud services for holding files, leader boards, and other data.

## How To Enter a Level

On the home page, click a level to open the level and start playing immediately. Alternatively, you can go to the leaderboard and click the level preview to play the selected level. 

## How To Play The Game

The goal of the game is to find the listed characters in the least amount of time possible. The target characters are listed in the top right corner of the screen. To mark a character as found: click on the character in the image, then click on their name / image in the small popup menu that will appear. If you correctly identified the character, their preview image with turn grey on the top right corner of the screen and a notification will pop up saying that you found a character. If you are mistaken, the notification will tell you to keep looking.

## How To Add Levels

If you want to add your own levels, you can start buy cloning the repository onto your local computer. Then, all you need to do is add a level folder in the "levels" folder with all the required files. Make sure to follow the existing name and format conventions from the existing levels. If you don't, the level will not work. The following are the files required to make a new level, including their name formats (a '#' represents any number):

> Required files to make a new level:
> - level-#-photo.jpg
> - character-1-photo.jpg
> - character-2-photo.jpg
> - character-3-photo.jpg
> - level-#.js

Additionally, the level folder should be named 'level-#' where '#' can be any number.

Note: Currently, all images must be in .jpg format

### That's it, have fun!