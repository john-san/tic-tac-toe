// gameBoard module
// has array inside gameboard
const gameBoard = (() => {
	let _gb = new Array(9);

	const showBoard = () => {
		console.log(_gb);
	};
	const getBoard = () => _gb;
	const getOpenSpotIdxs = () => {
		const openSpotIdxs = [];
		for (let i = 0; i < _gb.length; i++) {
			if (_gb[i] == undefined) openSpotIdxs.push(i);
		}
		return openSpotIdxs;
	};
	const mark = (spot, sign) => {
		if (_gb[spot] == undefined) {
			_gb[spot] = sign;
			displayController.mark(spot, sign);
			game.swapTurns();
		} else {
			console.log('spot is filled already!');
		}

		if (game.checkForWin(game.getPlayerOne())) {
			game.declareWinner(game.getPlayerOne());
		} else if (game.checkForWin(game.getPlayerTwo())) {
			game.declareWinner(game.getPlayerTwo());
		} else if (game.checkForTie()) {
			console.log("It's a tie!");
			displayController.updateGameMsg("It's a tie!");
			game.endGame();
		}

		game.AIMove();
	};

	const resetBoard = () => (_gb = new Array(9));
	return {
		showBoard,
		getBoard,
		mark,
		resetBoard,
		getOpenSpotIdxs,
	};
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
					console.log(`Player marking ${spot}`);
					gameBoard.mark(spot, game.getCurrentPlayerSign());
				}
			});
			gbDiv.appendChild(cell);
		}
	};

	const updateNames = () => {
		const playerOne = game.getPlayerOne();
		const playerTwo = game.getPlayerTwo();
		document.getElementById(
			'playerOneName'
		).textContent = `${playerOne.getName()} (${playerOne.getSign()})`;
		document.getElementById(
			'playerTwoName'
		).textContent = `${playerTwo.getName()} (${playerTwo.getSign()})`;
	};

	const updateWins = () => {
		const playerOne = game.getPlayerOne();
		const playerTwo = game.getPlayerTwo();
		document.getElementById('playerOneWins').textContent = playerOne.getWins();
		document.getElementById('playerTwoWins').textContent = playerTwo.getWins();
	};

	const mark = (spot, sign) => {
		const chosen = document.querySelector(`[data-attribute="${spot}"]`);
		chosen.textContent = sign;
	};

	const _gameMsg = document.getElementById('gameMsg');

	const hideGameMsg = () => _gameMsg.classList.add('hidden');
	const updateGameMsg = (message) => {
		_gameMsg.textContent = message;
		if ([..._gameMsg.classList].includes('hidden'))
			_gameMsg.classList.remove('hidden');
	};

	const hideItem = (query) =>
		document.querySelector(query).classList.add('hidden');
	const showItem = (query) =>
		document.querySelector(query).classList.remove('hidden');

	const hideGameArea = () => {
		if (
			![...document.querySelector('#gameArea').classList].includes('hidden')
		) {
			hideItem('#gameArea');
		}
	};

	const removeForm = () => {
		if (document.querySelector('form')) document.querySelector('form').remove();
	};
	return {
		renderBoard,
		updateNames,
		updateWins,
		mark,
		updateGameMsg,
		hideGameMsg,
		hideItem,
		showItem,
		hideGameArea,
		removeForm,
	};
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
	};

	const getWins = () => _wins;
	const incrementWins = () => (_wins += 1);

	return {
		getName,
		getSign,
		getWins,
		incrementWins,
		mark,
	};
};

