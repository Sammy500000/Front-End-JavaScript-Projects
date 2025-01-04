const board = document.getElementById('board');
    const message = document.getElementById('message');
    const restartButton = document.getElementById('restart');

    let currentPlayer = 'X';
    let gameActive = true;
    let boardState = Array(9).fill(null);

    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6]            // Diagonals
    ];

    function createBoard() {
      board.innerHTML = '';
      boardState.forEach((cell, index) => {
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
        cellElement.dataset.index = index;
        cellElement.addEventListener('click', handleCellClick);
        board.appendChild(cellElement);
      });
    }

    function handleCellClick(event) {
      const cell = event.target;
      const index = cell.dataset.index;

      if (!gameActive || boardState[index]) return;

      boardState[index] = currentPlayer;
      cell.textContent = currentPlayer;
      cell.classList.add('taken');

      if (checkWin()) {
        message.textContent = `Player ${currentPlayer} wins!`;
        gameActive = false;
      } else if (boardState.every(cell => cell)) {
        message.textContent = 'It\'s a draw!';
        gameActive = false;
      } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        message.textContent = `Player ${currentPlayer}'s turn`;
      }
    }

    function checkWin() {
      return winningCombinations.some(combination => {
        return combination.every(index => boardState[index] === currentPlayer);
      });
    }

    function restartGame() {
      currentPlayer = 'X';
      gameActive = true;
      boardState = Array(9).fill(null);
      message.textContent = `Player ${currentPlayer}'s turn`;
      createBoard();
    }

    restartButton.addEventListener('click', restartGame);

    createBoard();
    message.textContent = `Player ${currentPlayer}'s turn`;