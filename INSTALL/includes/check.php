<?

if(empty($CHECK_INCLUDED)) {
	$SITE_ROOT = '../../';
	$ENGINE_ROOT = '../../engine/';
	define('AUTH_AUTHREQUIRED', true);
	define('SETTINGS_INSTALLREQUIRED', false);
	include $ENGINE_ROOT . 'inc.page.php';
}



if(empty($settings['berta']['installed'])) {

	function getStatus($isOk, $message, $failDesc = '', $isIndented = false, $isFatal = true) {
		return '<li' . ($isIndented ? ' class="indented"' : '') . '><div class="status xVisualStatus' . ($isOk ? 'OK' : ($isFatal ? 'Fail' : 'Warning')) . '">' . ($isOk ? 'YES' : 'NO') . '</div>' . $message . 
		       (!$isOk && $failDesc ? ('<div class="infoFail">' . $failDesc . '</div>') : '') . 
			   '</li>';
	}

	$listOk = true;
	$listHasErrors = false;

	$testOutput = '<ul id="xFirstTimeCheckList">';
	$testOutput .= '<p><strong>Is your website hosted on a suitable server?</strong></p>';

	// php version ...
	$isOk = floatval(phpversion()) >= 5;
	$listOk &= $isOk; $listHasErrors |= !$isOk;
	$testOutput .= getStatus($isOk, 'Server supports PHP 5', 'Berta cannot function without PHP 5. Ask your server administrator to enable PHP 5');

	// multibyte ...
	$isOk = function_exists('mb_ereg_replace') && function_exists('mb_strlen') && function_exists('mb_substr');
	$listOk &= $isOk; $listHasErrors |= !$isOk;
	$testOutput .= getStatus($isOk, 'Server supports international characters', 'Berta cannot function properly without unicode text support. Please ask your server administrator for PHP Multibyte support.');

	// GD ...
	$gdInfo = function_exists('gd_info') ? gd_info() : false;
	$isOk = (bool) $gdInfo;
	$listOk &= $isOk; $listHasErrors |= !$isOk;
	$testOutput .= getStatus($isOk, 'PHP Graphics library installed', 'Berta won\'t be able to resize and make thumbnails for images you will upload. Ask your server administrator for PHP GD support.');

	// GD formats ...
	if($gdInfo) {
		$gdInfo['JPEG Support'] = isset($gdInfo['JPEG Support']) ? $gdInfo['JPEG Support'] : (isset($gdInfo['JPG Support']) ? $gdInfo['JPG Support'] : false);
		$listOk &= $gdInfo['JPEG Support'];
		$listHasErrors |= (!$gdInfo['GIF Read Support'] || !$gdInfo['JPEG Support'] || !$gdInfo['PNG Support']);
		$testOutput .= getStatus($gdInfo['GIF Read Support'], 'GIF read support', 'You won\'t be able to upload GIF images for your website', true, false);	
		$testOutput .= getStatus($gdInfo['JPEG Support'], 'JPEG support', 'You won\'t be able to upload JPEG images for your website. Berta won\'t be able to make thumbnails for your images... bad! Ask your server administrator for JPEG support.', true);	
		$testOutput .= getStatus($gdInfo['PNG Support'], 'PNG support', 'You won\'t be able to upload PNG images for your website', true, false);	
	}

	// upload sizes ...
	$isOk = floatval(ini_get('upload_max_filesize')) >= 256 && floatval(ini_get('post_max_size')) >= 256;
	/*$listOk &= $isOk;*/ $listHasErrors |= !$isOk;
	$testOutput .= getStatus($isOk, 'Large file uploads (for videos) allowed', 
			'Your server runs PHP in CGI mode, which doesn\'t allow tweaking PHP options in .htaccess files. Please tell this to your server administrator and ask for bigger file uploads (over 200Mb for larger videos).', false, false);


	$testOutput .= '<p><br /><strong>Have you installed your website properly?</strong></p>';

	// storage writable ...
	$isOk = file_exists($SITE_ROOT . 'storage') && is_writable($SITE_ROOT . 'storage');
	$listOk &= $isOk; $listHasErrors |= !$isOk;
	$testOutput .= getStatus($isOk, 'Storage folder exists and is writable', 'Please make sure the folder called "storage" in your Berta installation exists and is writable. Check step (3) in the installing instructions (located in the INSTALL folder) for details.');
	
	$testOutput .= '</ul>';
	$testOutput .= '<p>A green <span class="xVisualStatusOK">YES</span> means that you don\'t even need to read what it is about - it\'s just all fine. A yellow <span class="xVisualStatusWarning">NO</span> means that ' . 
		'Berta will still work, but the feature will not be available to you. The red <span class="xVisualStatusFail">NO</span> is the bad one - if there is one, it will have a suggestion ' . 
		'what can be done to correct the situation.</p>';



	// if the test was ok without any warnings then redirect to the next step
	if($listOk && !$listHasErrors) {
		header('Location: .?_berta_install_step=2');
		exit;
	}
}



