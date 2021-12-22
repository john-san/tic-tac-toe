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

  const updateNames = () => {
    const playerOne = game.getPlayerOne();
    const playerTwo = game.getPlayerTwo();
    document.getElementById('playerOneName').textContent = `${playerOne.getName()} (${playerOne.getSign()})`;
    document.getElementById('playerTwoName').textContent = `${playerTwo.getName()} (${playerTwo.getSign()})`;
  }

  const updateWins = () => {
    const playerOne = game.getPlayerOne();
    const playerTwo = game.getPlayerTwo();
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

  const hideItem = (query) => document.querySelector(query).classList.add('hidden');
  const showItem = (query) => document.querySelector(query).classList.remove('hidden');

  return {
   renderBoard,
   updateNames,
   updateWins,
   mark,
   updateGameMsg,
   hideGameMsg,
   hideItem,
   showItem
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
  const getPlayerOne = () => _players[1];
  const getPlayerTwo = () => _players[2];
  const getXPlayerNumber = () => {
    for (const playerNumber in _players) {
      if (_players[playerNumber].getSign() == 'X') {
        return playerNumber;
      }
    }
  }
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
    const playerOne = game.getPlayerOne();
    const playerTwo = game.getPlayerTwo();

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
    game.setPlayerTurn(getXPlayerNumber());
    displayController.renderBoard(gameBoard.getBoard());
    displayController.updateNames();
    displayController.updateWins();
    displayController.updateGameMsg('New game started.');
  }

  return {
    setPlayers,
    getPlayers,
    getPlayerOne,
    getPlayerTwo,
    setPlayerTurn,
    swapTurns,
    getCurrentPlayerSign,
    isGameOver,
    checkForWin,
    endGame,
    newGame,
  }
})();




/* twoPlayersBtn */
const twoPlayersBtn = document.getElementById('twoPlayersBtn');
twoPlayersBtn.addEventListener('click', (e) => {
  if (![...document.querySelector('#gameArea').classList].includes('hidden'))
 {
   displayController.hideItem('#gameArea');
 }

  // Helpers 
  const setAttributes = (el, object) => {
    for (const attr in object) {
      el.setAttribute(attr, object[attr])
    }
  }
  const br = () => document.createElement('br');
  const appendChildren = (parentEl, ...childEls) => {
    childEls.forEach(child => parentEl.appendChild(child));
  }

  if (!document.querySelector('form')) {
    // add form to dom
    const form = document.createElement('form');
    const playerOneLabel = document.createElement('label');
    playerOneLabel.setAttribute('for', 'playerOneName');
    playerOneLabel.textContent = 'Player 1';
    const playerOneInput = document.createElement('input');
    setAttributes(playerOneInput, {
      'type': 'text',
      'id': 'playerOneName',
      'name': 'playerOneName',
      'placeholder': 'Enter Name',
      'autocomplete': 'off',
      'required' : ''
    });


    function swapSign(e) {
      e.preventDefault();
      if (playerOneSign.textContent == 'X') {
        playerOneSign.textContent = 'O';
        playerTwoSign.textContent = 'X';
      } else {
        playerOneSign.textContent = 'X';
        playerTwoSign.textContent = 'O';
      }
    }
    const playerOneSign = document.createElement('button');
    playerOneSign.textContent = 'X';
    playerOneSign.addEventListener('click', swapSign);

    const playerTwoLabel = document.createElement('label');
    playerTwoLabel.setAttribute('for', 'playerTwoName');
    playerTwoLabel.textContent = 'Player 2';
    const playerTwoInput = document.createElement('input');
    setAttributes(playerTwoInput, {
      'type': 'text',
      'id': 'playerTwoName',
      'name': 'playerTwoName',
      'placeholder': 'Enter Name',
      'autocomplete': 'off',
      'required' : ''
    });
    
    const playerTwoSign = document.createElement('button');
    playerTwoSign.textContent = 'O';
    playerTwoSign.addEventListener('click', swapSign)


    const submitBtn = document.createElement('input');
    setAttributes(submitBtn, {
      'type': 'submit',
      'value': 'Submit'
    });

    
    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      console.log(e);
      console.log('submitted');
      // form hides
      displayController.hideItem('form');
      displayController.showItem('#gameArea');
      // game starts and is shown
      const playerOne = Player(playerOneInput.value, playerOneSign.textContent);
      const playerTwo = Player(playerTwoInput.value, playerTwoSign.textContent);
      game.setPlayers(playerOne, playerTwo);
      game.newGame();
      // destroy form
      form.remove();
    })
    
    appendChildren(form, 
      playerOneLabel, 
      playerOneInput, 
      playerOneSign, 
      br(), 
      playerTwoLabel, 
      playerTwoInput,
      playerTwoSign,
      br(), 
      submitBtn
    );

    document.querySelector('.container').appendChild(form);
  }
  

})

const newGameBtn = document.getElementById('newGameBtn');
newGameBtn.addEventListener('click', game.newGame);