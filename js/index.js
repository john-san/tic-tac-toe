// gameBoard module
// has array inside gameboard
const gameBoard = (() => {
  const _gb = new Array(9);

  const showBoard = () => {
    console.log(_gb);
  }
  const getBoard = () => _gb;

  const mark = (spot, sign) => {
    _gb[spot] = sign;
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
    console.log(arr);
    for (let i = 0; i < arr.length; i++) {  
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.setAttribute('data-attribute', i);
      gbDiv.appendChild(cell);
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
  const sayName = () => console.log(`My name is ${_name}`);

  const mark = (spot) => {
    gameBoard.mark(spot, _sign);
    displayController.mark(spot, _sign); 
  }

  return {
    sayName,
    mark
  }

  
}

const playerOne = Player('Player one', 'X');
const playerTwo = Player('Player two', 'O');
displayController.renderBoard(gameBoard.getBoard());