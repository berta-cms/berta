<?php

namespace App\Http\Controllers;
use SoapBox\Formatter\Formatter;

class StateController extends Controller
{
    public function getState() {
        $xml_str = file_get_contents('/srv/http/berta/storage/settings.xml');
        $formatter = Formatter::make($xml_str, Formatter::XML);
        $xml = $formatter->toArray();

        return response()->json($xml);
    }
}
