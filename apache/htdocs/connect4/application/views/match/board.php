
<!DOCTYPE html>

<html>
	<head>
	<script src="http://code.jquery.com/jquery-latest.js"></script>
	<script src="<?= base_url() ?>/js/jquery.timers.js"></script>
	<script src="<?= base_url() ?>/js/board.js"></script>
	<script>

		var otherUser = "<?= $otherUser->login ?>";
		var user = "<?= $user->login ?>";
		var isFirst = "<?= $isFirst ?>";
		var status = "<?= $status ?>";
		
		$(function(){

			$('body').everyTime(1000,function(){

					if (status == 'waiting') {
						$.getJSON('<?= base_url() ?>arcade/checkInvitation',function(data, text, jqZHR){
							if (data && data.status=='rejected') {
								alert("Sorry, your invitation to play was declined!");
								window.location.href = '<?= base_url() ?>arcade/index';
							}
							if (data && data.status=='accepted') {
								status = 'playing';
								$('#status').html('Playing ' + otherUser);
								initializeBoard(true);
							}
								
						});
					}

					var url = "<?= base_url() ?>board/getMsg";
					$.getJSON(url, function (data,text,jqXHR){
						if (data && data.status=='success') {
							var conversation = $('[name=conversation]').val();
							var msg = data.message;
							if (msg.length > 0)
								$('[name=conversation]').val(conversation + "\n" + otherUser + ": " + msg);
						}
					});

					var url = "<?= base_url() ?>board/getBoard";
					$.getJSON(url, function (data,text,jqXHR){
						if (data && data.status=='success') {
							var board = data.board;
							if (board) {
								drawBoard(board, data.isFirst, 
									data.firstPlayerTurn, data.matchStatus);
							}

						}
					});

			});

			$('form').submit(function(){
				var arguments = $(this).serialize();
				var url = "<?= base_url() ?>board/postMsg";
				$.post(url,arguments, function (data,textStatus,jqXHR){
						var conversation = $('[name=conversation]').val();
						var msg = $('[name=msg]').val();
						$('[name=conversation]').val(conversation + "\n" + user + ": " + msg);
						});
				return false;
				});	

		});
	
	</script>
	</head> 
<body>  
	<h1>Game Area</h1>

	<div>
	Hello <?= $user->fullName() ?>  <?= anchor('account/logout','(Logout)') ?>  
	</div>
	
	<div id='status'> 
	<?php 
		if ($status == "playing")
			echo "Playing " . $otherUser->login;
		else if ($status == "waiting")
			echo "Waiting on " . $otherUser->login;
	?>
	</div>

	<div id='turn'>
	</div>

	<div id='board'>
	</div>
	
<?php 
	
	echo form_textarea('conversation', set_value('conversation') ? set_value('conversation') : "", 
		'readonly');
	
	echo form_open();
	echo form_input('msg');
	echo form_submit('Send','Send');
	echo form_close();
	
?>
	
	
	
	
</body>

</html>