// ai bot factory
const AIBot = (difficulty, sign) => {
	const prototype = Player('AI Bot', sign);
	const _difficulty = difficulty;
	const _sign = sign;
	const mark = (spot) => {
		gameBoard.mark(spot, _sign);
	};

	const getDifficulty = () => _difficulty;

	const AIMove = () => {
		const minimax = (newBoard, player) => {
			let availSpots = gameBoard.getOpenSpotIdxs();

			if (game.checkForWin(game.getPlayerOne())) {
				return { score: -10 };
			} else if (game.checkForWin(game.getPlayerTwo())) {
				return { score: 10 };
			} else if (availSpots.length === 0) {
				return { score: 0 };
			}

			let moves = [];

			for (let i = 0; i < availSpots.length; i++) {
				//create an object for each and store the index of that spot
				var move = {};
				move.index = availSpots[i];

				// set empty spot to the current player;
				newBoard[availSpots[i]] = player.getSign();

				/*collect the score resulted from calling minimax 
      on the opponent of the current player*/
				if (player == game.getPlayerTwo()) {
					let result = minimax(newBoard, game.getPlayerOne());
					move.score = result.score;
				} else {
					let result = minimax(newBoard, game.getPlayerTwo());
					move.score = result.score;
				}

				// reset spot to empty
				newBoard[availSpots[i]] = undefined;

				moves.push(move);
			}

			// if it is the computer's turn loop over the moves and choose the move with the highest score
			let bestMove;
			if (player == game.getPlayerTwo()) {
				let bestScore = -10000;
				for (let i = 0; i < moves.length; i++) {
					if (moves[i].score > bestScore) {
						bestScore = moves[i].score;
						bestMove = i;
					}
				}
			} else {
				// else loop over the moves and choose the move with the lowest score
				let bestScore = 10000;
				for (let i = 0; i < moves.length; i++) {
					if (moves[i].score < bestScore) {
						bestScore = moves[i].score;
						bestMove = i;
					}
				}
			}

			return moves[bestMove];
		};

		const randomMove = () => {
			const getRandomNumber = (min, max) => {
				// exclusive of max
				return Math.floor(Math.random() * (max - min) + min);
			};
			// console.log('AI making move');
			const availableIdxs = gameBoard.getOpenSpotIdxs();
			const randomSpot = getRandomNumber(0, availableIdxs.length);
			console.log('AI making random move.');
			console.log(`AI marking ${randomSpot}`);
			mark(availableIdxs[randomSpot]);
		};

		const optimalMove = () => {
			const result = minimax(gameBoard.getBoard(), game.getPlayerTwo());
			console.log('AI making optimal move.');
			console.log(`AI marking ${result.index}`);
			mark(result.index);
		};

		if (_difficulty == 'Easy') {
			randomMove();
		} else if (_difficulty == 'Medium') {
			const num = Math.random();
			if (num > 0.34) {
				optimalMove();
			} else {
				randomMove();
			}
		} else if (_difficulty == 'Hard') {
			const num = Math.random();
			if (num > 0.2) {
				optimalMove();
			} else {
				randomMove();
			}
		} else if (_difficulty == 'Impossible') {
			optimalMove();
		}
	};

	return Object.assign({}, prototype, {
		getDifficulty,
		AIMove,
	});
};

