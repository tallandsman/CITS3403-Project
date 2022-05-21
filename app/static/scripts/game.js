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

    // Boolean representing whether or not the tile element has been added
    // as an HTML element.
    this.elementShown = false;

    // Boolean representing whether or not the tile is 'flagged'.
    this.flag = false;
}

/**
 * Method that will add the HTML image element of the flag
 * to the div.
 */
Tile.prototype.addFlag = function() {

    // Uses the tile object information to find the corresponding html element.
    let cellDiv = document.getElementById("boardTable").rows[this.row].cells[this.col].children[0];
    if (this.flag) {

        let img = document.createElement("img");
        img.src = "../static/images/buoy-nobg.png";

        // Adding the classes to the image for it to be styled in the cell.
        img.classList.add("cell-img");
        img.classList.add("flag");

        cellDiv.appendChild(img);
        this.elementShown = true;
    }
}

/** 
 * Method that will remove all children elements of the tile div element.
 */
Tile.prototype.removeElement = function() {
    
    // Uses the tile object information to find the corresponding html element.
    let cellDiv = document.getElementById("boardTable").rows[this.row].cells[this.col].children[0];
    cellDiv.innerHTML = "";
    this.elementShown = false;
}

/**
 * Method that adds the corresponding html elements to the tile.
 */
Tile.prototype.addNum = function() {

    // Uses the tile object information to find the corresponding html element.
    let cellDiv = document.getElementById("boardTable").rows[this.row].cells[this.col].children[0];

    // If the tile has a non-zero number but it isn't currently shown.
    if (this.number != 0 && !this.shark && !this.elementShown) {
        let h4 = document.createElement("h4");
        let text = document.createTextNode(this.number);

        h4.classList = "cellNum halign-text";

        h4.appendChild(text);
        cellDiv.appendChild(h4);

        this.elementShown = true;
    }

    // If the tile is a shark.
    else if (this.shark) {
        let img = document.createElement("img");
        img.src = "../static/images/shark_nobg.png";

        img.classList.add("cell-img");

        cellDiv.appendChild(img);
        this.elementShown = true;
    }
}

/**
 * Method that updates the css styling of the html element representing 
 * the tile based on the tiles current state.
 */
Tile.prototype.updateStyle = function() {

    // Using the logical row and column to reference the html elements representing the tile.
    let cellDiv = document.getElementById("boardTable").rows[this.row].cells[this.col].children[0];

	document.getElementById("flagsLeft").innerHTML = window.flagsLeft;

    // Adding styles to the html element depending on it's current state.
    cellDiv.classList = "cellDiv";
    if (this.mystery) {

        cellDiv.classList.add("unidentified");

        // If the tile is flagged but there is no html element children.
        if (this.flag && cellDiv.children.length == 0) {
            this.addFlag();
        }
        // If the tile is not flagged but there is an html element child.
        if (!this.flag && cellDiv.children.length != 0) {
            this.removeElement();
        }
    }
    else {
        cellDiv.classList.add("identified");

        // Removes all html element children.
        this.removeElement();

        // Adds the shark image element or the number text node.
        this.addNum();
    }
}

/**
 * Method that reveals changes the mystery state of the tile 
 * and then updates its corresponding HTML element's styling.
 */
