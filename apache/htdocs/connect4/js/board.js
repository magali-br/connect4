

function drawBoard(board) {
	var canvas = document.createElement("canvas");
	canvas.setAttribute("id", "canvas");

	canvas.setAttribute("width", 768);
	canvas.setAttribute("height", 576);
	canvas.setAttribute("tabindex", 1);
	$("#board").append(canvas);


	var context = canvas.getContext("2d");

	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[i].length; j++) {
			if (board[i][j] == 1) {
				context.fillStyle = "red";
				context.fillRect(j * 30, i * 30, 10, 10);
			} else if (board[i][j] == 2) {
				
				context.fillStyle = "yellow";

				context.fillRect(j * 30, i * 30, 10, 10);
			} else if (board[i][j] == 0) {
				
				context.fillStyle = "blue";

				context.fillRect(j * 30, i * 30, 10, 10);
			}
		}
	}

	// var canvas = $("#canvas");

	// context.fillStyle = "red";
	// context.fillRect(30, 30, 32, 39);

	$('#status').html('TOOK OVER ');
} 