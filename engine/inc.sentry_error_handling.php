<?php

$file = $options['TEMPLATES_FULL_SERVER_PATH'] . '../../../includes/error_handler.php';
if ($options['HOSTING_PROFILE'] && file_exists($file)) {
  require_once $file;
}
