<?php

use Illuminate\Http\Request;

require __DIR__ . '/../_api_app/bootstrap/requirements_guard.php';
require_once __DIR__ . '/../_api_app/bootstrap/load_app.php';
(require_once __DIR__ . '/../_api_app/bootstrap/app.php')->handleRequest(Request::capture());
