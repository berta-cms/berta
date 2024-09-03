<?php

use Illuminate\Http\Request;

require_once __DIR__ . '/../_api_app/bootstrap/load_app.php';
(require_once __DIR__ . '/../_api_app/bootstrap/app.php')->handleRequest(Request::capture());
