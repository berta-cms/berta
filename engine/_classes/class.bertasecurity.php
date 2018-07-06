<?php

/*
 ==================================================================================================================================

	CLASS BertaSecurity

	Manages security and ip-tracking operations:
		 (*) Log-in and log-out
		 (*) Session-based authentification
		 (*) Protected areas

 ==================================================================================================================================
*/

class BertaSecurity {

	const BERTASECURITY_ERROR_SESSION_VARIABLE = 1;		// session variable corrupt
	const BERTASECURITY_ERROR_SESSION_EXPIRED = 2;			// session expired
	const BERTASECURITY_ERROR_SESSION_IP_CONFLICT = 3;		// ip address has changed
	const BERTASECURITY_ERROR_LOGIN_VARIABLE = 4;			// login variables corrupt or empty
	const BERTASECURITY_ERROR_LOGIN_INCORRECT = 5;			// login user and password incorrect

	public $authExpiresSeconds;	// session idle time
	public $authUseAuthentification = false;

	public $authentificated = false; // if
	public $userLoggedIn = false;

	public $user;				// array of all user information available in the database (id, ident, nick, email, etc.)

	public $accessIP;				// array containing ip address by bytes
	public $accessIPStr = '';

	public $errAuth = 0;	// the reason (id), why autentification failed;
	public $errLogin = 0;	// the reason (id), why login failed;

	public function __construct($authEnvironment = 'site', $authExpiresSeconds = 21600) {
		$this->authExpiresSeconds = $authExpiresSeconds;
		$this->authUseAuthentification = true;

		$this->authentificated = $this->authUseAuthentification ? $this->authentificate() : true;


		// todo - change relying on userLoggedIn to a new environment variable
		if($authEnvironment == 'site') {
			$this->userLoggedIn = false;
		}
	}

	public function getAccessIP() {
		$this->accessIPStr = $_SERVER["REMOTE_ADDR"];
		if(preg_match("/(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})/", $this->accessIPStr, $ipRegs)) {
			$this->accessIP = array((int) $ipRegs[1],
									(int) $ipRegs[2],
									(int) $ipRegs[3],
									(int) $ipRegs[4]);
			return $this->accessIP;
		} else
			return false;
	}

	public function isLoggedIn($url, $key) {
		$ch = curl_init();
		$timeout = 30;
		curl_setopt($ch,CURLOPT_URL,$url);
		curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
		curl_setopt($ch,CURLOPT_CONNECTTIMEOUT,$timeout);
		curl_setopt($ch, CURLOPT_COOKIE, 'bertaHosting='.$key);
		$data = curl_exec($ch);
		curl_close($ch);
		$data = json_decode($data);
		return isset($data->isLoggedIn) && $data->isLoggedIn===true;
	}


	// ------------------------------------------------------------------------------------------------------------------------------
	// --    Login and authentification    ------------------------------------------------------------------------------------------
	// ------------------------------------------------------------------------------------------------------------------------------


	public function authentificate() {
		session_name(BertaUtils::canonizeString('berta_' . Berta::$options['version'] . '_' . Berta::$options['SITE_ROOT_URL'], '_', ''));
		session_start();
		$curTime = time();

		if(isset($_SESSION['_berta__user']) && is_array($_SESSION['_berta__user'])) {
			if(($curTime - $_SESSION['_berta__user']['last_access'] <= $this->authExpiresSeconds)) {
				if($_SESSION['_berta__user']['last_ip'] == $_SERVER['REMOTE_ADDR']) {

					$_SESSION['_berta__user']['last_access'] = $curTime;
					$this->user = $_SESSION['_berta__user'];
					$this->userLoggedIn = true;

					if(!empty($_REQUEST['_security_reload_user']))
						$this->updateUserSettings($this->user);

					return $this->userLoggedIn = true;

				} else {
					$this->destroy(self::BERTASECURITY_ERROR_SESSION_IP_CONFLICT); // ip conflict
					return $this->userLoggedIn = false;
				}
			} else {
				$this->destroy(self::BERTASECURITY_ERROR_SESSION_EXPIRED);
				return $this->userLoggedIn = false;
			}

		} elseif(isset($_SESSION['_berta__user']) && !is_array($_SESSION['_berta__user'])) {
			$this->destroy(self::BERTASECURITY_ERROR_SESSION_VARIABLE);
			return $this->userLoggedIn = false;

		} else {
			return $this->userLoggedIn = false;
		}
	}

