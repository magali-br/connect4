var tokenColour;
var playerNumber;
var mousePosition;
var tokenRadius = 15;
var columnOffsetX = 25;
var columnWidth = 40;

var columnCount = 7;
var rowCount = 6;

var currentBoard;
var isFirstPlayer;

function drawBoard(board, isFirst) {
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

	var context = canvas.getContext("2d");
	context.fillStyle = '#2C3539';
	context.fillRect(0, 40, context.canvas.width, context.canvas.height);

	if (isFirst) {
		tokenColour = "red";
		playerNumber = 1;
	} else {
		tokenColour = "yellow";
		playerNumber = 2;
	}
	context.fillStyle = tokenColour;
	drawToken(context, context.canvas.width / 2, 15);

	isFirstPlayer = isFirst;
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

function drawToken(context, x, y) {
	context.beginPath();
	context.arc(x, y, tokenRadius, 0, 2 * Math.PI);
	context.fill();
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

	$('#status').html('moved to ' + mousePosition);
}

function mouseClicked(e) {
	// if(e.offsetX) {
 //        mouseX = e.offsetX;
 //        mouseY = e.offsetY;
 //    // } else if(e.layerX) {
 //    //     mouseX = e.layerX;
 //    //     mouseY = e.layerY;
 //    } else {
 //    	mouseX = 0;
 //    	mouseY = 0;
 //    }
	var canvas = $('canvas')[0];
	var context = canvas.getContext("2d");
    mouseX = mousePosition;

    column = mouseX / (context.canvas.width / columnCount);
    $('#status').html('clicked at ' + parseFloat(mouseX) + 'at column ' + parseFloat(Math.floor(column)));
    playInColumn(Math.floor(column));

}

function playInColumn(column) {
	var played = false;

	for (var row = (currentBoard.length - 1); row >= 0; row--) {
		$('#status').html("row + " + row);
		if (currentBoard[row][column] == 0) {
			currentBoard[row][column] = playerNumber;
			
			played = true;
			var canvas = $('canvas')[0];
			var context = canvas.getContext("2d");
			drawPlacedToken(context, column, row);
			checkWin(row, column);
			break;
		}
	}

	if (!played) {
		alert("Column " + parseInt(column + 1) + " is full!");
	}
}

function checkWin(row, column) {
	count = 0;
	// for (var i = 0; i < board.length; i++) {
	// 	for (var j = 0; j < board[i].length; j++) {

	// 	}
	// }
	begin = Math.max(row - 3, 0);
	end = Math.min(row + 3, rowCount - 1);
	var scope = [];
	for (var i = begin; i <= end; i++) {
		scope.push(currentBoard[i][column]);
	}
	var won = checkSequence(scope);

	if (won) {
		// do something
		return won;
	}

	scope = [];
	for (var i = begin; i <= end; i++) {
		scope.push(currentBoard[i][column]);
	}
	checkSequence(scope);

}

function checkSequence(scope) {
	var won = false;
	var count = 0;
	for (var i = 0; i < scope.length; i++) {
		if (scope[i] == playerNumber) {
			count++;
		} else {
			count = 0;
		}
		if (count >= 4) {
			alert("You win!");
			won = true;
			return won;
		}
	}
	return won;
}
