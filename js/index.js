// gameBoard module
// has array inside gameboard
const gameBoard = (() => {
  let _gb = new Array(9);
  

  const showBoard = () => {
    console.log(_gb);
  }
  const getBoard = () => _gb;

  const mark = (spot, sign) => {
    if (_gb[spot] == undefined) {
      _gb[spot] = sign;
      displayController.mark(spot, sign); 
      showBoard();
      game.swapTurns();
    } else {
      // alert("spot is filled already!");
    }

    game.checkForWin();
  }

  

  const resetBoard = () => _gb = new Array(9);
  return {
    showBoard,
    getBoard,
    mark,
    resetBoard
  }
})();

// displayController module
const displayController = (() => {
  const renderBoard = (arr) => {
    const gbDiv = document.getElementById('gameBoard');
    if (gbDiv.children) gbDiv.replaceChildren();

    for (let i = 0; i < arr.length; i++) {  
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.setAttribute('data-attribute', i);

      cell.addEventListener('click', (e) => {
        if (!game.isGameOver()) {
          const spot = parseInt(e.target.getAttribute('data-attribute'));
          gameBoard.mark(spot, game.getCurrentPlayerSign());
        }
      })
      gbDiv.appendChild(cell);
    }
  }

  const updateNames = (playerOne, playerTwo) => {
    document.getElementById('playerOneName').textContent = `${playerOne.getName()} (${playerOne.getSign()})`;
    document.getElementById('playerTwoName').textContent = `${playerTwo.getName()} (${playerTwo.getSign()})`;
  }

  const updateWins = (playerOne, playerTwo) => {
    document.getElementById('playerOneWins').textContent = playerOne.getWins();
    document.getElementById('playerTwoWins').textContent = playerTwo.getWins();
  }

  const mark = (spot, sign) => {
    const chosen = document.querySelector(`[data-attribute="${spot}"]`);
    chosen.textContent = sign;
  }

  const _gameMsg = document.getElementById('gameMsg');

  const hideGameMsg = () => _gameMsg.classList.add('hidden');
  const updateGameMsg = (message) => {
    _gameMsg.textContent = message;
    if ([..._gameMsg.classList].includes('hidden')) _gameMsg.classList.remove('hidden');
      
  }

  return {
   renderBoard,
   updateNames,
   updateWins,
   mark,
   updateGameMsg,
   hideGameMsg
  }
})();

// player factory
const Player = (name, sign) => {
  const _name = name;
  const _sign = sign;
  let _wins = 0;
  const getName = () => _name;
  const getSign = () => _sign;
  const mark = (spot) => {
    gameBoard.mark(spot, _sign);
  }

  const getWins = () => _wins;
  const incrementWins = () => _wins += 1;

  return {
    getName,
    getSign,
    getWins,
    incrementWins,
    mark
  }
}

// game module
const game = (() => {
  let _players = {};
  let _turn;
  let _gameOver = false;
  const _winConditions = {
    row1: [0,1,2],
    row2: [3,4,5],
    row3: [6,7,8],
    col1: [0,3,6],
    col2: [1,4,7],
    col3: [2,5,8],
    diag1: [0,4,8],
    diag2: [2,4,6]
  };

  const setPlayers = (playerOne, playerTwo) => {
    _players = {
      1: playerOne,
      2: playerTwo
    }
  }
  const getPlayers = () => _players;
  const setPlayerTurn = (playerNumber = 1) => {
    _turn = playerNumber;
    displayController.updateGameMsg(`${_players[playerNumber].getName()}'s turn`);
  }

  const swapTurns = () => {
    _turn == 1 ? setPlayerTurn(2) : setPlayerTurn(1);
  }

  const getCurrentPlayerSign = () => _players[_turn].getSign();

  const checkForWin = () => {
    const players = game.getPlayers();
    const gb = gameBoard.getBoard();
    for (const playerNumber in players) {
      const sign = players[playerNumber].getSign();
      function doesIdxMatchSign(idx) {
        return gb[idx] == sign;
      }
      for (const key in _winConditions) {
        if (_winConditions[key].every(doesIdxMatchSign)) {
          players[playerNumber].incrementWins();
          displayController.updateWins(playerOne, playerTwo);
          displayController.updateGameMsg(`${game.getPlayers()[playerNumber].getName()} wins!`);
          game.endGame();
          return true;
        }
      }
    };

    const isItFilled = (item) => Boolean(item) == true;
    if (gb.filter(isItFilled).length == 9) {
      displayController.updateGameMsg("It's a tie!");
      game.endGame();
    }
  }

  const isGameOver = () => _gameOver;
  const endGame = () => _gameOver = true;

  const newGame = () => {
    _gameOver = false;
    gameBoard.resetBoard();
    game.setPlayerTurn(1);
    displayController.renderBoard(gameBoard.getBoard());
    displayController.updateNames(playerOne, playerTwo);
    displayController.updateGameMsg('New game started.');
  }

  return {
    setPlayers,
    getPlayers,
    setPlayerTurn,
    swapTurns,
    getCurrentPlayerSign,
    isGameOver,
    checkForWin,
    endGame,
    newGame,
  }
})();

const playerOne = Player('Player one', 'X');
const playerTwo = Player('Player two', 'O');
game.setPlayers(playerOne, playerTwo);
game.newGame();

const newGameBtn = document.getElementById('newGameBtn');
newGameBtn.addEventListener('click', game.newGame);