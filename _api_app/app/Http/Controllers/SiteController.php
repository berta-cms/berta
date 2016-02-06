<?php

namespace App\Http\Controllers;

use App\Sites;
use Illuminate\Http\Request;

class SiteController extends Controller
{
    public function createSite(Request $request) {
        $sites = new Sites();
        $json = $request->json()->all();
        $cloneFrom = $json['site'] == -1 ? null : $json['site'];
        $site = $sites->createSite($cloneFrom);


        return response()->json($site);
    }

    public function updateSite(Request $request) {
        $sites = new Sites();
        $json = $request->json()->all();

        $res = $sites->saveValueByPath($json['path'], $json['value']);
        $json['update'] = $res['value'];
        $json['real'] = $res['value'];

        if (array_key_exists('error_message', $res)) {
            $json['error_message'] = $res['error_message'];
        }

        return response()->json($json);
    }

    public function deleteSite($site) {
        $sites = new Sites();
        $json = array();
        $json['name'] = $site;

        $res = $sites->deleteSite($site);

        return response()->json($res);
    }

    public function orderSites(Request $request) {
        $sites = new Sites();
        $json = $request->json()->all();
        $sites->orderSites($json);
        return response()->json($json);
    }
}
