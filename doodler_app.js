const start_btn = document.getElementById("startbtn");
const frontpage = document.getElementById("frontpage");

//on click of play button the game will be shown
start_btn.addEventListener("click", () => {
  document.addEventListener("DOMContentLoaded", showGame());
  start_btn.style.display = "none";
  frontpage.style.display = "none";
});

//function to show the background grid,the doodler and the platforms on click of play button
const showGame = () => {
  const container = document.querySelector(".container");
  const grid = document.createElement("div");
  //place doodler left corner

  let platformList = [];
  // var platYChange = 0;
  // var gameStarted;
  let isGameOver = false;
  let score = 0;
  let doodlerLeftSpace = 50;
  let doodlerstart = 50; //250;
  let doodlerbottomSpace = doodlerstart;
  let upTimerId; //intervalId returned by setInterval() of jumpDoodler function
  let downTimerId; //intervalId returned by setInterval() of fallDoodler function
  let numOfPlatforms = 5; //genegate platfors between 1 to 10.
  let isJumping = true;
  let isGoingLeft = false;
  let isGoingRight = false;
  let leftTimerId;
  let rightTimerId;
  let platformIntervalId;
  //create the background grid on click of play button
  const createGrid = () => {
    container.appendChild(grid); //append the grid inside the container
    grid.classList.add("grid-container"); //set class to the grid
  };
  createGrid(); //call function to show the grid

  const doodler = document.createElement("div"); //create div for doodler
  //create doodler and append it inside the background grid
  const createDoodler = () => {
    grid.appendChild(doodler); //append the doodler to the grid
    doodler.classList.add("doodler"); //add doodler class
    doodler.style.left = doodlerLeftSpace + "px"; //add left margin
    doodler.style.bottom = doodlerbottomSpace + "px"; //add bottom margin
  };

  //function to make the doodler jump
  const jumpDoodler = () => {
    clearInterval(downTimerId); //stop fallDoodler() by setting its intervalID in clearinterval()

    //function to add 7px to the doodler bottom to make it move upward
    upTimerId = setInterval(() => {
      doodlerbottomSpace += 7;
      doodler.style.bottom = doodlerbottomSpace + "px";

      //if the bottom margin of the doodler is greater than  height of 500 from the point of it started, then it will fall.
      // console.log(doodlerstart)
      if (doodlerbottomSpace > doodlerstart + 360 || doodlerbottomSpace > 600) {
        fallDoodler();

        isJumping = false;
      }
    }, 20);
  };

  const fallDoodler = () => {
    isJumping = false;
    clearInterval(upTimerId); //stop jumpDoodler() by setting its intervalID in clearinterval()

    //function to decrease the doodler bottom space to 6px in every 20miliseconds to make it look fall.
    downTimerId = setInterval(() => {
      doodlerbottomSpace -= 6;
      doodler.style.bottom = doodlerbottomSpace + "px";
      //if the doodler bottom space comes to 0 or less then gameOver function is called
      if (doodlerbottomSpace <= 1) gameOver();
      //make the doodler jump if it collides with any platform.
      platformList.map((platform) => {
        if (
          doodlerbottomSpace >= platform.bottom &&
          doodlerbottomSpace <= platform.bottom + 15 &&
          doodlerLeftSpace + 50 >= platform.left &&
          doodlerLeftSpace <= platform.left + 85 &&
          !isJumping
        ) {
          doodlerstart = doodlerbottomSpace;
          jumpDoodler();

          isJumping = true;
        }
      });
    }, 20);
  };

  //function to create platforms for the doodler to jump on the grid
  const createPlatforms = () => {
    for (i = 0; i < numOfPlatforms; i++) {
      const platformGap = 600 / numOfPlatforms; //provide the gap need to be there in between platforms that is generated by dividing the height of the grid by the number of platforms per grid.
      const newPlatformPosition = 100+i * platformGap;

      //create new platform using constructor till forloop runs by taking the platform position as parameter
      let newplatform = new Platform(newPlatformPosition);
      platformList.push(newplatform); //push the platform to platformList array.
      // console.log(platformList)
    }
  };

  //constructor class for platform
  class Platform {
    constructor(newPlatformPosition) {
      this.left = Math.random() * 350; //provide random left margin to the platforms with in the grid width
      this.bottom = newPlatformPosition; //probide platform bottom margin
      this.visual = document.createElement("div"); //create div element for platform
      this.visual.classList.add("platform"); //add class name to the platform
      this.visual.style.left = this.left + "px";
      // console.log(visuall.style.left)
      this.visual.style.bottom = this.bottom + "px";
      grid.appendChild(this.visual); //append the platform inside the grid
    }
  }
  // createPlatforms();

  //function to move platform downward
  const movePlatforms=()=> {
    if (doodlerbottomSpace > 30) {
      //if the doodler is inside the grid then perform the if statement
      platformList.forEach((platform) => {
        //decrease the platform bottom margin by 3px for eachplatform inside theplatformlist array
        platform.bottom -= 3;
        let visual = platform.visual;
        visual.style.bottom = platform.bottom + "px";

        //remove class when the platform bottom space < 0
        if (platform.bottom < 0) {
          let firstPlatform = platformList[0].visual;
          firstPlatform.classList.remove("platform");
          //remove the platform from the array
          platformList.shift();

          //score will be increased by 1 after one platform is shifted from the array
          score++;
          let addnewPlatform = new Platform(550); //add new platform using constructor class having bottom space equal to the height of the grid
          platformList.push(addnewPlatform); //push new platform to the array
        }
      });
    }
  }
  //function to move the doodler left when left arrow key is pressed
  const moveLeft=()=> {
    
    if (isGoingRight) {
      clearInterval(rightTimerId);
      isGoingRight = false;
    }
    isGoingLeft = true;
    leftTimerId = setInterval(function () {
      //if doodler is inside the grid move left.
      if (doodlerLeftSpace >= 0) {
        doodlerLeftSpace -= 7;
        doodler.style.left = doodlerLeftSpace + "px";
      } 
    }, 20);
  }

const moveRight=()=> {
    
    if (isGoingLeft) {
      clearInterval(leftTimerId);
      isGoingLeft = false;
    }
    isGoingRight = true;
    rightTimerId = setInterval(function () {
      //if doodler is inside the grid move right.
      if (doodlerLeftSpace <= 313) {
        doodlerLeftSpace += 7;
        doodler.style.left = doodlerLeftSpace + "px";
      }  
    }, 20);
  }
  //on click of up arrow the doodler will stop moving left or right
  const moveStraight=()=> {
    isGoingLeft = false;
    isGoingRight = false;
    clearInterval(leftTimerId);
    clearInterval(rightTimerId);

    
  }

  //assign functions to keyCodes
  const control=(e)=> {

    if (e.key === "ArrowLeft") {
      //on click of left arrow button move left
      moveLeft();
    } else if (e.key === "ArrowRight") {
      //on click of right arrow button move right
      moveRight();
    } else if (e.key === "ArrowUp") {
      //on click of right arrow button move up
      moveStraight();
    }
  }

  //gameOver function
  const gameOver = () => {
    isGameOver = true;
    //clear all setinterval functions
    clearInterval(upTimerId);
    clearInterval(downTimerId);
    clearInterval(leftTimerId);
    clearInterval(rightTimerId);
    clearInterval(platformIntervalId);

    while (grid.firstChild) {
      //remove all elements of grid
      grid.removeChild(grid.firstChild);
    }
    //show the score and 'GAME OVER!' inside the grid
    grid.innerHTML = `<h1>${score}<br/>GAME OVER!</h1>`;
  };
  //function to start the game
  const start = () => {
    createPlatforms();
    createDoodler();

    platformIntervalId = setInterval(movePlatforms, 20); //call the moveplatform function in each time interval of 20miliseconds.
    jumpDoodler();
    document.addEventListener("keyup", control);
  };

  if (!isGameOver) {
    //if game is not over start the game
    start();
  }
};