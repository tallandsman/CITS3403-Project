/**
 * CONSTANT GLOBAL VARIABLES
 */
const ROW = 10;
const COL = 10;
const NUMSHARK = 10;

/** 
 * Constructor for a 'Tile' object.
 */
function Tile (row, col) {

    // Logical row and column for each tile within the array.
    this.row = row;
    this.col = col;

    // Boolean representing whether or not the tile is revealed.
    this.mystery = true;

    // Boolean representing whether or not the tile is a 'shark'.
    this.shark = false;

    // Integer representing the number of 'sharks' in its adjacent 8 tiles.
    this.number = 0;
}

// Method that updates the css styling of the html element representing 
// the tile based on the tiles current state.
Tile.prototype.updateStyle = function() {

    // Using the logical row and column to reference the html elements representing the tile.
    let cellDiv = document.getElementById("boardTable").rows[this.row].cells[this.col].children[0];


    // Adding styles to the html element depending on it's current state.
    cellDiv.classList = "cellDiv";
    if (this.mystery) {
        cellDiv.classList.add("unidentified");
    }
    else {
        cellDiv.classList.add("identified");
    }
}

/**
 * Method that reveals changes the mystery state of the tile 
 * and then updates its corresponding HTML element's styling.
 */
Tile.prototype.reveal = function() {

    // Reveals the current tile and updates it's style.
    this.mystery = false;
    this.updateStyle();

    // If the number of the revealed tile is 0, flood fill 
    // algorithm is enabled creating a waterfall effect.
    if (this.number == 0) {

        // Iterates through all of the neighbouring tiles.
        for (let xoff=-1; xoff<=1; xoff++) {
            for (let yoff=-1; yoff<=1; yoff++) {
                let x = this.row + xoff;
                let y = this.col + yoff;

                // Skips the current tile.
                if (x != this.row || y != this.col) {

                    // Skips any set of row/col that do not exist.
                    if (x >= 0 && x < ROW && y >= 0 && y < COL) {
                        let neighbour = window.board[x][y];

                        // If the neighbour is a shark or has already been 
                        // revealed it is skipped.
                        if (neighbour.mystery && !neighbour.shark) {
                            neighbour.reveal();
                        }
                    }
                }
            }
        }
    }
}

/**
 * Will take a 'td' elements' 'div' child and find the corresponding 
 * tile's logical row and column.
 */
function tileClick() {

    // Uses the element to find the corresponding tile's logical 
    // row and column.
    let rowInd = this.parentNode.closest("tr").rowIndex;
    let colInd = this.parentNode.cellIndex;
    let tile = window.board[rowInd][colInd];

    // Action changes depending on the tile clicked.
    if (tile.shark) {
        // GAME OVER
        gameOver();
    }
    else {
        tile.reveal();
    }

    
}

/**
 * Function that triggers the game over set of actions for when 
 * the timer runs out or when a shark is clicked.
 */
function gameOver() {
    revealBoard();
}

/**
 * Function that reveals the whole board.
 */
function revealBoard() {

    // Iterates through each tile.
    for (let row=0; row<ROW; row++) {
        for (let col=0; col<COL; col++) {
            window.board[row][col].mystery = false;
            window.board[row][col].updateStyle();
        }
    }
}

/**
 * Create a 2D array to hold each cell's tile.
 */
function makeBoard() {

    // Creating an array with ROW number of spaces to represent 
    // each row of the board.
    let board = new Array(ROW);
    for (let row=0; row<ROW; row++) {

        // Each element of the array is an array with COL 
        // numbers of spaces to represent each column.
        board[row] = new Array(COL);
        for (let col=0; col<COL; col++) {

            // A 'Tile' object is created in each cell of
            // the game board.
            board[row][col] = new Tile(row, col);
        }
    }
    return board;
}

/**
 * Create the html elements that represent the board
 */
function makeHTMLTable() {
    let table = document.getElementById("boardTable");

    // Creating ROW amount of 'tr' elements
    for (let row=0; row<ROW; row++) {
        let tr = document.createElement("tr");

        // Adding '.boardRow' class for styling purposes
        tr.classList.add("boardRow");

        // Creating COL amount of 'td' elements, each with a 'div' inside, for each row.
        for (let col=0; col<COL; col++) {

            let td = document.createElement("td");
            let div = document.createElement("div");
            
            // Adding classes for styling purposes
            td.classList.add("boardCell");
            
            // Adding text elements to all numbered cells
            let tile = window.board[row][col];
            if (tile.number != 0 && !tile.shark) {
                let h4 = document.createElement("h4");
                let text = document.createTextNode(tile.number);

                h4.classList = "cellNum halign-text";
    
                h4.appendChild(text);
                div.appendChild(h4);
            }
            // Adds the shark image for shark tiles.
            else if (tile.shark) {
                let img = document.createElement("img");
                img.src = "../static/images/shark_nobg.png";

                img.classList.add("cell-img");

                div.appendChild(img);
            }

            td.appendChild(div);
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
}

/**
 * Function that will take an integer representing the location of a shark 
 * and implement it into the game board.
 */
function addShark(pos) {

    // Using the overall position value to calculate the logical row and column.
    let row = Math.floor(pos/ROW);
    let col = pos%ROW;

    let board = window.board;

    // Changing the tile's 'shark' property to true
    board[row][col].shark = true;
    board[row][col].number = "S";

    // Changing the tile's 'number' property to reflect 
    // the number of sharks around it.
    for (let xoff=-1; xoff<=1; xoff++) {
        for (let yoff=-1; yoff<=1; yoff++) {
            let x = row + xoff;
            let y = col + yoff;
            if (x != row || y != col) {
                if (x >= 0 && x < ROW && y >= 0 && y < COL) {
                    if (!board[x][y].shark) {
                        board[x][y].number++;
                    }
                }
            }
        }
    }
}

/**
 * Function that will generate a set of 'sharks' and then 
 * updates the relevant Tile object information.
 */
function genShark() {

    // A constant variable that represents the number of tiles on the game board.
    const MAXTILES = ROW * COL;

    // Uses an array of integers ranging from 0 to 1 less than the maximum 
    // number of tiles to represent the sharks and their position in the board.
    window.sharks = new Array(NUMSHARK);
    for (let shark=0; shark<NUMSHARK; shark++) {
        do {
            // Position of sharks are randomly generated and duplicate 
            // positions are not used to ensure correct number of sharks.
            position = Math.floor(Math.random() * MAXTILES);
        } while (window.sharks.includes(position));
        window.sharks[shark] = position;
        addShark(position);
    }
    console.log(window.sharks);
}

/**
 * Initialising the pages default game state
 */
function init() {

    window.board = makeBoard();
    genShark();
    makeHTMLTable();
    
    // Initially sets the styling for the board.
    for (let row=0; row<ROW; row++) {
        for (let col=0; col<COL; col++) {
            window.board[row][col].updateStyle();
        }
    }

    // Event listener for click events.
    $('.cellDiv').on('click', tileClick);
}