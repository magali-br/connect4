
<!DOCTYPE html>

<html>
	<head>
		<style>
			input {
				display: block;
			}
		</style>

	</head> 
<body>  
	<h1>Login</h1>
<?php 
	if (isset($errorMsg)) {
		echo "<p>" . $errorMsg . "</p>";
	}


	echo form_open('account/login');
	echo form_label('Username'); 
	echo form_error('username');
	echo form_input('username',set_value('username'),"required");
	echo form_label('Password'); 
	echo form_error('password');
	echo form_password('password','',"required");

	echo "<p><br>For security purposes, please input
		<br>the characters you see in the image below.</p>";
	echo "<img id='captcha' src='". base_url() . "securimage/securimage_show.php' alt='CAPTCHA Image' />";
	echo "<p/>";
	echo '<input type="text" name="captcha_code" size="10" maxlength="6" />
		<a href="#" 
		onclick="document.getElementById(\'captcha\').src = \''
					.base_url() . 'securimage/securimage_show.php?\' 
				+ Math.random(); return false">[ Different Image ]</a><p/><br>';
	echo form_submit('submit', 'Login');
	
	echo "<p>" . anchor('account/newForm','Create Account') . "</p>";

	echo "<p>" . anchor('account/recoverPasswordForm','Recover Password') . "</p>";
	
	
	echo form_close();
?>	
</body>

</html>

