<?php

class Account extends CI_Controller {
     
    function __construct() {
    		// Call the Controller constructor
	    	parent::__construct();
	    	session_start();
    }
        
    public function _remap($method, $params = array()) {
	    	// enforce access control to protected functions	

    		$protected = array('updatePasswordForm','updatePassword','index','logout');
    		
    		if (in_array($method,$protected) && !isset($_SESSION['user']))
   			redirect('account/loginForm', 'refresh'); //Then we redirect to the index page again
 	    	
	    	return call_user_func_array(array($this, $method), $params);
    }
          
    
    function loginForm() {
        $data['title'] = 'Connect4 Login';
        $data['main'] = 'account/loginForm.php';
        $this->load->view('utils/template.php',$data);
    }
    
    function login() {
    		$this->load->library('form_validation');
    		$this->form_validation->set_rules('username', 'Username', 'required');
    		$this->form_validation->set_rules('password', 'Password', 'required');

    		if ($this->form_validation->run() == FALSE)
    		{
    			$this->loginForm();
    		}
    		else
    		{
    			$login = $this->input->post('username');
    			$clearPassword = $this->input->post('password');
    			 
    			$this->load->model('user_model');
    		
    			$user = $this->user_model->get($login);
    			 
    			if (isset($user) && $user->comparePassword($clearPassword)) {

    				$_SESSION['user'] = $user;
    				$data['user']=$user;
    				
    				$this->user_model->updateStatus($user->id, User::AVAILABLE);
    				
    				redirect('arcade/index', 'refresh'); //redirect to the main application page
    				
    			} else {   			
					$data['errorMsg']='Incorrect username or password!';
					$data['title'] = 'Connect4 Login';
	        		$data['main'] = 'account/loginForm.php';
	        		$this->load->view('utils/template.php',$data);
	 			}
    		}
    }

    function logout() {
		$user = $_SESSION['user'];
    		$this->load->model('user_model');
	    	$this->user_model->updateStatus($user->id, User::OFFLINE);
    		session_destroy();
    		redirect('account/index', 'refresh'); //Then we redirect to the index page again
    }

    function newForm() {
    	$data['title'] = 'Connect4 New Account';
        $data['main'] = 'account/newForm.php';
        $this->load->view('utils/template.php',$data);
    }
    
    function createNew() {
    		$this->load->library('form_validation');
    	    $this->form_validation->set_rules('username', 'Username', 'required|is_unique[user.login]');
	    	$this->form_validation->set_rules('password', 'Password', 'required');
	    	$this->form_validation->set_rules('first', 'First', 'required');
	    	$this->form_validation->set_rules('last', 'Last', 'required');
	    	$this->form_validation->set_rules('email', 'Email', 'required|is_unique[user.email]');
	    	
	    
	    	if (!($this->form_validation->run())) {
	    		$data['title'] = 'Connect4 New Account';
        		$data['main'] = 'account/newForm.php';
        		$this->load->view('utils/template.php',$data);
	    	} else {

   				include_once $_SERVER['DOCUMENT_ROOT'] . '/connect4/securimage/securimage.php';
				$securimage = new Securimage();
				if ($securimage->check($_POST['captcha_code']) == false) {
					$data['errorMsg']='Your input does not match the image.';
					$data['title'] = 'Connect4 New Account';
        			$data['main'] = 'account/newForm.php';
        			$this->load->view('utils/template.php',$data);

				} else {
		    		$user = new User();
		    		 
		    		$user->login = $this->input->post('username');
		    		$user->first = $this->input->post('first');
		    		$user->last = $this->input->post('last');
		    		$clearPassword = $this->input->post('password');
		    		$user->encryptPassword($clearPassword);
		    		$user->email = $this->input->post('email');
		    		
		    		$this->load->model('user_model');
		    		 
		    		
		    		$error = $this->user_model->insert($user);
		    		
		    		$data['title'] = 'Connect4 Login';
        			$data['main'] = 'account/loginForm.php';
        			$this->load->view('utils/template.php',$data);
		    	}
	    	}
    }

    
    function updatePasswordForm() {
    	$data['title'] = 'Connect4 Update Password';
	    $data['main'] = 'account/updatePasswordForm.php';
	    $this->load->view('utils/template.php',$data);
    }
    
