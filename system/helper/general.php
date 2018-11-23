<?php
function token($length = 32) {
	// Create random token
	$string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	$max = strlen($string) - 1;

	$token = '';

	for ($i = 0; $i < $length; $i++) {
		$token .= $string[mt_rand(0, $max)];
	}

	return $token;
}

/**
 * Backwards support for timing safe hash string comparisons
 *
 * http://php.net/manual/en/function.hash-equals.php
 */

if(!function_exists('hash_equals')) {
	function hash_equals($known_string, $user_string) {
		$known_string = (string)$known_string;
		$user_string = (string)$user_string;

		if(strlen($known_string) != strlen($user_string)) {
			return false;
		} else {
			$res = $known_string ^ $user_string;
			$ret = 0;

			for($i = strlen($res) - 1; $i >= 0; $i--) $ret |= ord($res[$i]);

			return !$ret;
		}
	}
}

/**
 *
 */

if (!function_exists('href_tel')) {
    function href_tel($tel) {
        return 'tel:' . preg_replace('/\(|\)|\s+|\-/', '', $tel);
    }
}

/**
 *
 */

if (!function_exists('random_password')) {
   function random_password($length = 8) {

      if ($length < 6) $length = 6;

      if(function_exists('random_bytes'))
         $password = random_bytes($length);

      elseif(function_exists('mcrypt_create_iv'))
         $password = mcrypt_create_iv($length, MCRYPT_DEV_URANDOM);

      else $password = openssl_random_pseudo_bytes($length);

      return bin2hex($password);
   }
}