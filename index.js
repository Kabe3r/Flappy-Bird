const score = document.querySelector('.score');
const level = document.querySelector('.level');
const startScreen = document.querySelector('.startScreen');
const levelScreen = document.querySelector('.levelScreen');
const gameArea = document.querySelector('.gameArea');
const gameMessage = document.querySelector('.gameMessage');

gameMessage.addEventListener('click', start);
startScreen.addEventListener('click', start);


document.addEventListener('keydown', pressOn);
document.addEventListener('keyup', pressOff);

let keys = {};
let player = {};

// starting the game
function start() {
     player.speed = 2;
     player.score = 0;
     player.level = 1;
     player.isPlay = true;
     gameArea.innerHTML = '';
     gameMessage.classList.add('hide');
     startScreen.classList.add('hide');
   // creating the bird object with wings in the gameArea   
     let bird = document.createElement('div');
     bird.setAttribute('class', 'bird');
     let wing = document.createElement('span');
     wing.setAttribute('class', 'wing');
     wing.pos = 15;
     wing.style.top = wing.pos + 'px';
     bird.appendChild(wing);
     gameArea.appendChild(bird);
    // Setting the bird position
     player.x = bird.offsetLeft;
     player.y = bird.offsetTop;

     player.pipe = 0;
     let spacing = 500;
     let total = Math.floor((gameArea.offsetWidth) / spacing);

     for (let i = 0; i < total; i++) {
      buildPipes(player.pipe * spacing);
     }

     window.requestAnimationFrame(playGame);   
}

// Creating Top and Bottom pipes
function buildPipes(startPos) {
      let totalHeight = gameArea.offsetHeight;
      let totalWidth = gameArea.offsetWidth;
      player.pipe++;
      let pipeColor = clr();
      let pipeTop = document.createElement('div');
      pipeTop.start = startPos + totalWidth;
      pipeTop.classList.add('pipe');
      pipeTop.height = Math.floor(Math.random() * 350);
      pipeTop.style.height = pipeTop.height + 'px';
      pipeTop.style.left = pipeTop.start + 'px';
      pipeTop.style.top = '0px';
      pipeTop.x = pipeTop.start;
      pipeTop.id = player.pipe;
      pipeTop.style.backgroundColor = pipeColor;
      gameArea.appendChild(pipeTop);
      let pipeSpace = Math.floor(Math.random() * 250) + 150;
      let pipeBottom = document.createElement('div');
      pipeBottom.start = pipeTop.start;
      pipeBottom.classList.add('pipe');
      pipeBottom.style.height = totalHeight - pipeTop.height - pipeSpace + 'px';
      pipeBottom.style.left = pipeTop.start + 'px';
      pipeBottom.style.bottom = '0px';
      pipeBottom.x = pipeTop.start;
      pipeBottom.id = player.pipe;
      pipeBottom.style.backgroundColor = pipeColor;
      gameArea.appendChild(pipeBottom);

}


// Moving pipes dynamically and creating new pipes when prev ends
function movePipes(bird) {
      let lines = document.querySelectorAll('.pipe');
      let counter = 0;
      lines.forEach(function(item) {
            item.x -= player.speed;
            item.style.left = item.x + 'px';
            if (item.x < 0) {
                  item.parentElement.removeChild(item);
                  counter++;
            }
           
            if (isCollided(item, bird)) {
                  gameOver(bird);
            }
      })
      counter = counter / 2;
      for (let i = 0; i < counter; i++) {
            buildPipes(0);
      }

}

// Collision Detector
function isCollided(first, second) {
      let rectFirst = first.getBoundingClientRect();
      let rectSecond = second.getBoundingClientRect();

      return !(
            (rectFirst.bottom < rectSecond.top) ||
            (rectFirst.top > rectSecond.bottom) ||
            (rectFirst.right < rectSecond.left) ||
            (rectFirst.left > rectSecond.right)  
      )
      
}

function clr(){
      return "#"+Math.random().toString(16).substr(-6);
  }

// Running the infinte loop / animation
function playGame() {
      // if isPlay is true then run the following
      if (player.isPlay) {
            let bird = document.querySelector('.bird');
            let wing = document.querySelector('.wing');
            movePipes(bird);
            let move = false;  
            
            // move the bird within the game area
            if (keys.ArrowLeft && player.x > 0) {
                  player.x -= player.speed;
                  move = true;
            }
            
            if (keys.ArrowRight && player.x < (gameArea.offsetWidth - 55)) {
                  player.x += player.speed;
                  move = true;
            }
            
            if ((keys.ArrowUp || keys.Space) && player.y > 30) {
                  player.y -= (player.speed * 5); // pressing arrowup and space will move the player upwards
                  move = true;
            }
            
            if (keys.ArrowDown && player.y < (gameArea.offsetHeight)) {
                  player.y += player.speed;
                  move = true;
            }
        
            // moving the wings
            if (move) {
                  wing.pos = (wing.pos == 15) ? 25 : 15;
                  wing.style.top = wing.pos + 'px';
            }
            
            player.y += (player.speed * 2); // setting the bird going downwards
            
            // check if the player touches the bottom then run gameOver()
            if ((player.y + 50) > gameArea.offsetHeight) {
                  gameOver(bird);
            }
            const scores = (player.score === 1000 || player.score === 2000 || player.score === 3000 || player.score === 4000)
            
            if (scores) {
                  checkLevel(); 
            }
            
            bird.style.top = player.y + 'px';
            bird.style.left = player.x + 'px';
            window.requestAnimationFrame(playGame);
            
            // setting the score the longer the games runs the higher the score will be
            player.score++;
            score.innerHTML = 'Score: ' + player.score + '<br>Level: ' + player.level;
      }
      
}


function checkLevel() {
      player.isPlay = false;
      player.level++;
      player.speed += 1;
      levelScreen.classList.remove('hide');
      levelScreen.innerHTML = 'Score was ' + player.score +
      '<br>Congratulations You are on Level ' + player.level + '<br>Press Tab To Continue';
}

function resume() {
      levelScreen.classList.add('hide');
      player.isPlay = true;
      window.requestAnimationFrame(playGame);
}

// setting the game over function
function gameOver(bird) {
      player.isPlay = false;
      gameMessage.classList.remove('hide');
      bird.setAttribute('style', 'transform: rotate(180deg)');
      gameMessage.innerHTML = 'Game Over<br>You scored ' + player.score + '<br>Click here to start again';
      gameArea.innerHTML = '';

}


// Tracking key press and save it in keys object
function pressOn(e) {
      e.preventDefault();
      keys[e.code] = true;
      if (!player.isPlay) {
            if (keys.Tab) {
                  resume();
            }
      }
}

function pressOff(e) {
      e.preventDefault();
      keys[e.code] = false;
}