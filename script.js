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