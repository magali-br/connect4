<?php

class Board extends CI_Controller {
     
    function __construct() {
    		// Call the Controller constructor
	    	parent::__construct();
	    	session_start();
        $this->numRows = 6;
        $this->numColumns = 7;
    } 
          
    public function _remap($method, $params = array()) {
	    	// enforce access control to protected functions	
    		
    		if (!isset($_SESSION['user']))
   			redirect('account/loginForm', 'refresh'); //Then we redirect to the index page again
 	    	
	    	return call_user_func_array(array($this, $method), $params);
    }
    
    
    function index() {
		$user = $_SESSION['user'];
		    	
    	$this->load->model('user_model');
    	$this->load->model('invite_model');
    	$this->load->model('match_model');
    	
    	$user = $this->user_model->get($user->login);

    	$invite = $this->invite_model->get($user->invite_id);
    	
    	if ($user->user_status_id == User::WAITING) {
    		$invite = $this->invite_model->get($user->invite_id);
    		$otherUser = $this->user_model->getFromId($invite->user2_id);
            $data['isFirst'] = true;
    	}
    	else if ($user->user_status_id == User::PLAYING) {
    		$match = $this->match_model->get($user->match_id);
    		if ($match->user1_id == $user->id) {
    			$otherUser = $this->user_model->getFromId($match->user2_id);
                $data['isFirst'] = true;
    		} else {
    			$otherUser = $this->user_model->getFromId($match->user1_id);
                $data['isFirst'] = false;
            }
    	}
    	
    	$data['user']=$user;
    	$data['otherUser']=$otherUser;
    	
    	switch($user->user_status_id) {
    		case User::PLAYING:	
    			$data['status'] = 'playing';
    			break;
    		case User::WAITING:
    			$data['status'] = 'waiting';
    			break;
    	}
    	$data['title'] = 'Connect4 Board';
	    $data['main'] = 'match/board.php';
	    $this->load->view('utils/template.php',$data);
    }

 	function postMsg() {
 		$this->load->library('form_validation');
 		$this->form_validation->set_rules('msg', 'Message', 'required');
 		
 		if ($this->form_validation->run() == TRUE) {
 			$this->load->model('user_model');
 			$this->load->model('match_model');

 			$user = $_SESSION['user'];
 			 
 			$user = $this->user_model->getExclusive($user->login);
 			if ($user->user_status_id != User::PLAYING) {	
				$errormsg="Not in PLAYING state";
 				goto error;
 			}
 			
 			$match = $this->match_model->get($user->match_id);			
 			
 			$msg = $this->input->post('msg');
 			
 			if ($match->user1_id == $user->id)  {
 				$msg = $match->u1_msg == ''? $msg :  $match->u1_msg . "\n" . $msg;
 				$this->match_model->updateMsgU1($match->id, $msg);
 			}
 			else {
 				$msg = $match->u2_msg == ''? $msg :  $match->u2_msg . "\n" . $msg;
 				$this->match_model->updateMsgU2($match->id, $msg);
 			}
 				
 			echo json_encode(array('status'=>'success'));
 			 
 			return;
 		}
		
 		$errormsg="Missing argument";
 		
		error:
			echo json_encode(array('status'=>'failure','message'=>$errormsg));
 	}
 
	function getMsg() {
 		$this->load->model('user_model');
 		$this->load->model('match_model');
 			
 		$user = $_SESSION['user'];
 		 
 		$user = $this->user_model->get($user->login);
 		if ($user->user_status_id != User::PLAYING) {	
 			$errormsg="Not in PLAYING state";
 			goto error;
 		}
 		// start transactional mode  
 		$this->db->trans_begin();
 			
 		$match = $this->match_model->getExclusive($user->match_id);			
 			
 		if ($match->user1_id == $user->id) {
			$msg = $match->u2_msg;
 			$this->match_model->updateMsgU2($match->id,"");
 		}
 		else {
 			$msg = $match->u1_msg;
 			$this->match_model->updateMsgU1($match->id,"");
 		}

 		if ($this->db->trans_status() === FALSE) {
 			$errormsg = "Transaction error";
 			goto transactionerror;
 		}
 		
 		// if all went well commit changes
 		$this->db->trans_commit();
 		
 		echo json_encode(array('status'=>'success','message'=>$msg));
		return;
		
		transactionerror:
		$this->db->trans_rollback();
		
		error:
		echo json_encode(array('status'=>'failure','message'=>$errormsg));
 	}