    function updatePassword() {
	    	$this->load->library('form_validation');
	    	$this->form_validation->set_rules('oldPassword', 'Old Password', 'required');
	    	$this->form_validation->set_rules('newPassword', 'New Password', 'required');
	    	 
	    	 
	    	if ($this->form_validation->run() == FALSE)
	    	{
	    		$this->updatePasswordForm();
	    	}
	    	else
	    	{
	    		$user = $_SESSION['user'];
	    		
	    		$oldPassword = $this->input->post('oldPassword');
	    		$newPassword = $this->input->post('newPassword');
	    		 
	    		if ($user->comparePassword($oldPassword)) {
	    			$user->encryptPassword($newPassword);
	    			$this->load->model('user_model');
	    			$this->user_model->updatePassword($user);
	    			redirect('arcade/index', 'refresh'); //Then we redirect to the index page again
	    		}
	    		else {
	    			$data['errorMsg']="Incorrect password!";
	    			$data['title'] = 'Connect4 Update Password';
				    $data['main'] = 'account/updatePasswordForm.php';
				    $this->load->view('utils/template.php',$data);
	    		}
	    	}
    }
    
    function recoverPasswordForm() {
    	$data['title'] = 'Connect4 Recover Password';
	    $data['main'] = 'account/recoverPasswordForm.php';
	    $this->load->view('utils/template.php',$data);
    }
    
    function recoverPassword() {
	    	$this->load->library('form_validation');
	    	$this->form_validation->set_rules('email', 'email', 'required');
	    	
	    	if ($this->form_validation->run() == FALSE)
	    	{
	    		$this->recoverPasswordForm();
	    	}
	    	else
	    	{ 
	    		$email = $this->input->post('email');
	    		$this->load->model('user_model');
	    		$user = $this->user_model->getFromEmail($email);

	    		if (isset($user)) {
	    			$newPassword = $user->initPassword();
	    			$this->user_model->updatePassword($user);
	    			
	    			$this->load->library('email');
	    		
	    			$config['protocol']    = 'smtp';
	    			$config['smtp_host']    = 'ssl://smtp.gmail.com';
	    			$config['smtp_port']    = '465';
	    			$config['smtp_timeout'] = '7';
	    			$config['smtp_user']    = 'your gmail user name';
	    			$config['smtp_pass']    = 'your gmail password';
	    			$config['charset']    = 'utf-8';
	    			$config['newline']    = "\r\n";
	    			$config['mailtype'] = 'text'; // or html
	    			$config['validation'] = TRUE; // bool whether to validate email or not
	    			
		    	  	$this->email->initialize($config);
	    			
	    			$this->email->from('csc309Login@cs.toronto.edu', 'Login App');
	    			$this->email->to($user->email);
	    			
	    			$this->email->subject('Password recovery');
	    			$this->email->message("Your new password is $newPassword");
	    			
	    			$result = $this->email->send();
	    			
	    			//$data['errorMsg'] = $this->email->print_debugger();	
	    			
	    			//$this->load->view('emailPage',$data);
	    			$data['title'] = 'Connect4 Email';
	    			$data['main'] = 'account/emailPage.php';
	    			$this->load->view('utils/template.php',$data);
	    			
	    		}
	    		else {
	    			$data['errorMsg']="No record exists for this email!";
	    			$data['title'] = 'Connect4 Recover Password';
				    $data['main'] = 'account/recoverPasswordForm.php';
				    $this->load->view('utils/template.php',$data);
	    		}
	    	}
    }    
 }

