/**
 * CONSTANT GLOBAL VARIABLES
 */
const ROW = 10;
const COL = 10;
const NUMSHARK = 10;

/**
 * This class represents a single tile of the game board
 */
class Tile {
    // Constructor for a tile object
    constructor() {
        this.revealed = false;
        this.number = 0;
    }

    // This function reveals the tile object
    reveal() {
        this.revealed = true;
    }
}

/**
 * Updates the html elements to reflect the current state of the board.
 */
function updateBoard() {
}

/**
 * This function initialises a randomised game state. Creates and 
 * populates all tiles.
 */
function initTiles() {

    // A constant variable that represents the number of tiles on the game board.
    const MAXTILES = ROW * COL;

    // Randomly populating the board with a set number of sharks.
    let sharkArr = new Array(NUMSHARK);
    for (let shark=0; shark<NUMSHARK; shark++) {
        tile = -1;
        while (sharkArr.includes(tile) || tile == -1) {
            tile = Math.floor(Math.random() * MAXTILES);
        }
        sharkArr[shark] = tile;
    }

    console.log(sharkArr)

    /**
     * Initialisation of the 2D array that will hold the 
     * collection of tile objects.
     */
    let board = new Array(ROW);
    for (let row = 0; row < ROW; row++) {
        board[row] = new Array(COL);
        for (let col = 0; col < COL; col++) {
            board[row][col] = new Tile()
            if (sharkArr.includes( (row)*10 + col )) {
                board[row][col].number = -1;
                board[row][col].reveal();
            }
        }
    }

    // Adjusting the adjacency numbers based on the sharks generated.
    for (let shark=0; shark<NUMSHARK; shark++) {
        let sharkRow = Math.floor(sharkArr[shark]/10);
        console.log(sharkRow);
        let sharkCol = sharkArr[shark]%10;
        for (let row=sharkRow-1; row <= sharkRow+1; row++) {
            console.log(row);
            if (row < 0 || row >= ROW) {
                continue;
            }
            for (let col=sharkCol-1; col <= sharkCol+1; col++) {
                if (col < 0 || col >=COL) {
                    continue;
                }
                if (board[row][col].number != -1) {
                    board[row][col].number++;
                }
            }
        }
    }

    updateBoard();

    return board;
}

function init() {

    let board = initTiles();

    /**
     * Creation of the html elements that represent the game board.
     */
    let grid = document.getElementById("boardTable");

    // Creating 10 rows
    for (let row=0; row<ROW; row++) {
        let gridRow = document.createElement("tr");
        gridRow.classList.add("boardRow");

        // Creating 10 cells in each row
        for (let col=0; col<COL; col++) {
            let cell = document.createElement("td");
            let div = document.createElement("div");
            let para = document.createElement("h4");
            let number;
            if (board[row][col].number != 0) {
                number = board[row][col].number;
            }
            else {
                number = "";
            }
            let text = document.createTextNode(number);
            para.classList.add("cellNum");
            para.classList.add("halign-text");
            cell.classList.add("boardCell");
            div.classList.add("cellDiv");
            if (board[row][col].revealed) {
                div.classList.add("identified");
            }
            else {
                div.classList.add("unidentified");
            }
            
            para.appendChild(text);
            div.appendChild(para);
            cell.appendChild(div);
            gridRow.appendChild(cell);

        }
        grid.appendChild(gridRow);
    }
    console.log(board);

    //
}

