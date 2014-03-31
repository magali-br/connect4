

function drawBoard(board) {
	var canvas = document.createElement("canvas");
	canvas.setAttribute("id", "canvas");

	canvas.setAttribute("width", 290);
	canvas.setAttribute("height", 250);
	canvas.setAttribute("tabindex", 1);
	$("#board").append(canvas);


	var context = canvas.getContext("2d");
	context.fillStyle = '#2C3539';
	context.fillRect(0, 0, context.canvas.width, context.canvas.height);


	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[i].length; j++) {
			if (board[i][j] == 1) {
				context.fillStyle = "red";
				drawToken(context, j, i);
				
			} else if (board[i][j] == 2) {
				
				context.fillStyle = "yellow";
				drawToken(context, j, i);
				
			} else if (board[i][j] == 0) {
				
				context.fillStyle = "white";
				drawToken(context, j, i);
				//context.fillRect(j * 30, i * 30, 10, 10);
			}
		}
	}

	// var canvas = $("#canvas");

	// context.fillStyle = "red";
	// context.fillRect(30, 30, 32, 39);

	// $('#status').html('TOOK OVER ');
} 

function drawToken(context, x, y) {
	context.beginPath();
	context.arc(x * 40 + 25, y * 40 + 25, 15, 0, 2*Math.PI);
	context.fill();
}