	public function goToLoginPage($loginPageRelativeURL) {
		$qS = $this->errAuth ? "?autherror=" . $this->errAuth : "";
		if(headers_sent()) {
			echo '<script language="javascript" type="text/javascript">window.location="' . $loginPageRelativeURL . $qS . '";</script>';
			echo '<p>Please wait... (or <a href="' . $loginPageRelativeURL . $qS . '">click here</a> if nothing happens)</p>';
		} else
			header('Location: ' . $loginPageRelativeURL . $qS);

		exit;
	}

	public function login($name, $pass, $realName, $realPass) {
		if($name && $pass) {
			if($name == $realName && $pass == $realPass) {
				$this->destroy();
				session_start();
				$this->updateUserSettings(array('name' => $realName));

				//log login event
				BertaUtils::logEvent('login');

				return $this->userLoggedIn = true;

			} else {
				$this->errLogin = self::BERTASECURITY_ERROR_LOGIN_INCORRECT;	// wrong creditentials
				return false;
			}

		} else {
			$this->errLogin = self::BERTASECURITY_ERROR_LOGIN_VARIABLE;	// no identification supplied
			return false;
		}

	}

	public function destroy($authErrNo = false) {
		if(isset($_SESSION['_berta__user'])) unset($_SESSION['_berta__user']);
		@session_destroy();
		$this->user = array();

		return true;
	}

	public function updateUserSettings($user = false) {

		if(isset($user["last_access_sec"])) $this->user["prev_access"] = $user["last_access_sec"];
		if(isset($user["last_ip"])) $this->user["prev_ip"] = $user["last_ip"];
		$this->user = array_merge($user, array(
						  "user_name" => $user["name"] ? $user["name"] : $user['nickname'],
						  "login_time" => time(),
						  "last_access" => time(),
						  "last_ip" => $_SERVER['REMOTE_ADDR']));

		$_SESSION['_berta__user'] = $this->user;
	}


	// ------------------------------------------------------------------------------------------------------------------------------
	// --    Misc    ----------------------------------------------------------------------------------------------------------------
	// ------------------------------------------------------------------------------------------------------------------------------

	public function getError($errType, $errId) {
		switch($errType) {
			case "auth":
				switch($errId) {
					case self::BERTASECURITY_ERROR_SESSION_VARIABLE: return "Please check whether your browser supports cookies!";
					case self::BERTASECURITY_ERROR_SESSION_EXPIRED: return "The max idle time is " . round($this->authExpiresSeconds / 60) . " minutes.";
					case self::BERTASECURITY_ERROR_SESSION_IP_CONFLICT: return "Your IP address has changed... any idea why?";
					default: return "Unknown error (id: $errId).";
				}
			case "login":
				switch($errId) {
					case self::BERTASECURITY_ERROR_LOGIN_VARIABLE: return "Pardon?";
					case self::BERTASECURITY_ERROR_LOGIN_INCORRECT:
						$arr = array("Pardon?");
						return $arr[array_rand($arr)];
					case 8: return "You have been deactivated.";
					default: return "Unknown error ($errId)";
				}
		}
	}

	function dispNocacheHeaders() {
		if(!headers_sent()) {
			header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
			header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
			header("Cache-Control: no-store, no-cache, must-revalidate");
			header("Cache-Control: post-check=0, pre-check=0", false);
			header("Pragma: no-cache");
			return true;
		}
		return false;
	}

}
?>
