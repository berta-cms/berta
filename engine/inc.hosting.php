<?php
// common hosting config file for all bertas
if (file_exists($ENGINE_ROOT . 'hosting')) {
    $hostingConfig = parse_ini_string(file_get_contents($ENGINE_ROOT . 'hosting'));
}
$options['HOSTING_PROFILE'] = isset($hostingConfig['login']) ? $hostingConfig['login'] : false;
$options['FORGOTPASSWORD_LINK'] = isset($hostingConfig['forgotPassword']) ? $hostingConfig['forgotPassword'] : 'http://support.berta.me/kb/login-name-and-password/forgot-my-password-for-self-hosted-berta';
$options['INTERCOM_APP_ID'] = isset($hostingConfig['intercomAppId']) ? $hostingConfig['intercomAppId'] : false;
$options['INTERCOM_SECRET_KEY'] = isset($hostingConfig['intercomSecretKey']) ? $hostingConfig['intercomSecretKey'] : false;

//individual hosting config file for berta
if (file_exists($ENGINE_ROOT . 'hosting_config')) {
    $hostingConfigBerta = parse_ini_string(file_get_contents($ENGINE_ROOT . 'hosting_config'));
}
$options['NOINDEX'] = isset($hostingConfigBerta['noindex']) && ($hostingConfigBerta['noindex'] === $_SERVER['HTTP_HOST'] || 'www.' . $hostingConfigBerta['noindex'] === $_SERVER['HTTP_HOST']);
