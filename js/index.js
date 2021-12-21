// gameBoard module
// has array inside gameboard
const gameBoard = (() => {
  const _gb = new Array(9);

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
      alert("spot is filled already!");
    }
    

  }

  return {
    showBoard,
    getBoard,
    mark
  }
})();

// displayController module
const displayController = (() => {
  const renderBoard = (arr) => {
    const gbDiv = document.getElementById('gameBoard');

    for (let i = 0; i < arr.length; i++) {  
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.setAttribute('data-attribute', i);

      cell.addEventListener('click', (e) => {
        const spot = parseInt(e.target.getAttribute('data-attribute'));
        gameBoard.mark(spot, game.getCurrentPlayerSign());
      })

    }
  }

  const mark = (spot, sign) => {
    const chosen = document.querySelector(`[data-attribute="${spot}"]`);
    chosen.textContent = sign;
  }

  return {
   renderBoard,
   mark
  }
})();

// player factory
const Player = (name, sign) => {
  const _name = name;
  const _sign = sign;
  const getName = () => _name;
  const getSign = () => _sign;
  const mark = (spot) => {
    gameBoard.mark(spot, _sign);
  }

  return {
    getName,
    getSign,
    mark
  }
}

// game module
const game = (() => {
  let players = {};
  let turn;
  const setPlayers = (playerOne, playerTwo) => {
    players = {
      1: playerOne,
      2: playerTwo
    }
  }
  const getPlayers = () => players;
  const setPlayerTurn = (playerNumber = 1) => {
    if (playerNumber == 1) {
      turn = 1;
      console.log(`${players[1].getName()}'s turn`);
    } else if (playerNumber == 2) {
      turn = 2;
      console.log(`${players[2].getName()}'s turn`);
    }
  }

  const swapTurns = () => {
    turn == 1 ? setPlayerTurn(2) : setPlayerTurn(1);
  }

  const getCurrentPlayerSign = () => players[turn].getSign();
  

  return {
    setPlayers,
    getPlayers,
    setPlayerTurn,
    swapTurns,
    getCurrentPlayerSign
  }
})();

const playerOne = Player('Player one', 'X');
const playerTwo = Player('Player two', 'O');
game.setPlayers(playerOne, playerTwo);
game.setPlayerTurn(1);
displayController.renderBoard(gameBoard.getBoard());
