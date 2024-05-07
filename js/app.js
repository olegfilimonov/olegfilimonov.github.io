function toggleTheme() {
  const currentTheme = document.body.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.body.setAttribute('data-theme', newTheme);
  updateIcon();
}

function updateIcon() {
  const themeIcon = document.querySelector('.theme-toggle');
  if (document.body.getAttribute('data-theme') === 'dark') {
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
  } else {
    themeIcon.classList.remove('fa-sun');
    themeIcon.classList.add('fa-moon');
  }
}

// Automatically set the theme on initial load
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.body.setAttribute('data-theme', 'dark');
  updateIcon();
}

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  let snake = [{x: 150, y: 150}, {x: 140, y: 150}, {x: 130, y: 150}, {x: 120, y: 150}, {x: 110, y: 150}];
  let dx = 10;
  let dy = 0;
  let foodX;
  let foodY;
  let score = 0;

  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function drawSnakePart(snakePart) {
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--snake-color');
    ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
  }

  function drawSnake() {
    snake.forEach(drawSnakePart);
  }

  function advanceSnake() {
    let head = {x: snake[0].x + dx, y: snake[0].y + dy};
    if (head.x >= canvas.width) head.x = 0;
    else if (head.x < 0) head.x = canvas.width - 10;
    if (head.y >= canvas.height) head.y = 0;
    else if (head.y < 0) head.y = canvas.height - 10;
    snake.unshift(head);
    const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
    if (didEatFood) {
      score += 10;
      createFood();
    } else {
      snake.pop();
    }
  }

  function randomTen(min, max) {
    return Math.floor(Math.random() * (max-min) / 10) * 10 + min;
  }

  function createFood() {
    foodX = randomTen(0, canvas.width - 10);
    foodY = randomTen(0, canvas.height - 10);
    snake.forEach(function isFoodOnSnake(part) {
      const foodIsOnSnake = part.x === foodX && part.y === foodY;
      if (foodIsOnSnake) {
        createFood();
      }
    });
  }

  function drawFood() {
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--food-color');
    ctx.fillRect(foodX, foodY, 10, 10);
  }

  function main() {
    if (didGameEnd()) return;
    setTimeout(function onTick() {
      clearCanvas();
      drawFood();
      if (shouldMoveSnake()) {
        advanceSnake();
      }
      drawSnake();
      main();
    }, 50);
  }

  let moveCounter = 0;
  let moveInterval = 1;

  function shouldMoveSnake() {
    moveCounter++;
    if (moveCounter >= moveInterval) {
      moveCounter = 0;
      return true;
    }
    return false;
  }

  function didGameEnd() {
    for (let i = 4; i < snake.length; i++) {
      const didCollide = snake[i].x === snake[0].x && snake[i].y === snake[0].y;
      if (didCollide) return true;
    }
    return false;
  }

  function changeDirection(event) {
    const keyPressed = event.keyCode;
    const goingUp = dy === -10;
    const goingDown = dy === 10;
    const goingRight = dx === 10;
    const goingLeft = dx === -10;
    if (keyPressed === 37 && !goingRight) {
      dx = -10;
      dy = 0;
    }
    if (keyPressed === 38 && !goingDown) {
      dx = 0;
      dy = -10;
    }
    if (keyPressed === 39 && !goingLeft) {
      dx = 10;
      dy = 0;
    }
    if (keyPressed === 40 && !goingUp) {
      dx = 0;
      dy = 10;
    }
  }

  function startGame() {
    main();
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Ensure the food is still within bounds after resize. If not, recreate it.
    if (foodX >= canvas.width || foodY >= canvas.height) {
      createFood();
    }
    // Optionally, adjust the snake's position or reset the game if necessary
  }

  window.addEventListener('resize', resizeCanvas);

  document.addEventListener("keydown", changeDirection);
  document.getElementById('moveUp').addEventListener('click', () => changeDirection({keyCode: 38}));
  document.getElementById('moveLeft').addEventListener('click', () => changeDirection({keyCode: 37}));
  document.getElementById('moveDown').addEventListener('click', () => changeDirection({keyCode: 40}));
  document.getElementById('moveRight').addEventListener('click', () => changeDirection({keyCode: 39}));
  document.getElementById('startGame').addEventListener('click', function () {
    document.querySelector('.game-controls').style.display = 'flex';
    document.getElementById('gameCanvas').style.display = 'block';
    document.getElementById('startGame').style.display = 'none';

    createFood();
    startGame();
  });
  document.getElementById('gameCanvas').style.display = 'none';
});
