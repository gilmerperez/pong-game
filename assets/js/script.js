const gameBoard = document.querySelector("#gameBoard");
const scoreText = document.querySelector("#scoreText");
const restartButton = document.querySelector("#restartButton");
const ctx = gameBoard.getContext("2d");

// Constant game variables
const paddleSpeed = 50;
const ballRadius = 12.5;
const ballColor = "white";
const paddle1Color = "white";
const paddle2Color = "white";
const paddleBorder = "black";
const boardBackground = "black";
const ballBorderColor = "black";
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;

// Variable game variables
let ballSpeed;
let intervalID;
let player1Score = 0;
let player2Score = 0;
let ballXDirection = 0;
let ballYDirection = 0;
let ballX = gameWidth / 2;
let ballY = gameHeight / 2;

// Paddle 1 dimensions and position
let paddle1 = {
  width: 25,
  height: 100,
  x: 0,
  y: 0,
};

// Paddle 2 dimensions and position
let paddle2 = {
  width: 25,
  height: 100,
  x: gameWidth - 25,
  y: gameHeight - 100,
};

// Sounds
const backgroundSound = new Audio("./assets/sounds/background.wav");
const paddleHitSound = new Audio("./assets/sounds/paddle-hit.wav");
const scoreSound = new Audio("./assets/sounds/score.mp3");

// Loop background music
backgroundSound.loop = true;
backgroundSound.volume = 0.2;
backgroundSound.play().catch(() => {
  // Most browsers block autoplay; wait for user interaction
  window.addEventListener("click", () => backgroundSound.play(), {
    once: true,
  });
});

function nextTick() {
  intervalID = setTimeout(() => {
    MoveBall();
    nextTick();
    clearBoard();
    drawPaddles();
    checkCollision();
    drawBall(ballX, ballY);
  }, 10);
}

function clearBoard() {
  ctx.fillStyle = boardBackground;
  ctx.fillRect(0, 0, gameWidth, gameHeight);
}

function drawPaddles() {
  ctx.strokeStyle = paddleBorder;

  ctx.fillStyle = paddle1Color;
  ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
  ctx.strokeRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);

  ctx.fillStyle = paddle2Color;
  ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
  ctx.strokeRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
}

function createBall() {
  ballSpeed = 1;

  if (Math.round(Math.random()) == 1) {
    ballXDirection = 1;
  } else {
    ballXDirection = -1;
  }

  if (Math.round(Math.random()) == 1) {
    ballYDirection = Math.random() * 1;
  } else {
    ballYDirection = Math.random() * -1;
  }

  ballX = gameWidth / 2;
  ballY = gameHeight / 2;

  drawBall(ballX, ballY);
}

function MoveBall() {
  ballX = ballX + ballSpeed * ballXDirection;
  ballY = ballY + ballSpeed * ballYDirection;
}

function drawBall(ballX, ballY) {
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI);
  ctx.fillStyle = ballColor;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = ballBorderColor;
  ctx.stroke();
}

function checkCollision() {
  if (ballY <= 0 + ballRadius) {
    ballYDirection = ballYDirection * -1;
    paddleHitSound.currentTime = 0;
    paddleHitSound.play();
  }

  if (ballY >= gameHeight - ballRadius) {
    ballYDirection = ballYDirection * -1;
    paddleHitSound.currentTime = 0;
    paddleHitSound.play();
  }

  if (ballX >= gameWidth) {
    player1Score = player1Score + 1;
    createBall();
    updateScore();
    // paddleHitSound.currentTime = 0;
    // paddleHitSound.play();
    return;
  }

  if (ballX <= 0) {
    player2Score = player2Score + 1;
    createBall();
    updateScore();
    paddleHitSound.currentTime = 0;
    paddleHitSound.play();
    return;
  }

  if (ballX <= paddle1.x + paddle1.width + ballRadius) {
    if (ballY > paddle1.y && ballY < paddle1.y + paddle1.height) {
      ballX = paddle1.x + paddle1.width + ballRadius; // If ball gets stuck
      ballXDirection = ballXDirection * -1;
      ballSpeed++;
      paddleHitSound.currentTime = 0;
      paddleHitSound.play();
    }
  }

  if (ballX >= paddle2.x - ballRadius) {
    if (ballY > paddle2.y && ballY < paddle2.y + paddle2.height) {
      ballX = paddle2.x - ballRadius; // If ball gets stuck
      ballXDirection = ballXDirection * -1;
      ballSpeed++;
      paddleHitSound.currentTime = 0;
      paddleHitSound.play();
    }
  }
}