// game module
const game = (() => {
	let _players = {};
	let _turn;
	let _gameOver = false;
	let _AIGame = false;

	const _winConditions = {
		row1: [0, 1, 2],
		row2: [3, 4, 5],
		row3: [6, 7, 8],
		col1: [0, 3, 6],
		col2: [1, 4, 7],
		col3: [2, 5, 8],
		diag1: [0, 4, 8],
		diag2: [2, 4, 6],
	};

	const setPlayers = (playerOne, playerTwo) => {
		_players = {
			1: playerOne,
			2: playerTwo,
		};
	};
	const getPlayers = () => _players;
	const getPlayerOne = () => _players[1];
	const getPlayerTwo = () => _players[2];
	const getXPlayerNumber = () => {
		for (const playerNumber in _players) {
			if (_players[playerNumber].getSign() == 'X') {
				return parseInt(playerNumber);
			}
		}
	};

	const getPlayerTurn = () => _turn;
	const setPlayerTurn = (playerNumber = 1) => {
		_turn = playerNumber;
		console.log(`${_players[playerNumber].getName()}'s turn`);
		displayController.updateGameMsg(
			`${_players[playerNumber].getName()}'s turn`
		);
	};

	const swapTurns = () => {
		_turn == 1 ? setPlayerTurn(2) : setPlayerTurn(1);
	};

	const getCurrentPlayerSign = () => _players[_turn].getSign();

	const checkForTie = () => {
		const isItFilled = (item) => Boolean(item) == true;
		const gb = gameBoard.getBoard();
		return gb.filter(isItFilled).length == 9 ? true : false;
	};

	const checkForWin = (player) => {
		const gb = gameBoard.getBoard();
		const sign = player.getSign();
		const doesIdxMatchSign = (idx) => gb[idx] == sign;

		for (const key in _winConditions) {
			if (_winConditions[key].every(doesIdxMatchSign)) {
				return true;
			}
		}

		return false;
	};

	const declareWinner = (player) => {
		player.incrementWins();
		displayController.updateWins();
		console.log(`${player.getName()} wins!`);
		displayController.updateGameMsg(`${player.getName()} wins!`);
		game.endGame();
	};

	const isGameOver = () => _gameOver;
	const endGame = () => (_gameOver = true);

	const AIMove = () => {
		if (_AIGame && getPlayerTurn() == 2 && _gameOver == false) {
			getPlayerTwo().AIMove();
		}
	};

	const setAIGame = (setting) => (_AIGame = setting);

	const newGame = () => {
		_gameOver = false;
		gameBoard.resetBoard();
		game.setPlayerTurn(getXPlayerNumber());
		displayController.renderBoard(gameBoard.getBoard());
		displayController.updateNames();
		displayController.updateWins();
		displayController.updateGameMsg('New game started.');
		AIMove();
	};

	return {
		setPlayers,
		getPlayers,
		getPlayerOne,
		getPlayerTwo,
		getPlayerTurn,
		setPlayerTurn,
		swapTurns,
		getCurrentPlayerSign,
		isGameOver,
		checkForWin,
		checkForTie,
		declareWinner,
		endGame,
		newGame,
		AIMove,
		setAIGame,
	};
})();

// Form Helpers
const setAttributes = (el, object) => {
	for (const attr in object) {
		el.setAttribute(attr, object[attr]);
	}
};
const br = () => document.createElement('br');
const appendChildren = (parentEl, ...childEls) => {
	childEls.forEach((child) => parentEl.appendChild(child));
};

/* AIBotBtn */
const AIBotBtn = document.getElementById('AIBotBtn');
AIBotBtn.addEventListener('click', (e) => {
	displayController.hideGameArea();
	displayController.removeForm();

	// add form to dom
	const form = document.createElement('form');
	const playerOneLabel = document.createElement('label');
	playerOneLabel.setAttribute('for', 'playerOneName');
	playerOneLabel.textContent = 'Player 1';
	const playerOneInput = document.createElement('input');
	setAttributes(playerOneInput, {
		type: 'text',
		id: 'playerOneName',
		name: 'playerOneName',
		placeholder: 'Enter Name',
		autocomplete: 'off',
		required: '',
	});

	const swapSign = (e) => {
		e.preventDefault();
		if (playerOneSign.textContent == 'X') {
			playerOneSign.textContent = 'O';
			AISign.textContent = 'X';
		} else {
			playerOneSign.textContent = 'X';
			AISign.textContent = 'O';
		}
	};
	const playerOneSign = document.createElement('button');
	playerOneSign.textContent = 'X';
	playerOneSign.addEventListener('click', swapSign);

	const AIDifficultyLabel = document.createElement('label');
	AIDifficultyLabel.setAttribute('for', 'AI Bot Difficulty');
	AIDifficultyLabel.textContent = 'AI Bot Difficulty';
	const AIDifficultySelect = document.createElement('select');
	setAttributes(AIDifficultySelect, {
		type: 'select',
		id: 'AIBot',
		name: 'AIBot',
		required: '',
	});

	const createOptions = (...values) => {
		values.forEach((value) => {
			const option = document.createElement('option');
			option.value = value;
			option.textContent = value;
			AIDifficultySelect.appendChild(option);
		});
	};
	createOptions('Easy', 'Medium', 'Hard', 'Impossible');

	const AISign = document.createElement('button');
	AISign.textContent = 'O';
	AISign.addEventListener('click', swapSign);

	const submitBtn = document.createElement('input');
	setAttributes(submitBtn, {
		type: 'submit',
		value: 'Submit',
	});

	submitBtn.addEventListener('click', (e) => {
		e.preventDefault();
		// form hides
		displayController.hideItem('form');
		displayController.showItem('#gameArea');
		// game starts and is shown
		const playerOne = Player(
			playerOneInput.value || 'Player 1',
			playerOneSign.textContent
		);
		const AI = AIBot(AIDifficultySelect.value, AISign.textContent);
		game.setPlayers(playerOne, AI);
		game.setAIGame(true);
		game.newGame();
		// destroy form
		form.remove();
	});

	appendChildren(
		form,
		playerOneLabel,
		playerOneInput,
		playerOneSign,
		br(),
		AIDifficultyLabel,
		AIDifficultySelect,
		AISign,
		br(),
		submitBtn
	);

	document.querySelector('.container').appendChild(form);
});

