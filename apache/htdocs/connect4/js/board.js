var tokenColour;
var mousePosition;
var tokenRadius = 15;
var columnOffsetX = 25;
var columnWidth = 40;

var currentBoard;

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

	$("#board").mousemove(mouseMoved);
	$("#board").click(mouseClicked);

	var context = canvas.getContext("2d");
	context.fillStyle = '#2C3539';
	context.fillRect(0, 40, context.canvas.width, context.canvas.height);

	if (isFirst) {
		tokenColour = "red";
	} else {
		tokenColour = "yellow";
	}
	context.fillStyle = tokenColour;
	drawToken(context, context.canvas.width / 2, 15);

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
        mouseY = e.offsetY;
    } else if(e.layerX) {
        mouseX = e.layerX;
        mouseY = e.layerY;
    } else {
    	mouseX = 0;
    	mouseY = 0;
    }
    mousePosition = mouseX;

	// Not finding context????
	//var canvas = $('#boardCanvas');
	var canvas = $('canvas')[0];
	var context = canvas.getContext("2d");
	context.fillStyle = 'white';
	context.fillRect(0, 0, context.canvas.width, 40);
	context.fillStyle = tokenColour;
	drawToken(context, mouseX - context.canvas.width / 2 - tokenRadius, 15);

	$('#status').html('moved to ' + mouseX);
}

function mouseClicked(e) {
	if(e.offsetX) {
        mouseX = e.offsetX;
        mouseY = e.offsetY;
    // } else if(e.layerX) {
    //     mouseX = e.layerX;
    //     mouseY = e.layerY;
    } else {
    	mouseX = 0;
    	mouseY = 0;
    }

    mouseX = mousePosition;
    column = (mouseX - 160 - columnOffsetX) / columnWidth;
    $('#status').html('clicked at ' + parseInt(mouseX) + 'at column ' + parseInt(column));


}
