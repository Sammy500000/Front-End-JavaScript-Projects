const container = document.getElementById("game-container");
    const scoreDisplay = document.getElementById("score");
    const highScoreDisplay = document.getElementById("high-score");
    const pauseButton = document.getElementById("pause-button");
    const themeSelector = document.getElementById("theme-selector");
    const gridSize = 20;
    const totalCells = container.offsetWidth / gridSize;

    let snake, food, direction, nextDirection, score, highScore, gameInterval, isPaused, gameSpeed, sounds, snakeColor, foodColor;

    function initGame() {
      snake = [{ x: 5, y: 5 }];
      food = generateFood();
      direction = { x: 1, y: 0 };
      nextDirection = { x: 1, y: 0 };
      score = 0;
      highScore = localStorage.getItem('highScore') || 0;
      isPaused = false;
      gameSpeed = 200;
      clearInterval(gameInterval);
      gameInterval = setInterval(updateGame, gameSpeed);
      sounds = {
        eat: new Audio('eat.mp3'),
        gameOver: new Audio('gameover.mp3')
      };
      drawGame();
    }

    function drawElement(element, type) {
      const div = document.createElement("div");
      div.style.left = `${element.x * gridSize}px`;
      div.style.top = `${element.y * gridSize}px`;
      div.className = type;
      if (type === 'snake') {
        div.style.background = snakeColor;
      } else if (type === 'food') {
        div.style.background = foodColor;
      }
      container.appendChild(div);
    }

    function drawGame() {
      container.innerHTML = `
        <div id="score">Score: ${score}</div>
        <div id="high-score">High Score: ${highScore}</div>
        <button id="pause-button">Pause</button>
        <select id="theme-selector">
          <option value="default">Default</option>
          <option value="forest">Forest</option>
          <option value="ocean">Ocean</option>
        </select>
      `;
      applyTheme();
      drawElement(food, "food");
      snake.forEach(segment => drawElement(segment, "snake"));
      document.getElementById("pause-button").addEventListener("click", togglePause);
      document.getElementById("theme-selector").addEventListener("change", () => {
        applyTheme();
        drawGame();
      });
    }

    function applyTheme() {
      const selectedTheme = themeSelector.value;
      if (selectedTheme === 'forest') {
        container.style.background = 'green';
        container.style.borderColor = 'brown';
        snakeColor = 'darkgreen';
        foodColor = 'yellow';
      } else if (selectedTheme === 'ocean') {
        container.style.background = 'blue';
        container.style.borderColor = 'aqua';
        snakeColor = 'cyan';
        foodColor = 'coral';
      } else {
        container.style.background = '#000';
        container.style.borderColor = '#fff';
        snakeColor = 'limegreen';
        foodColor = 'red';
      }
    }

    function updateGame() {
      if (isPaused) return;

      direction = nextDirection;
      const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

      if (
        head.x < 0 || head.y < 0 ||
        head.x >= totalCells || head.y >= totalCells ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)
      ) {
        clearInterval(gameInterval);
        sounds.gameOver.play();
        updateHighScore();
        alert("Game Over! Your score is: " + score);
        initGame();
        return;
      }

      snake.unshift(head);

      if (head.x === food.x && head.y === food.y) {
        score++;
        food = generateFood();
        sounds.eat.play();
        gameSpeed = Math.max(gameSpeed - 5, 50);
        clearInterval(gameInterval);
        gameInterval = setInterval(updateGame, gameSpeed);
      } else {
        snake.pop();
      }

      drawGame();
    }

    function generateFood() {
      let newFood;
      do {
        newFood = {
          x: Math.floor(Math.random() * totalCells),
          y: Math.floor(Math.random() * totalCells)
        };
      } while (
        newFood.x >= totalCells || newFood.y >= totalCells ||
        snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)
      );
      return newFood;
    }

    function changeDirection(event) {
      const { key } = event;
      if (key === "ArrowUp" && direction.y === 0) nextDirection = { x: 0, y: -1 };
      else if (key === "ArrowDown" && direction.y === 0) nextDirection = { x: 0, y: 1 };
      else if (key === "ArrowLeft" && direction.x === 0) nextDirection = { x: -1, y: 0 };
      else if (key === "ArrowRight" && direction.x === 0) nextDirection = { x: 1, y: 0 };
      else if (key === " ") togglePause();
    }

    function togglePause() {
      isPaused = !isPaused;
      if (!isPaused) {
        gameInterval = setInterval(updateGame, gameSpeed);
      } else {
        clearInterval(gameInterval);
      }
      drawGame();
    }

    function updateHighScore() {
      if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
      }
    }

    document.addEventListener("keydown", changeDirection);
    initGame();