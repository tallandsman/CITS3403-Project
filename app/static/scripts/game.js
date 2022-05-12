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

function gameOver() {
    alert("Game Over");
}

function tileClick() {
    console.log("Hello");
    let rowInd = this.parentNode.closest("tr").rowIndex;
    let colInd = this.parentNode.cellIndex;

    let tile = window.board[rowInd][colInd];

    if (tile.number == -1) {
        // Game Over
        gameOver();
    }
    else {
        console.log("Hi");
        revealTile(rowInd, colInd, tile, this);
    }
}
/**
 * Reveals the selected tile and adjust its styling accordingly.
 */
function revealTile(row, col, tile, divElement) {
    console.log("row: " + row);
    console.log("col: " + col);
    console.log("tileNumber: " + tile.number);
    if (tile.number == -1) {
        // Ignore
    }
    else {
        tile.revealed = true;
        divElement.classList.remove("unidentified");
        divElement.classList.add("identified");

        if (tile.number > 0) {
            let para = document.createElement("h4");
            let text = document.createTextNode(tile.number);
            
            para.appendChild(text);
            para.classList.add("cellNum");
            para.classList.add("halign-text");

            divElement.appendChild(para);
        }

        if (tile.number == 0) {
            for (let x=row-1; x<=row+1; x++) {
                if (x < 0 || x >= ROW) {
                    continue;
                }
                for (let y=col-1; y <= col+1; y++) {
                    if (y < 0 || y >=COL) {
                        continue;
                    }
                    adjTile = window.board[x][y];
                    if (adjTile.number != -1 && !adjTile.revealed) {
                        revealTile(x, y, adjTile, document.getElementById("boardTable").rows[x].cells[y].children[0]);
                    }
                }
            }
        }
    }
    
    
}

/**
 * This function initialises a randomised game state. Creates and 
 * populates all tiles.
 */
function initTiles() {

    // A constant variable that represents the number of tiles on the game board.
    const MAXTILES = ROW * COL;

    // Randomly populating the board with a set number of sharks.
    window.sharkArr = new Array(NUMSHARK);
    let sharkArr = window.sharkArr;
    for (let shark=0; shark<NUMSHARK; shark++) {
        tile = -1;
        while (sharkArr.includes(tile) || tile == -1) {
            tile = Math.floor(Math.random() * MAXTILES);
        }
        sharkArr[shark] = tile;
    }

    /**
     * Initialisation of the 2D array that will hold the 
     * collection of tile objects.
     */
    window.board = new Array(ROW);
    let board = window.board;
    for (let row = 0; row < ROW; row++) {
        board[row] = new Array(COL);
        for (let col = 0; col < COL; col++) {
            board[row][col] = new Tile()
            if (sharkArr.includes( (row)*10 + col )) {
                board[row][col].number = -1;
            }
        }
    }

    // Adjusting the adjacency numbers based on the sharks generated.
    for (let shark=0; shark<NUMSHARK; shark++) {
        let sharkRow = Math.floor(sharkArr[shark]/10);
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
}

function init() {

    initTiles();

    var board = window.board;

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
            
            cell.classList.add("boardCell");
            div.classList.add("cellDiv");
            if (board[row][col].revealed) {
                div.classList.add("identified");
            }
            else {
                div.classList.add("unidentified");
            }
            
            cell.appendChild(div);
            gridRow.appendChild(cell);

        }
        grid.appendChild(gridRow);
    }
    console.log(board);


    $('.cellDiv').on('click', tileClick);
}

