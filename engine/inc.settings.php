<?php

/**
 * The site engine's settings: the definitions' default values, and the limits of the site's hosting plan.
 * The engine reads only the default values, so the definitions' texts stay untranslated here.
 */

use App\User\UserModel;

// The shop's licence: the engine's templates check the global $shopEnabled
if (is_file($SITE_ROOT_PATH . '_plugin_shop/initializer.php')) {
    require_once $SITE_ROOT_PATH . '_plugin_shop/initializer.php';
}

$hostingPlan = UserModel::hostingPlan();
$settingsDefinition = (require __DIR__ . '/inc.setting-definition.php')(bertaUntranslated(...), ! empty($shopEnabled), $hostingPlan);

// The basic hosting plan has no multisites
if ($hostingPlan === 1 || (isset($options['HOSTING_PROFILE']) && ! $options['HOSTING_PROFILE'])) {
    $options['MULTISITES'] = [];
    $options['MULTISITE'] = '';
}
