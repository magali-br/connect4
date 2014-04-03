var tokenColour;
var playerNumber;
var mousePosition = -1;
var tokenRadius = 15;
var columnOffsetX = 25;
var columnWidth = 40;

var columnCount = 7;
var rowCount = 6;

var currentBoard;
var isFirstPlayer;
var currentPlayerTurn;

function initializeBoard(isFirst) {
	var canvas = document.createElement("canvas");
	canvas.setAttribute("id", "boardCanvas");

	canvas.setAttribute("width", 290);
	canvas.setAttribute("height", 290);
	canvas.setAttribute("tabindex", 1);

	//Jquery creation of canvas - why doesn't work??
	// var canvas = $('<canvas/>',{'id':'canvas'}).width(290).height(290);
	//var canvas = $('<canvas/>').width(290).height(290);
	$("#board").append(canvas);

	document.onmousemove = mouseMoved;
	$("#board").mousemove(mouseMoved);
	$("#board").click(mouseClicked);
	if (isFirst) {
		currentPlayerTurn = true;
	} else {
		currentPlayerTurn = false;
	}

	isFirstPlayer = isFirst;

	var numRows = rowCount;
	var numColumns = columnCount; 
	board = [];
	for (var i = 0; i < numRows; i++) {
		row = [];
		for (var j = 0; j < numColumns; j++) {
			
			row[j] = 0;
		}
		board[i] = row;
	}

	drawGrid(board);
}

function drawGrid(board) {
	var canvas = $('canvas')[0];
	var context = canvas.getContext("2d");
	context.fillStyle = '#2C3539';
	context.fillRect(0, 40, context.canvas.width, context.canvas.height);
	currentBoard = board;
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[i].length; j++) {
			if (board[i][j] == 1) {
				context.fillStyle = "red";
				drawPlacedToken(context, j, i);
				
			} else if (board[i][j] == 2) {
				
				context.fillStyle = "yellow";
				drawPlacedToken(context, j, i);
				
			} else if (board[i][j] == 0) {
				
				context.fillStyle = "white";
				drawPlacedToken(context, j, i);
			}
		}
	}
}

function drawBoard(board, isFirst, firstPlayerTurn, matchStatus) {
	if (!currentBoard) {
		initializeBoard(isFirst);
	}
	
	drawGrid(board);

	if (matchStatus == 2) {
		if (isFirst) {
			$('#status').html("You won!");
		} else {
			$('#status').html(otherUser + " won!");
		}
		currentPlayerTurn = false;
		$('#turn').html("");

	} else if (matchStatus == 3) {
		if (isFirst) {
			$('#status').html(otherUser + " won!");
		} else {
			$('#status').html("You won!");
		}
		currentPlayerTurn = false;
		$('#turn').html("");

	} else if (matchStatus == 4) {
		$('#status').html("Tie - game over!");
		currentPlayerTurn = false;
		$('#turn').html("");

	} else {

		isFirstPlayer = isFirst;
		if (isFirstPlayer) {
			tokenColour = "red";
			playerNumber = 1;
		} else {
			tokenColour = "yellow";
			playerNumber = 2;
		}

		if (isFirstPlayer && firstPlayerTurn) {

			$('#turn').html("It's your turn!");
			currentPlayerTurn = true;
		} else if (!isFirstPlayer && !firstPlayerTurn) {
			currentPlayerTurn = true;

			$('#turn').html("It's your turn!");
		} else {
			currentPlayerTurn = false;

			$('#turn').html("Waiting for " + otherUser + " to play...");

		}

		context.fillStyle = tokenColour;
		if (mousePosition == -1) {
			drawToken(context, context.canvas.width / 2, 15);
		} else {
			drawToken(context, mousePosition - tokenRadius, 15);
		}

	}

} 

function drawToken(context, x, y) {
	context.beginPath();
	context.arc(x, y, tokenRadius, 0, 2 * Math.PI);
	context.fill();
	return;
}

function drawPlacedToken(context, x, y) {
	drawToken(context, x * columnWidth + columnOffsetX, y * 40 + 25 + 40)
}

