var tokenColour;
var playerNumber;
var mousePosition = -1;
var tokenRadius = 15;
var columnOffsetX = 25;
var columnWidth = 40;

var columnCount = 7;
var rowCount = 6;

var currentBoard;
var currentMatchStatus;
var isFirstPlayer;
var currentPlayerTurn;
var doNotUpdate = false;

var backgroundColour = '#D9D2C8';
var gridColour = '#0F2C6E';

function initializeBoard(isFirst) {
	if (!currentBoard && !$('canvas')[0]) {
		var canvas = document.createElement("canvas");
		canvas.setAttribute("id", "boardCanvas");

		canvas.setAttribute("width", 290);
		canvas.setAttribute("height", 290);
		canvas.setAttribute("tabindex", 1);

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
}

function drawGrid(board) {
	var canvas = $('canvas')[0];
	var context = canvas.getContext("2d");
	context.fillStyle = backgroundColour;
	context.fillRect(0, 0, context.canvas.width, context.canvas.height);

	context.fillStyle = gridColour;
	context.fillRect(0, 40, context.canvas.width, context.canvas.height);
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[i].length; j++) {
			if (board[i][j] == 1) {
				context.fillStyle = "red";
				drawPlacedToken(context, j, i);
				
			} else if (board[i][j] == 2) {
				
				context.fillStyle = "yellow";
				drawPlacedToken(context, j, i);
				
			} else if (board[i][j] == 0) {
				
				context.fillStyle = backgroundColour;
				drawPlacedToken(context, j, i);
			}
		}
	}

	context.fillStyle = tokenColour;
	if (mousePosition == -1) {
		drawToken(context, context.canvas.width / 2, 15);
	} else {
		drawToken(context, mousePosition - tokenRadius, 15);
	}
}

function drawBoard(board, isFirst, firstPlayerTurn, matchStatus) {
	if (!currentBoard) {
		initializeBoard(isFirst);
	}

	if (doNotUpdate) {
		return;
	}
	
	currentBoard = board;
	drawGrid(currentBoard);

	var msg = "";

	currentMatchStatus = matchStatus;
	if (matchStatus == 2) {
		if (isFirst) {
			msg = "You won!";
		} else {
			msg = otherUser + " won!";
		}
		endGame(msg);

	} else if (matchStatus == 3) {
		if (isFirst) {
			msg = otherUser + " won!";
		} else {
			msg = "You won!";
		}
		endGame(msg);

	} else if (matchStatus == 4) {
		msg = "Tie - game over!";
		endGame(msg);
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

	}

} 

function endGame(msg) {
		currentPlayerTurn = false;
		$('#turn').html(msg);
		$('#status').html("");

		alert(msg);
		window.location.href = window.location.origin + "/connect4/arcade/finishGame"; 
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
	context.fillStyle = backgroundColour;
	context.fillRect(0, 0, context.canvas.width, 40);
	context.fillStyle = tokenColour;
	drawToken(context, mousePosition - tokenRadius, 15);

}

function mouseClicked(e) {

	if (currentPlayerTurn) {
		var canvas = $('canvas')[0];
		var context = canvas.getContext("2d");
	    mouseX = mousePosition - tokenRadius;

	    var column = 6;
	    if ((0 <= mouseX) && (mouseX < columnWidth)) {
	    	column = 0;
	    } else if ((columnWidth <= mouseX) && (mouseX < columnWidth * 2)) {
	    	column = 1;
	    }else if ((columnWidth * 2 <= mouseX) && (mouseX < columnWidth * 3)) {
	    	column = 2;
	    }else if ((columnWidth * 3 <= mouseX) && (mouseX < columnWidth * 4)) {
	    	column = 3;
	    } else if ((columnWidth * 4 <= mouseX) && (mouseX < columnWidth * 5)) {
	    	column = 4;
	    } else if ((columnWidth * 5 <= mouseX) && (mouseX < columnWidth * 6)) {
	    	column = 5;
	    } else {
	    	column = 6;
	    }
	    playInColumn(column);
	}

}

function playInColumn(column) {
	var played = false;

	for (var row = (currentBoard.length - 1); row >= 0; row--) {
		if (currentBoard[row][column] == 0) {
			currentBoard[row][column] = playerNumber;
			drawBoard(currentBoard, isFirstPlayer, currentPlayerTurn, currentMatchStatus);
			
			played = true;
			var canvas = $('canvas')[0];
			var context = canvas.getContext("2d");
			drawPlacedToken(context, column, row);
			doNotUpdate = true;

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

			doNotUpdate = false;
		});
	return false;
}

