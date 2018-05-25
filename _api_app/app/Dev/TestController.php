<?php

namespace App\Dev;

use App\Http\Controllers\Controller;

use App\SiteTemplates\SiteTemplatesDataService;

use Illuminate\Contracts\Routing\ResponseFactory;

/**
 * @class TestController
 *
 * This class is created for the purpose of easy testing of data services while developing.
 * @todo: Replace this with automated testing
 */
class TestController extends Controller
{
    public function get()
    {
        return "THIS IS TEST!!!";
    }
}
