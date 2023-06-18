const Player = (name, mark) => {;
    let myTurn = false;

    const changeTurn = (value) => {
        if(value !== undefined)
            myTurn = value;
        else
            myTurn = !myTurn;
    }

    const turnOrder = () => {
        return myTurn;
    }

    return {name, mark, changeTurn, turnOrder};
}

const playerOne = Player('Player 1', 'X')
const playerTwo = Player('Player 2', 'O')

const gameBoard = (() => {
    let _board = [];

    const changeMark = (x, y, symbol) => {
        _board[x][y] = symbol;
    }

    const initialize = () => {
        _board = [[null, null, null],
                 [null, null, null],
                [null, null, null]];
    }

    const getBoard = () => {
        return _board;
    }

    const getBoardDOM = () => {
        let boardDOM = [];
        const rows = [...document.querySelectorAll('.gameboard .row')];
        for(let i = 0; i < rows.length; i++) {
            const tiles = document.querySelectorAll(`.game-board .row[data-index="${i}"] .tile`)
            boardDOM.push([...tiles])
        }
        return boardDOM;
    }

    return {changeMark, initialize, getBoard, getBoardDOM};
})();

const game = (() => {
    const _tiles = document.querySelectorAll('.tile');
    const _winnerMsg = document.querySelector('.winner-text');
    const _pveBtn = document.getElementById('pve');
    const _pvpBtn = document.getElementById('pvp');
    let _gameStopped = true;
    let _PVP = false;

    _pveBtn.addEventListener('click', () => _changeGameMode(_pveBtn));
    _pvpBtn.addEventListener('click', () => _changeGameMode(_pvpBtn));

    const startGame = () => {
        gameBoard.initialize();
        _gameStopped = false;
        _pvpBtn.classList.contains('active') ? _PVP = true : _PVP = false;
        displayController.renderBoard();
        playerOne.changeTurn(true);
        playerTwo.changeTurn(false);
        displayController.changeText(_winnerMsg, '');
        _tiles.forEach(tile => tile.addEventListener('click', _tileOnClick));
    }

    const checkForWinner = (board) => {
        const winnerCheck = [_checkVertically(board), _checkHorizontally(board), _checkDiagonally(board)];
        const winner = winnerCheck.filter(item => item !== 0);
        if(winner.length !== 0) {
            return winner[0];
        }
        return false;
    }

    const playRound = (x, y, symbol) => {
        let board = gameBoard.getBoard();
        if(board[y][x] === null) {
            gameBoard.changeMark(x, y, symbol);
            displayController.renderBoard();
            playerOne.changeTurn();
            playerTwo.changeTurn();
        }
        isGameWon = checkForWinner(board);
        isGameTied = _checkForTie();

        if(isGameWon) {
            _stopGame(isGameWon);
        }
        if(isGameTied) {
            _stopGame(isGameTied);
        }
    }

    const _stopGame = (winner) => {
        _tiles.forEach(tile => tile.removeEventListener('click', _tileOnClick));
        if(winner === 1) displayController.changeText(_winnerMsg, `The Winner is ${playerOne.mark}`);
        else if(winner === 2) displayController.changeText(_winnerMsg, `The Winner is ${playerTwo.mark}`);
        else displayController.changeText(_winnerMsg, "Draw");
        _gameStopped = true;
    }

    const _tileOnClick = (e) => {
        const xIndex = e.target.dataset.index;
        const yIndex = e.target.parentElement.dataset.index;
        const symbol = playerOne.turnOrder() ? 1 : 2;
        playRound(xIndex, yIndex, symbol);
        if(!_gameStopped && !_PVP) playerAI.playRoundAI();
    }

    const _checkVertically = (board) => {
        for(let i = 0; i < 3; i++) {
            if(board[0][i] === board[1][i] && board[1][i] === board[2][i] && board[0][i] !== null) {
                const winner = board[0][i];
                return winner;
            }
        }
        return 0;
    }

    const _checkHorizontally = (board) => {
        for(let i = 0; i < 3; i++) {
            if(board[i][0] === board[i][1] && board[i][1] === board[i][2] && board[i][0] !== null) {
                const winner = board[i][0];
                return winner;
            }
        }
        return 0;
    }

    const _checkDiagonally = (board) => {
        if(board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[0][0] !== null) {
            const winner = board[0][0];
            return winner;
        } else if(board[2][0] === board[1][1] && board[1][1] === board[0][2] && board[2][0] !== null) {
            const winner = board[2][0];
            return winner;
        } else return 0;
    }

    
})