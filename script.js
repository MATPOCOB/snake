window.addEventListener('DOMContentLoaded', (event) => {

  setTimeout(() => {
    document.querySelector(".nokia").classList.add("nokia-fullscreen")
  }, 1000)

  setTimeout(() => {
    document.querySelector(".hit-space").classList.remove("d-none")
  }, 2000)

  var canvas = document.getElementById('canvas');

  var ctx = canvas.getContext('2d'),
    scoreIs = document.getElementById('score'),
    direction = '',
    directionQueue = '',
    fps = 200,
    snake = [],
    snakeLength = 10,
    cellSize = 30,
    snakeColor = '#273122',
    loop = undefined,
    foodColor = '#ff3636',
    foodX = [],
    foodY = [],
    gameStared = false,
    paused = false,
    food = {
      x: 0,
      y: 0
    },
    score = 0;

  // pushes possible x and y positions to seperate arrays
  for (i = 0; i <= canvas.width - cellSize; i += cellSize) {
    foodX.push(i);
    foodY.push(i);
  }
  // makes canvas interactive upon load
  canvas.setAttribute('tabindex', 1);
  canvas.style.outline = 'none';
  canvas.focus();

  // draws a square.. obviously
  function drawSquare(x, y, color, char) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, cellSize, cellSize);
    ctx.font = '15px nokia';
    ctx.fillStyle = char === '/' ? 'orange' : '#5d7950';
    ctx.fillText(char === '/' ? '//' : char, x+10, y+21);
  }

  // giving the food object its coordinates
  function createFood() {
    food.x = foodX[Math.floor(Math.random() * foodX.length)]; // random x position from array
    food.y = foodY[Math.floor(Math.random() * foodY.length)]; // random y position from array
    // looping through the snake and checking if there is a collision
    for (i = 0; i < snake.length; i++) {
      if (checkCollision(food.x, food.y, snake[i].x, snake[i].y)) {
        createFood();
      }
    }
  }

  // drawing food on the canvas
  function drawFood() {
    const foodImage = new Image();
    foodImage.src = './bug.svg';

    ctx.drawImage(foodImage, food.x, food.y);
  }

  // setting the colors for the canvas. color1 - the background, color2 - the line color
  function setBackground(color1, color2) {
    ctx.fillStyle = color1;
    ctx.strokeStyle = color2;

    ctx.fillRect(0, 0, canvas.height, canvas.width);

    for (var x = 0.5; x < canvas.width; x += cellSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
    }
    for (var y = 0.5; y < canvas.height; y += cellSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
    }

    ctx.stroke()
  }

  // creating the snake and pushing coordinates to the array
  // same positions
  function createSnake() {
    snake = [];
    for (let i = 0; i < snakeLength; i++) {
      k = i * cellSize+cellSize*10;
      snake.push({x: k, y: 0});
    }
  }

  const SNAKE_NAME = '/CODEBORNE/MIRA/OLHA/KÄTLIN/BATMAN/MAKSIM/KIRILL';

  // loops through the snake array and draws each element
  function drawSnake() {
    console.log(snake)
    for (i = 0; i < snake.length; i++) {
      let char = i < SNAKE_NAME.length ? SNAKE_NAME[i] : '';
      drawSquare(snake[i].x, snake[i].y, snakeColor, char);
    }
  }

  // keyboard interactions | direction != '...' doesn't let the snake go backwards
  function changeDirection(keycode) {
    if (keycode == 37 && direction != 'right') {
      directionQueue = 'left';
    } else if (keycode == 38 && direction != 'down') {
      directionQueue = 'up';
    } else if (keycode == 39 && direction != 'left') {
      directionQueue = 'right';
    } else if (keycode == 40 && direction != 'top') {
      directionQueue = 'down'
    }
  }

  // changing the snake's movement
  function moveSnake() {
    var x = snake[0].x; // getting the head coordinates...hhehehe... getting head..
    // anyway... read on...
    var y = snake[0].y;

    direction = directionQueue;

    if (direction == 'right') {
      x += cellSize;
    } else if (direction == 'left') {
      x -= cellSize;
    } else if (direction == 'up') {
      y -= cellSize;
    } else if (direction == 'down') {
      y += cellSize;
    }
    // removes the tail and makes it the new head...very delicate, don't touch this
    var tail = snake.pop();
    tail.x = x;
    tail.y = y;
    snake.unshift(tail);
  }

  // checks if too coordinates match up
  function checkCollision(x1, y1, x2, y2) {
    if (x1 == x2 && y1 == y2) {
      return true;
    } else {
      return false;
    }
  }

  // main game loop
  function game() {
    var head = snake[0];
    // checking for wall collisions
    if (head.x < 0 || head.x > canvas.width - cellSize || head.y < 0 || head.y > canvas.height - cellSize) {
      setBackground();
      createSnake();
      drawSnake();
      createFood();
      drawFood();
      directionQueue = 'left';
      score = 0;
    }
    // checking for colisions with snake's body
    for (i = 1; i < snake.length; i++) {
      if (head.x == snake[i].x && head.y == snake[i].y) {
        setBackground();
        createSnake();
        drawSnake();
        createFood();
        drawFood();
        directionQueue = 'left';
        score = 0;
      }
    }
    // checking for collision with food
    if (checkCollision(head.x, head.y, food.x, food.y)) {
      snake[snake.length] = {x: head.x, y: head.y};
      createFood();
      drawFood();
      score += 1;
    }

    document.addEventListener('keydown', function (evt) {
      evt = evt || window.event;
      changeDirection(evt.keyCode)
    });

    ctx.beginPath();
    setBackground('#5d7950', '#5d7950');
    scoreIs.innerHTML = score;
    drawSnake();
    drawFood();
    moveSnake();
  }

  function newGame() {
    direction = 'left'; // initial direction
    directionQueue = 'left';
    ctx.beginPath();
    createSnake();
    createFood();

    if (typeof loop != 'undefined') {
      clearInterval(loop);
    } else {
      loop = setInterval(game, fps);
    }
  }

  document.addEventListener('keydown', function (evt) {
    if (evt.keyCode === 32) {

      if (!gameStared) {
        gameStared = true
        document.querySelector(".canvas-container").classList.remove("d-none");
        newGame();
        return
      }

      if (paused) {
        resume()
      } else {
        pause()
      }
    }
  });

  function pause() {
    clearInterval(loop)
    paused = true
  }

  function resume() {
    paused = false
    game()
    loop = setInterval(game, fps);
  }
})