/* twoPlayersBtn */
const twoPlayersBtn = document.getElementById('twoPlayersBtn');
twoPlayersBtn.addEventListener('click', (e) => {
	displayController.hideGameArea();
	displayController.removeForm();

	// add form to dom
	const form = document.createElement('form');
	const playerOneLabel = document.createElement('label');
	playerOneLabel.setAttribute('for', 'playerOneName');
	playerOneLabel.textContent = 'Player 1';
	const playerOneInput = document.createElement('input');
	setAttributes(playerOneInput, {
		type: 'text',
		id: 'playerOneName',
		name: 'playerOneName',
		placeholder: 'Enter Name',
		autocomplete: 'off',
		required: '',
	});

	const swapSign = (e) => {
		e.preventDefault();
		if (playerOneSign.textContent == 'X') {
			playerOneSign.textContent = 'O';
			playerTwoSign.textContent = 'X';
		} else {
			playerOneSign.textContent = 'X';
			playerTwoSign.textContent = 'O';
		}
	};
	const playerOneSign = document.createElement('button');
	playerOneSign.textContent = 'X';
	playerOneSign.addEventListener('click', swapSign);

	const playerTwoLabel = document.createElement('label');
	playerTwoLabel.setAttribute('for', 'playerTwoName');
	playerTwoLabel.textContent = 'Player 2';
	const playerTwoInput = document.createElement('input');
	setAttributes(playerTwoInput, {
		type: 'text',
		id: 'playerTwoName',
		name: 'playerTwoName',
		placeholder: 'Enter Name',
		autocomplete: 'off',
		required: '',
	});

	const playerTwoSign = document.createElement('button');
	playerTwoSign.textContent = 'O';
	playerTwoSign.addEventListener('click', swapSign);

	const submitBtn = document.createElement('input');
	setAttributes(submitBtn, {
		type: 'submit',
		value: 'Submit',
	});

	submitBtn.addEventListener('click', (e) => {
		e.preventDefault();
		// form hides
		displayController.hideItem('form');
		displayController.showItem('#gameArea');
		// game starts and is shown
		const playerOne = Player(
			playerOneInput.value || 'Player 1',
			playerOneSign.textContent
		);
		const playerTwo = Player(
			playerTwoInput.value || 'Player 2',
			playerTwoSign.textContent
		);
		game.setPlayers(playerOne, playerTwo);
		game.setAIGame(false);
		game.newGame();
		// destroy form
		form.remove();
	});

	appendChildren(
		form,
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
});

const newGameBtn = document.getElementById('newGameBtn');
newGameBtn.addEventListener('click', game.newGame);
