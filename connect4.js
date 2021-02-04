/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let gameOver = false;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

// Reset Button 
document.getElementById('reset').addEventListener('click', ()=>{
  makeBoard();
  document.getElementById('board').innerHTML = '';
  makeHtmlBoard(); 
  document.getElementById('playerTurn').innerText = "Player One's Turn"; 
  gameOver = false; 
});


/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
  board = [];
  for(let h = 0; h < HEIGHT; h++){
    let row = []; 
    for(let w = 0; w < WIDTH; w++){
      row.push(null); 
    }
    board.push(row);
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.getElementById('board');
  // TODO: add comment for this code

  // Create tr for the top row of the table 
  // and set handler
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // TODO: add comment for this code
  // Create number of tr rows equivalent to HEIGHT 
  // each with a number of td cells equivalent to WIDTH
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // TODO: write the real version of this, rather than always returning 0
  let y = null; 
  board.reduce((a,b,i)=>{
    if(b[x] === null){
      y = i;
    }
  }, y)
  return y;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  const cell = document.getElementById(`${y}-${x}`);
  const div = document.createElement('div'); 
  div.classList.add('piece'); 
  div.classList.add(`player-${currPlayer}`);
  cell.append(div);
}

/** endGame: announce game end */

function endGame(msg) {
  // TODO: pop up alert message
  alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  if(gameOver){
    return; 
  }
  // get x from ID of clicked cell
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  board[y][x] = currPlayer; 

  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    gameOver = true;
    document.getElementById('playerTurn').textContent = '';
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
  if(board.every(b => b.every(c => c))){
    gameOver = true;
    document.getElementById('playerTurn').textContent = '';
    return endGame(`Tie!`);
  }
  // switch players
  // TODO: switch currPlayer 1 <-> 2
  currPlayer = (currPlayer == 1) ? 2 : 1; 
  document.getElementById('playerTurn').innerText = `Player ${(currPlayer == 1) ? 'One' : "Two"}'s Turn`;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.

  // Step through each cell
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {

      // create arrays of four cells to test for win

      // current cell and the next three cels to the right
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];

      // current cell and the three above it
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      
      // current cell and three diagnol to the right and up 
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];

      // current cell and three diagnol to the left and up
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      // pass each array to _win(), if a single call returns true, return true
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
