<?

$conf_file=$ENGINE_ROOT.'config/inc.conf.php';

if ($options['AUTH_password']!=$decoded['old_password']){
	$returnError='Current password doesn\'t match!';
}elseif ($decoded['new_password']!=$decoded['retype_password']){
	$returnError='New and retyped password doesn\'t match!';
}elseif (strlen($decoded['new_password'])<6){	
	$returnError='Password must be at least 6 characters long!';
}elseif (!preg_match('/^[A-Za-z0-9]+$/', $decoded['new_password'])){	
	$returnError='Password must contain only alphanumeric characters!';
}elseif (!is_writable($conf_file)){
	$returnError='Config file is not writable!';
}else{
	//every thing is correct, now change the password
    $content=file_get_contents($conf_file);
    $new_content=str_replace(
        "\$options['AUTH_password'] = '".$decoded['old_password']."'",
        "\$options['AUTH_password'] = '".$decoded['new_password']."'",
        $content
    );

    $fp = fopen($conf_file, 'w');
    fwrite($fp, $new_content);
    fclose($fp);
}

?>