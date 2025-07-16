<?php

// common hosting config file for all bertas
if (file_exists($ENGINE_ROOT_PATH . 'hosting')) {
    $hostingConfig = json_decode(file_get_contents($ENGINE_ROOT_PATH . 'hosting'), true);
}
$options['PLANS'] = isset($hostingConfig['plans']) ? $hostingConfig['plans'] : [];
$options['HOSTING_PROFILE'] = isset($hostingConfig['login']) ? $hostingConfig['login'] : false;
$options['FORGOTPASSWORD_LINK'] = isset($hostingConfig['forgotPassword']) ? $hostingConfig['forgotPassword'] : 'https://github.com/berta-cms/berta/wiki/Installation';
$options['INTERCOM_APP_ID'] = isset($hostingConfig['intercomAppId']) ? $hostingConfig['intercomAppId'] : false;
$options['INTERCOM_SECRET_KEY'] = isset($hostingConfig['intercomSecretKey']) ? $hostingConfig['intercomSecretKey'] : false;
$options['HELPCRUNCH_API_ORGANIZATION'] = isset($hostingConfig['helpcrunchApiOrganization']) ? $hostingConfig['helpcrunchApiOrganization'] : false;
$options['HELPCRUNCH_APP_ID'] = isset($hostingConfig['helpcrunchAppId']) ? $hostingConfig['helpcrunchAppId'] : false;
$options['HELPCRUNCH_API_KEY'] = isset($hostingConfig['helpcrunchApiKey']) ? $hostingConfig['helpcrunchApiKey'] : false;
$options['EMAIL_FROM_ADDRESS'] = isset($hostingConfig['emailFromAddress']) ? $hostingConfig['emailFromAddress'] : false;

// individual hosting config file for berta
if (file_exists($ENGINE_ROOT_PATH . 'hosting_config')) {
    $hostingConfigBerta = parse_ini_string(file_get_contents($ENGINE_ROOT_PATH . 'hosting_config'));
}
$options['NOINDEX'] = isset($hostingConfigBerta['noindex']) && ($hostingConfigBerta['noindex'] === $_SERVER['HTTP_HOST'] || 'www.' . $hostingConfigBerta['noindex'] === $_SERVER['HTTP_HOST']);