    function sendBoard() {

        $this->load->model('user_model');
        $this->load->model('match_model');

        $user = $_SESSION['user'];
         
        $user = $this->user_model->getExclusive($user->login);
        if ($user->user_status_id != User::PLAYING) {   
            $errormsg="Not in PLAYING state";
            goto error;
        }
        
        $match = $this->match_model->get($user->match_id);          
        

        $row = intval($this->input->post('row'));
        $column = intval($this->input->post('column'));
        $isFirst = $this->input->post('isFirst') === 'true';

        $serial_board_state = $match->board_state;
        $board_state = unserialize($serial_board_state);
        $board = $board_state['board'];

        $numRows = 6;
        $numColumns = 7;
        if (($row < $numRows) && ($row <= 0) 
            && ($column <= 0) && ($column <= $numColumns)
            && ($board[$row][$column] != 0)) {
                $errormsg=  "Invalid Move";
                goto error;
        }

        if ($isFirst != ($match->user1_id == $user->id)) {
            $errormsg=  "Invalid Move";
            goto error;
        }

        if ($isFirst) {
            $userNum = 1;
        } else {
            $userNum = 2;
        }
        $board[$row][$column] = $userNum;
        $board_state['board'] = $board;

        $win = $this->checkWin($board, $row, $column);
        if ($win == 1) {

            $this->match_model->updateStatus($match->id,Match::U1WIN);

        } else if ($win == 2) {

            $this->match_model->updateStatus($match->id,Match::U2WIN);

        } else if ($this->checkTie($board)) {

            $this->match_model->updateStatus($match->id,Match::TIE);

        } else {

            if ($board_state['firstPlayerTurn']) {
                $board_state['firstPlayerTurn'] = false;
            } else {
                $board_state['firstPlayerTurn'] = true;
            }
        }

        $serial_board = serialize($board_state);
        $this->match_model->updateBoard($match->id, $serial_board);
            
        echo json_encode(array('status'=>'success win: ' .strval($win)));
        //  echo json_encode(array('status'=>'success u1Val:  win: ' .strval($win)));
         
        return;
        
        
        $errormsg="Missing argument";
        
        error:
            echo json_encode(array('status'=>'failure','message'=>$errormsg));
    }

    function getBoard() {
        $this->load->model('user_model');
        $this->load->model('match_model');
            
        $user = $_SESSION['user'];
         
        $user = $this->user_model->get($user->login);
        if ($user->user_status_id != User::PLAYING) {   
            $errormsg="Not in PLAYING state";
            goto error;
        }
        // start transactional mode  
        $this->db->trans_begin();
            
        $match = $this->match_model->getExclusive($user->match_id);

        if ($match->user1_id == $user->id) {
            $isFirst = true;
        } else {
            $isFirst = false;
        }
            
        $serial_board_state = $match->board_state;
        $board_state = unserialize($serial_board_state);
        $board = $board_state['board'];
        $firstPlayerTurn = $board_state['firstPlayerTurn'];


        if ($this->db->trans_status() === FALSE) {
            $errormsg = "Transaction error";
            goto transactionerror;
        }
        
        // If all went well, commit changes
        $this->db->trans_commit();

        $match_status = $match->match_status_id;
        
        echo json_encode(array('status'=>'success','board'=>$board, 
                            'isFirst'=>$isFirst, 'firstPlayerTurn'=>$firstPlayerTurn,
                            'matchStatus'=>$match_status));
        return;
        
        transactionerror:
        $this->db->trans_rollback();
        
        error:
        echo json_encode(array('status'=>'failure','msg'=>$errormsg));
    }


    function checkWin($currentBoard, $row, $column) {
        $count = 0;

        $won = false;

        $beginRow = max($row - 3, 0);
        $endRow = min($row + 3, $this->numRows - 1);

        $scope = array();
        for ($i = $beginRow; $i <= $endRow; $i++) {
            array_push($scope, $currentBoard[$i][$column]);
        }
        if ($this->checkSequence($scope)) {
            $won = true;
        }

        $beginCol = max($column - 3, 0);
        $endCol = min($column + 3, $this->numColumns - 1);
        $scope = array();
        for ($i = $beginCol; $i <= $endCol; $i++) {
            array_push($scope, $currentBoard[$row][$i]);
        }
        if ($this->checkSequence($scope)) {
            $won = true;
        }

        $scope = array();
        for ($i = -3; $i <= 3; $i++) {
            $r = $row + $i;
            $c = $column + $i;
            if (($r >= 0) && ($r < $this->numRows) 
                && ($c >= 0) && ($c < $this->numColumns)) {
                array_push($scope, $currentBoard[$r][$c]);
            }
        }
        if ($this->checkSequence($scope)) {
            $won = true;
        }

        $scope = array();
        for ($i = -3; $i <= 3; $i++) {
            $r = $row + ($i * -1);
            $c = $column + $i;
            if ($r >= 0 && $r < $this->numRows && $c >= 0 && $c < $this->numColumns) {
                array_push($scope, $currentBoard[$r][$c]);
            }
        }
        if ($this->checkSequence($scope)) {
            $won = true;
        }

        return $won;

    }

    function checkSequence($scope) {
        $countOne = 0;
        $countTwo = 0;
        for ($i = 0; $i < sizeof($scope); $i++) {
            if ($scope[$i] == 1) {
                $countOne++;
                $countTwo = 0;
            } else if ($scope[$i] == 2) {
                $countTwo++;
                $countOne = 0;
            }
            if ($countOne >= 4) {
                return 1;
            } else if ($countTwo >= 4) {
                return 2;
            }
        }
        return 0;
    }

    function checkTie($currentBoard) {
        $tie = true;
        for ($i = 0; $i < $this->numRows; $i++) {
            for ($j = 0; $j < $this->numColumns; $j++) {
                if ($currentBoard[$i][$j] == 0) {
                    // table not yet full
                    $tie = false;
                }
            }
        }
        return $tie;
    }
 	
 }

