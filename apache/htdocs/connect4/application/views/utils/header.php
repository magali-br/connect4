
<?php

	// echo "<a href='" . base_url() . "candystore/storefront'>
	// 		<img src='" . base_url() . "images/icons/CandyStoreFont.png'/></a>";

    $loggedIn = false;
	if (isset($_SESSION["loggedIn"]) && $_SESSION["loggedIn"]) {
		$loggedIn = true;
		if (isset($_SESSION["first"])) {
            $first = $_SESSION["first"];
        } else {
            $first = "friend";
        }
    } 

    if (!$loggedIn) {


	} else {


	}


?>