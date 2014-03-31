

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
		context.fillStyle = "red";
		drawToken(context, context.canvas.width / 2, 15);
	} else {
		context.fillStyle = "yellow";
		drawToken(context, context.canvas.width / 2, 15);
	}

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
	context.arc(x, y, 15, 0, 2*Math.PI);
	context.fill();
}

function drawPlacedToken(context, x, y) {
	drawToken(context, x * 40 + 25, y * 40 + 25 + 40)
}

function mouseMoved(e) {
	var mouseX, mouseY;

    if(e.offsetX) {
        mouseX = e.offsetX;
        mouseY = e.offsetY;
    } else if(e.layerX) {
        mouseX = e.layerX;
        mouseY = e.layerY;
    }

	// Not finding context????
	var canvas = $('#boardCanvas');
	var canvas = $('canvas');
	var context = canvas.getContext("2d");
	context.fillStyle = 'blue';
	context.fillRect(0, 0, context.canvas.width, 40);
	context.fillStyle('red');
	drawToken(context, mouseX, 15);

	$('#status').html('moved to ');// + mouseX);
}

function mouseClicked(e) {
	if(e.offsetX) {
        mouseX = e.offsetX;
        mouseY = e.offsetY;
    } else if(e.layerX) {
        mouseX = e.layerX;
        mouseY = e.layerY;
    }
    $('#status').html('clicked at ');// + parseInt(mouseX));
}
