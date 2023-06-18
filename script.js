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

    
})