function changeDirection(event) {
  // Get the key code of the key that was pressed
  const keyPressed = event.keyCode;

  // Key codes of...
  const paddle1Up = 87; // "W" Key
  const paddle1Down = 83; // "S" Key
  const paddle2Up = 38; // "Up Arrow" Key
  const paddle2Down = 40; // "Down Arrow" Key

  // Move paddles up and down
  if (keyPressed === paddle1Up) {
    if (paddle1.y > 0) {
      paddle1.y = paddle1.y - paddleSpeed;
    }
  } else if (keyPressed === paddle1Down) {
    if (paddle1.y < gameHeight - paddle1.height) {
      paddle1.y = paddle1.y + paddleSpeed;
    }
  } else if (keyPressed === paddle2Up) {
    if (paddle2.y > 0) {
      paddle2.y = paddle2.y - paddleSpeed;
    }
  } else if (keyPressed === paddle2Down) {
    if (paddle2.y < gameHeight - paddle2.height) {
      paddle2.y = paddle2.y + paddleSpeed;
    }
  }
}

function updateScore() {
  scoreText.textContent = `${player1Score}:${player2Score}`;
  scoreSound.currentTime = 0;
  scoreSound.play();
}

function restartGame() {
  // Reset score
  player1Score = 0;
  player2Score = 0;

  // Reset player 1 paddle position
  paddle1 = {
    width: 25,
    height: 100,
    x: 0,
    y: 0,
  };

  // Reset player 2 paddle position
  paddle2 = {
    width: 25,
    height: 100,
    x: gameWidth - 25,
    y: gameHeight - 100,
  };

  // Reset ball to center
  ballX = gameWidth / 2;
  ballY = gameHeight / 2;
  ballSpeed = 1;
  ballXDirection = 0;
  ballYDirection = 0;

  clearInterval(intervalID);
  clearBoard();
  drawPaddles();
  drawBall(ballX, ballY);
  updateScore();
  restartButton.textContent = "PLAY";

  // Reattach start listener
  document.addEventListener("keydown", startGame);
  window.addEventListener("mousedown", startGame);
}

function gameStart() {
  restartButton.textContent = "RESTART";
  document.removeEventListener("keydown", startGame);
  window.removeEventListener("mousedown", startGame);
  nextTick();
  createBall();
}

function startGame() {
  gameStart();
}

// Draw paddles and ball initially
clearBoard();
drawPaddles();
drawBall(ballX, ballY);
updateScore();

// Touch controls
window.addEventListener("touchstart", (e) => {
  const touch = e.touches[0];
  const touchY = touch.clientY;
  const touchX = touch.clientX;

  const halfScreenWidth = window.innerWidth / 2;
  const halfScreenHeight = window.innerHeight / 2;

  if (touchX < halfScreenWidth) {
    // Left half of screen: control Player 1
    if (touchY < halfScreenHeight) {
      if (paddle1.y > 0) {
        paddle1.y -= paddleSpeed;
      }
    } else {
      if (paddle1.y < gameHeight - paddle1.height) {
        paddle1.y += paddleSpeed;
      }
    }
  } else {
    // Right half of screen: control Player 2
    if (touchY < halfScreenHeight) {
      if (paddle2.y > 0) {
        paddle2.y -= paddleSpeed;
      }
    } else {
      if (paddle2.y < gameHeight - paddle2.height) {
        paddle2.y += paddleSpeed;
      }
    }
  }
});

window.addEventListener("mousedown", startGame);
document.addEventListener("keydown", startGame);
window.addEventListener("keydown", changeDirection);