?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title><? echo $berta->settings->get('texts', 'pageTitle') ?> / welcome</title>
<link href="<? echo $ENGINE_ABS_ROOT ?>css/default.css" rel="stylesheet" type="text/css" />
<link href="<? echo $ENGINE_ABS_ROOT ?>css/login.css" rel="stylesheet" type="text/css" />
<link href="<? echo $ENGINE_ABS_ROOT ?>css/editor.css.php" rel="stylesheet" type="text/css" />
</head><?

if(!empty($settings['berta']['installed'])) {
	?><body class="xLoginPageBody">
		<div class="xMAlign-container xPanel">
			<div class="xMAlign-outer">
				<div class="xMAlign-inner">
					<p>Berta is already installed.<br />Please delete folder named <strong><code>INSTALL</code></strong> in your Berta's root folder! <br />&nbsp;<br /><input type="button" value="  OK  " onclick="window.location='<? echo $SITE_ABS_ROOT ?>';"></p>
				</div>
			</div>
		</div>
	</body><?

} else {
	
	?><body class="xLoginPageBody">
		<div class="xMAlign-container xPanel">
			<div class="xMAlign-outer">
				<div class="xMAlign-inner justify">
					<?
					
					if($listOk) {
						$bottomNote = '<p class="xBottomNote">Note: This check-list is displayed only once. To re-enable it you will need to manually edit settings.xml file in your storage folder and delete the row that looks like <strong><code>' . htmlspecialchars('<installed><![CDATA[1]]></installed>') . '</code></strong>.</p>';
						
						if(!$listHasErrors) {
							
							// normally this is not visible because of a redirect earlier...
							
							echo '<div id="xFirstTimeCheckResult">';
							echo '<h2>Welcome!</h2>';
							echo '<p class="emphasis">Berta has completed a small test to see if it has everything it needs. It turns out that everything is just perfect.</p>';
							echo '<p><input type="button" value=" Start building your site! " id="xFirstTimeCheckContinue" onclick="window.location=\'' . $ENGINE_ABS_ROOT . '?_berta_install_step=2\'" /></p>';
							echo '<br class="clear" /></div>';
							
							echo '<p>Test results:</p>';
							echo $testOutput;
							echo $bottomNote;
							
						} else {
							
							// some warnings...
							
							echo '<div id="xFirstTimeCheckResult">';
							echo '<h2>Welcome...</h2>';
							echo '<p class="emphasis">Berta has completed a small test to see if it has everything it needs.</p>';
							echo '<p class="emphasis">It appears that there are some issues with the server or the installation. You will be able to use Berta, although with limited functionality. Please take a look at the results below.</p>';
							echo '</div>';
							
							echo $testOutput;
							
							echo '<p><br />If you like to, you can ignore the errors and: <input type="button" value=" Start with Berta! " class="xCheckListContinue" onclick="window.location=\'' . $ENGINE_ABS_ROOT . '?_berta_install_step=2\'" /></p>';
							
							echo $bottomNote;
						}
						

					} else {
						
						// errors..
						
						echo '<div id="checkResult">';
						echo '<h2>Take action!</h2>';
						echo '<p class="emphasis">Berta has completed a small test to see if it has everything it needs.</p>';
						echo '<p class="emphasis">It turns out that there are some problems with the server or with the installation. Please take a look at the results below and follow the suggestions for each error, and then come back again! </p>';
						echo '</div>';
						
						echo $testOutput;
						
						echo '<p><input type="button" value=" Run the test again... " id="xFirstTimeCheckContinue" onclick="window.location.reload()" /></p>';

					}
					
					
					
					
					
				?></div>
			</div>
		</div>
	</body><?
	

}



?></html><?







?>