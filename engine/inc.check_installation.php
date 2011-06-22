<?php

function ci_showError($errStr) {
	global $berta;
	if($berta->environment == 'engine' && ($berta->security->userLoggedIn || !AUTH_AUTHREQUIRED)) {
		$BERTA_ERROR = $errStr;
		include 'inc.berta_error.php';
	} else {
		echo '<!-- berta error -->';
	}
	exit;
}

if(!file_exists($options['XML_ROOT'])) {
	ci_showError("Berta's storage folder not found!");
	
} elseif(!is_writable($options['XML_ROOT'])) {
	ci_showError("Berta's storage folder is not writable!<br />Update permissions of folder <strong>storage</strong> with your FTP client.");

} else {
	$success = true;
	if(!file_exists($options['CACHE_ROOT'])) {
		$success &= @mkdir($options['CACHE_ROOT'], 0777);
		$success &= @chmod($options['CACHE_ROOT'], 0777);
	} else if(!is_writable($options['CACHE_ROOT'])) {
		$success &= @chmod($options['CACHE_ROOT'], 0777);
	}
	
	if(!file_exists($options['MEDIA_ROOT'])) {
		$success &= @mkdir($options['MEDIA_ROOT'], 0777);
		$success &= @chmod($options['MEDIA_ROOT'], 0777);
	} else if(!is_writable($options['MEDIA_ROOT'])) {
		$success &= @chmod($options['MEDIA_ROOT'], 0777);
	}
	
	if(!$success) {
		ci_showError('Error creating or making writable folders <strong>' . $options['CACHE_ABS_ROOT'] . '</strong> and <strong>' . $options['MEDIA_ABS_ROOT'] . '</strong>. You have to create them manually and set them writable. Use your FTP client for that.');
	
	} else {
		
		//if($berta->security->userLoggedIn) {
			if(file_exists($options['XML_ROOT'] . $options['sections.xml']) && !is_writable($options['XML_ROOT'] . $options['sections.xml'])) {
				ci_showError("File <strong>{$options['sections.xml']}</strong> in Berta's <strong>storage</strong> folder is not writable!<br />Make all XML files in <strong>storage</strong> folder writable with your FTP client.");
			
			} elseif(file_exists($options['XML_ROOT'] . $options['settings.xml']) && !is_writable($options['XML_ROOT'] . $options['settings.xml'])) {
				ci_showError("File <strong>{$options['settings.xml']}</strong> in Berta's <strong>storage</strong> folder is not writable!<br />Make all XML files in <strong>storage</strong> folder writable with your FTP client.");
			
			} elseif(file_exists($options['XML_ROOT'] . $options['tags.xml']) && !is_writable($options['XML_ROOT'] . $options['tags.xml'])) {
				ci_showError("File <strong>{$options['tags.xml']}</strong> in Berta's <strong>storage</strong> folder is not writable!<br />Make all XML files in <strong>storage</strong> folder writable with your FTP client.");
				
			} else {
				$sections = BertaContent::getSections();
				if($sections) {
					foreach($sections as $sName => $s) {
						if(!is_writable($options['XML_ROOT'] . str_replace('%', $sName, $options['blog.%.xml']))) {
							ci_showError("File <strong>" . str_replace('%', $sName, $options['blog.%.xml']) . "</strong> in Berta's <strong>storage</strong> folder is not writable!<br />Make all XML files in <strong>storage</strong> folder writable with your FTP client.");
							break;
						}
					}
				}
			}
		//}
	}
}


?>