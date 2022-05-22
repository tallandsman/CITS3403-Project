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

		// Toggle on the elementShown property of the tile.
        this.elementShown = true;
    }

    // If the tile is a shark.
    else if (this.shark) {
        let img = document.createElement("img");
        img.src = "../static/images/shark_nobg.png";

		// Class that styles the image to fit inside the cell.
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

	// Removes the flag of the cell when revealed
	if (this.flag) {
		this.flag = false;
		window.flagsLeft++;
	}
		
    this.updateStyle();

	// Incrementing the global variable tracking the number of tiles revealed.
    window.revTiles++;

	// Checks if there are any non-shark tiles left to reveal.
    if (window.revTiles == (ROW*COL - NUMSHARK)) {
		// If not then trigger the game win.
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
    if (tile.shark) {
        // GAME OVER
        gameOver();
    }
	// If tile is not flagged or revealed, reveal it.
    else if (tile.mystery && !tile.flag) {
        tile.reveal();
    }
}

/**
 * Will flagged the clicked tile.
 */
function tileRightClick(event) {

    let div = event.target.closest("div");

    // Uses the element to find the corresponding tile's logical 
    // row and column.
    let rowInd = div.parentNode.closest("tr").rowIndex;
    let colInd = div.parentNode.cellIndex;
    let tile = window.board[rowInd][colInd];

    // Only flags tiles that are not revealed and not flagged.
    if (tile.mystery && !tile.flag) {

		// Can only flag if there are flags left to use
		if (window.flagsLeft > 0) {

			// Turns the flag state of the tile to true.
			tile.flag = true;

			// Decrements the flag count
			window.flagsLeft--;
			tile.updateStyle();
		}
    }
    else if (tile.mystery && tile.flag) {

        // Turns the flag state of the tile to false.
        tile.flag = false;

		// Increments the flag count
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
	let gameDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

	// Parameters to be passed to the database are stored in a 
	// dictionary.
	var params = {
		"date": gameDate,
		"time": compTime,
		"gameOutcome": gameOutcome
	};

	// AJAX POST request is sent to the flask back-end with the
	// previously packaged dictionary of values in a JSON file.
	$.ajax({
		type: "POST",
		url: DBurl,
		data: JSON.stringify(params),
		contentType: "application/json",
		dataType: "json"
	})
}

/**
 * Function that creates an acknowledgment for when the user copies
 * their game result onto their clipboard.
 */
function ackCopy() {
	
	let ack = document.createElement("p");
	ack.innerText = "Copied to Clipboard";

	// Styling the message to be italic.
	ack.style = "font-style: italic;";

	// Appends the message underneath the copy button.
	document.getElementById("shareDiv").appendChild(ack);
}

/**
 * Function that will copy a users game results to their
 * clipboard. This message will change depending on the game's
 * outcome.
 */
function copyToClipboard(time, win) {

	// Checks if the navigator and its methods work with the user's
	// current browser.
	if (navigator && navigator.clipboard && navigator.clipboard.writeText) {

		// Generates a date object of today's date and format it into a string.
		let date = new Date()
		let fullDate = date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();

		// Changes the message depending on if the user won or lost.
		if (win) {
			str = "SHARKATTACK (" + fullDate + "):\nGame Win\nTime: " + time[0] + "m & " + time[1] + "s"
		}
		else {
			str = "SHARKATTACK (" + fullDate + "):\nGame Loss\nTime: " + time[0] + "m & " + time[1] + "s"
		}

		// Presents the user with an acknowledgement of the copy.
		ackCopy();

		return navigator.clipboard.writeText(str);
	}
  	return Promise.reject('The Clipboard API is not available.');
}

/**
 * Function that will close the game summary popup upon
 * close button press.
 */
function closePopup() {
	let popup = document.getElementById("popupBgDiv");

	// Removes the whole popup element and all of its children.
	popup.parentElement.removeChild(popup);
}

/**
 * Function that dynamically creates the HTML pop-up that
 * triggers upon game completion.
 */
function endGamePopup(time, win) {
	
	// Creating a div element that holds the contents 
	// of the end game pop-up. This div takes up the entire
	// game screen to create a loss of focus effect.
	let popupBgDiv = document.createElement("div");
	popupBgDiv.id = "popupBgDiv";
	popupBgDiv.classList.add("pop-up");

	// A div that represents the actual pop-up.
	let popupBox = document.createElement("div");
	popupBox.id = "popupBox";
	popupBox.classList.add("pop-up");

	// ------------------------------------------------------------------------
	// POP-UP HEADER
	let popupHeader = document.createElement("h2");
	popupHeader.id = "popupHeader";

	// Header message that changes depending on the outcome of the game.
	let header;

	// Message for the Statistics section that will change depending
	// on the outcome of the game.
	let statmsg;

	// If win is true
	if (win) {
		header = "ALL SHARKS SPOTTED!";
		statmsg = "You cleared the beach in ";
	}
	// If win is false
	else {
		header = "SHARK ATTACK!";
		statmsg = "You were attacked by a shark after ";
	}

	// Connect the header to the pop-up box
	let text = document.createTextNode(header);
	popupHeader.appendChild(text);
	popupBox.appendChild(popupHeader);
	
	// ------------------------------------------------------------------------
	// POP-UP STATISTICS SECTION
	let statDiv = document.createElement("div");
	statDiv.id = "statDiv";
	statDiv.classList.add("popupSection");

	// Header for the statistics section
	let statHeader = document.createElement("h3");
	statHeader.id = "statHeader";
	statHeader.classList.add("popupSectionHeader");
	statHeader.innerText = "Statistics";

	// Body for the statistics section
	let statBody = document.createElement("p");
	statBody.id = "statBody";

	// Extracts minutes and seconds from the time parameter passed.
	let minutes = time[0];
	let seconds = time[1];

	// Strings that denote the units of the time components. These 
	// strings need to change based on if it is one or multiple.
	// eg. 'second' vs 'seconds'
	let minString;
	let secString;
	if (minutes == 1) {
		minString = " minute"
	}
	else {
		minString = " minutes"
	}
	if (seconds == 1) {
		secString = " second."
	}
	else {
		secString = " seconds."
	}

	// Formatting the body of the statistics section depending
	// on the time passed.
	if (minutes > 1){ 
		statBody.innerText = statmsg + minutes + minString + " and " + seconds + secString;
	}
	else {
		statBody.innerText = statmsg + seconds + secString;
	}

	// Connecting the statistic section elements to the pop-up
	statDiv.appendChild(statHeader);
	statDiv.appendChild(statBody);
	popupBox.appendChild(statDiv);

	// ------------------------------------------------------------------------
	// POP-UP SHARE SECTION
	let shareDiv = document.createElement("div");
	shareDiv.id = "shareDiv";
	shareDiv.classList.add("popupSection");

	// Header for the share section
	let shareHeader = document.createElement("h3");
	shareHeader.id = "shareHeader";
	shareHeader.classList.add("popupSectionHeader");
	shareHeader.innerText = "Share";

	// Button to share the game results to the clipboard.
	let clipboard = document.createElement("button");
	clipboard.id = "clipboard";
	clipboard.classList.add("popupBtn");
	clipboard.appendChild(document.createTextNode("Copy"));

	// Connecting the share section elements to the pop-up
	shareDiv.appendChild(shareHeader);
	shareDiv.appendChild(clipboard);
	popupBox.appendChild(shareDiv);

	// POP-UP CLOSE BUTTON SECTION
	let buttonDiv = document.createElement("div");
	buttonDiv.id = "btnDiv";
	buttonDiv.classList.add("popupSection");

	// Button used to close the pop-up
	let closeButton = document.createElement("button");
	closeButton.id = "closeButton";
	closeButton.classList.add("popupBtn");
	closeButton.appendChild(document.createTextNode("CLOSE"));

	// Connecting the share section elements to the pop-up
	buttonDiv.appendChild(closeButton);
	popupBox.appendChild(buttonDiv);

	// ------------------------------------------------------------------------
	// Connecting the pop-up box to the pop-up container
	popupBgDiv.appendChild(popupBox);
	document.getElementsByClassName("one-page")[0].appendChild(popupBgDiv);

	// ------------------------------------------------------------------------
	// Event listeners for the 'copy' and 'close' buttons
	$("#closeButton").on("click", closePopup);

	$("#clipboard").on("click", function () {
		copyToClipboard(time, win);
	});
}

/**
 * Function that triggers the game winning set of actions.
 */
function gameWin() {

	let win = true;
	document.getElementById("statusLine").innerHTML = "The beach is safe!";

    // Stop Timer
	let time = stopTimer();

	// Statistics are shared to the flask backend
	sendStats("/gamestats", time[0]*60 + time[1], win);

	// Delay time
	let popupDelay = 1000 // 1second

	// Pop-up on game completion is delayed.
	setTimeout(function() {
		endGamePopup(time, win)
	}, popupDelay);
}

/**
 * Function that triggers the game over set of actions for 
 * when a shark is clicked.
 */
function gameOver() {

	let win = false;

	// The unrevealed tiles are revealed so the user and see the other sharks.
    revealBoard();

	// Stop timer
	let time = stopTimer();

	// Statistics are shared to the flask backend
	sendStats("/gamestats", time[0]*60 + time[1], win);

	// Delay time
	let popupDelay = 1000 // 1second

	// Pop-up on game completion is delayed.
	setTimeout(function() {
		endGamePopup(time, win)
	}, popupDelay);
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

	// Calculates the time between starting the game and now
	var timeDiff = stopTime - window.startTime;

	var minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
	var seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

	// Updates the html timer elements
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
 * Function that creates the start button upon page load,
 * and also creates event listeners for page buttons.
 */
function init() {

	window.inProgress = false;
	document.getElementById("gameBoard").innerHTML = "";

	// Event listeners for clicking the start or restart buttons.
	$("#startButton").on("click", gameStart);
}