Tile.prototype.reveal = function() {

    // Reveals the current tile and updates it's style.
    this.mystery = false;

	if (this.flag) {
		this.flag = false;
		window.flagsLeft++;
	}
		
    this.updateStyle();

    window.revTiles++;
    if (window.revTiles == (ROW*COL - NUMSHARK)) {
        gameWin();
    }

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

                            // If the neighbour is a flag with a number, it is not 
                            // flood fill revealed.
                            if (!neighbour.flag || neighbour.number == 0) {
                                neighbour.reveal();
                            }
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
function tileLeftClick(event) {

    let div = event.target.closest("div");

    // Uses the element to find the corresponding tile's logical 
    // row and column.
    let rowInd = div.parentNode.closest("tr").rowIndex;
    let colInd = div.parentNode.cellIndex;
    let tile = window.board[rowInd][colInd];

    // Action changes depending on the tile clicked.
    if (!tile.mystery) {
        // ALREADY CLICKED
    }
    else if (tile.flag) {
        // FLAGGED
    }
    else if (tile.shark) {
        // GAME OVER
        gameOver();
    }
    else {
        tile.reveal();
    }
}

/**
 * Will change the flag property of the tile to true.
 */
function tileRightClick(event) {

    let div = event.target.closest("div");

    // Uses the element to find the corresponding tile's logical 
    // row and column.
    let rowInd = div.parentNode.closest("tr").rowIndex;
    let colInd = div.parentNode.cellIndex;
    let tile = window.board[rowInd][colInd];

    // Only has action if the tile is unrevealed.
    if (tile.mystery && !tile.flag) {

		if (window.flagsLeft > 0) {
			// Turns the flag state of the tile to true.
			tile.flag = true;
			window.flagsLeft--;
			tile.updateStyle();
		}
    }
    else if (tile.mystery && tile.flag) {

        // Turns the flag state of the tile to false.
        tile.flag = false;
		window.flagsLeft++;
        tile.updateStyle();
    }

}

/**
 * Function that sends the result stats of a game to the flask backend
 * via a POST request and the use of an XMLHttpRequest.
 */
function sendStats(DBurl, compTime, gameOutcome) {

	// Creates a datetime object to represent the date of the puzzle played.
	// This object is rounded to the day as puzzles are created daily.
	let gameDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

	// Parameters/values to be passed to the backend are stored in a string,
	// This allows for them to be sent in the .send() method.
	var params = {
		"date": gameDate,
		"time": compTime,
		"gameOutcome": gameOutcome
	};

	$.ajax({
		type: "POST",
		url: DBurl,
		data: JSON.stringify(params),
		contentType: "application/json",
		dataType: "json"
	})
}

/**
 * Function that triggers the game winning set of actions.
 */
function gameWin() {

	document.getElementById("statusLine").innerHTML = "The beach is safe!";

    // Stop Timer
	let time = stopTimer();

	sendStats("/gamestats", time[0]*60 + time[1], true);
}

/**
 * Function that triggers the game over set of actions for when 
 * the timer runs out or when a shark is clicked.
 */
function gameOver() {
    revealBoard();
	let time = stopTimer();

	sendStats("/gamestats", time[0]*60 + time[1], false);
}

/**
 * Function that reveals the whole board.
 */
function revealBoard() {

    // Iterates through each tile.
    for (let row=0; row<ROW; row++) {
        for (let col=0; col<COL; col++) {
            window.board[row][col].flag = false;
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

	document.getElementById("gameBoard").innerHTML = "";
	let div = document.createElement("div");
	div.classList.add("vertical-center");
	div.classList.add("horizontal-center")
	div.id = "boardDiv";
	let table = document.createElement("table");
	table.id = "boardTable";
	div.appendChild(table);
    document.getElementById("gameBoard").appendChild(div);

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
 * Function that uses jQuery and AJAX requests to retrieve the puzzle for the day.
 */
function getPuzzle() {

	$.get ({
		url: "/puzzle",
		success: function(data) {
            let sharkArray = data.split(",");
            genShark(sharkArray);
		},
		dataType: "json" 
	});

}

/**
 * Function that updates the relevant Tile object information.
 */
function genShark(sharkArray) {
	
	// Retrieve the shark positions from the flask database.
	for (let shark=0; shark<NUMSHARK; shark++) {
		// Add the sharks to the game board
		addShark(Number(sharkArray[shark]));
	}
}

/**
 * Function that creates a datetime object to mark the start
 * time of the game.
 */
function startTimer() {
    window.startTime = new Date().getTime();
}

/**
 * Function that creates a new datetime object and uses it to calculate
 * how long the current game has been running for. The function then 
 * calculates the seconds and minutes and updates the HTML timer accordingly.
 */
function updateTimer() {
	var stopTime = new Date().getTime();
	var timeDiff = stopTime - window.startTime;
	var minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
	var seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
	document.getElementById("timerMins").innerHTML = minutes.toLocaleString('en-US', {minimumIntegerDigits: 2});
	document.getElementById("timerSecs").innerHTML = seconds.toLocaleString('en-US', {minimumIntegerDigits: 2});
	return [minutes, seconds];
}

/**
 * Function that will clear the set interval such that the
 * timer stops ticking up.
 */
function stopTimer() {
	let finishTime = updateTimer();
	clearInterval(window.myInterval);
	return finishTime;
}

/**
 * Initialising the pages default game state
 */
function gameStart() {

	if (!window.inProgress) {
		window.board = makeBoard();
		getPuzzle();
		makeHTMLTable();

		window.revTiles = 0;
		window.flagsLeft = NUMSHARK;

		document.getElementById("sharkNum").innerHTML = NUMSHARK;
		
		// Initially sets the styling for the board.
		for (let row=0; row<ROW; row++) {
			for (let col=0; col<COL; col++) {
				window.board[row][col].updateStyle();
			}
		}

		// Event listener for any mousedown event.
		$('.cellDiv').on('mousedown', function( event ) {
			switch (event.which) {
				// Left mouse button
				case 1:
					tileLeftClick(event);
					break;
				// Right mouse button
				case 3:
					tileRightClick(event);
					break;
				default:
			}
		});

		// Disabling the context menu that usually appears on right click,
		// whilst the user's cursor is hovering over the game board section.
		const noRightClick = document.getElementById("gameBoard");
		noRightClick.addEventListener("contextmenu", e => e.preventDefault());

		document.getElementById("statusLine").innerHTML = "The beach is in danger!";

		document.getElementById("startButton").classList.remove("no-game");
		document.getElementById("startButton").classList.add("game");

		window.inProgress = true;

		// Starts the game timer and the HTML elements are set to update 
		// at a 1 second interval.
		startTimer();
		window.myInterval = setInterval(updateTimer, 1000);
	}
}

/**
 * Function that restarts and resets the timer and gameboard so that
 * the game can be restarted.
 */
function restartGame() {
    stopTimer();
	document.getElementById("timerMins").innerHTML = "00";
	document.getElementById("timerSecs").innerHTML = "00";
	document.getElementById("flagsLeft").innerHTML = "";
	document.getElementById("sharkNum").innerHTML = "";
	
	// Calls init() to reset the game state.
	init();
}

/**
 * Function that creates the start button upon page load,
 * and also creates event listeners for page buttons.
 */
function init() {

	window.inProgress = false;
	document.getElementById("gameBoard").innerHTML = "";
	// let panel = document.getElementById("buttonPanel")
	// let startDiv = document.createElement("div");
	// let startButton = document.createElement("button");
	// let textNode = document.createTextNode("START");

	// startDiv.id = "startDiv";

	// startButton.classList.add("softBorder");
	// startButton.classList.add("btn");
	// startButton.classList.add("btn-success");
	// startButton.classList.add("vertical-center");
	// startButton.classList.add("horizontal-center");
	// startButton.id = "startButton";

	// startButton.appendChild(textNode);
	// startDiv.appendChild(startButton);
	// document.getElementById("gameBoard").appendChild(startDiv);

	// Event listeners for clicking the start or restart buttons.
	$("#startButton").on("click", gameStart);

	$("#restartButton").on("click", restartGame);
}