function mouseMoved(e) {
	var mouseX, mouseY;

    if(e.offsetX) {
        mouseX = e.offsetX;
    } else if(e.layerX) {
        mouseX = e.layerX;
    } else {
    	mouseX = 0;
    }

	var canvas = $('canvas')[0];
	var context = canvas.getContext("2d");
	mousePosition = mouseX - 160 + tokenRadius;
    if (mousePosition < tokenRadius * 2) {
    	mousePosition = tokenRadius * 2;
    } else if (mousePosition > context.canvas.width - 1) {
    	mousePosition = context.canvas.width - 1;
    }
	context.fillStyle = 'white';
	context.fillRect(0, 0, context.canvas.width, 40);
	context.fillStyle = tokenColour;
	drawToken(context, mousePosition - tokenRadius, 15);

}

function mouseClicked(e) {

	if (currentPlayerTurn) {
		var canvas = $('canvas')[0];
		var context = canvas.getContext("2d");
	    mouseX = mousePosition;

	    column = mouseX / (context.canvas.width / columnCount);
	    playInColumn(Math.floor(column));
	}

}

function playInColumn(column) {
	var played = false;

	for (var row = (currentBoard.length - 1); row >= 0; row--) {
		if (currentBoard[row][column] == 0) {
			currentBoard[row][column] = playerNumber;
			
			played = true;
			var canvas = $('canvas')[0];
			var context = canvas.getContext("2d");
			drawPlacedToken(context, column, row);
			// if (checkWin(row, column)) {
			// 	// do something
			// }
			// if (checkTie()) {
			// 	// do something
			// }

			currentPlayerTurn = false;
			sendBoard(row, column);
			break;
		}
	}

	if (!played) {
		alert("Column " + parseInt(column + 1) + " is full!");
	}
}

function sendBoard(row, column) {

	var arguments = {};

	arguments['row'] = parseInt(row);
	arguments['column'] = parseInt(column);
	arguments['isFirst'] = isFirstPlayer.toString();

	var url = "sendBoard";
	$.post(url, arguments, function (data,textStatus,jqXHR){
			//$('#status').html(data);
		});
	return false;
}

// function checkWin(row, column) {
// 	var count = 0;

// 	var won = true;

// 	beginRow = Math.max(row - 3, 0);
// 	endRow = Math.min(row + 3, rowCount - 1);
// 	var scope = [];
// 	for (var i = beginRow; i <= endRow; i++) {
// 		scope.push(currentBoard[i][column]);
// 	}
// 	if (checkSequence(scope)) {
// 		won = true;
// 	}

// 	beginCol = Math.max(column - 3, 0);
// 	endCol = Math.min(column + 3, columnCount - 1);
// 	scope = [];
// 	for (var i = beginCol; i <= endCol; i++) {
// 		scope.push(currentBoard[row][i]);
// 	}
// 	if (checkSequence(scope)) {
// 		won = true;
// 	}

// 	scope = [];
// 	for (var i = -3; i <= 3; i++) {
// 		r = row + i;
// 		c = column + i;
// 		if (r >= 0 && r < rowCount && c >= 0 && c < columnCount) {
// 			scope.push(currentBoard[r][c]);
// 		}
// 	}
// 	if (checkSequence(scope)) {
// 		won = true;
// 	}

// 	scope = [];
// 	for (var i = -3; i <= 3; i++) {
// 		r = row + (i * -1);
// 		c = column + i;
// 		if (r >= 0 && r < rowCount && c >= 0 && c < columnCount) {
// 			scope.push(currentBoard[r][c]);
// 		}
// 	}
// 	if (checkSequence(scope)) {
// 		won = true;
// 	}

// 	return won;

// }

// function checkSequence(scope) {
// 	var won = false;
// 	var count = 0;
// 	for (var i = 0; i < scope.length; i++) {
// 		if (scope[i] == playerNumber) {
// 			count++;
// 		} else {
// 			count = 0;
// 		}
// 		if (count >= 4) {
// 			alert("You win!");
// 			won = true;
// 			return won;
// 		}
// 	}
// 	return won;
// }

// function checkTie() {
// 	var tie = true;
// 	for (var i = 0; i < rowCount; i++) {
// 		for (var j = 0; j < columnCount; j++) {
// 			if (currentBoard[i][j] == 0) {
// 				// table not yet full
// 				tie = false;
// 			}
// 		}
// 	}
// 	return tie;
// }
