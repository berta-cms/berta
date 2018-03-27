<?php

namespace App\Http\Controllers;

use App\Sites;
use Illuminate\Http\Request;

class SiteController extends Controller
{
    public function create(Request $request) {
        $sites = new Sites();
        $json = $request->json()->all();
        $cloneFrom = $json['site'] == -1 ? null : $json['site'];
        $site = $sites->create($cloneFrom);

        return response()->json($site);
    }

    public function update(Request $request) {
        $sites = new Sites();
        $json = $request->json()->all();

        $res = $sites->saveValueByPath($json['path'], $json['value']);
        // @@@:TODO: Replace this with something sensible, when migration to redux is done
        $res['update'] = $res['value'];
        $res['real'] = $res['value'];
        // @@@:TODO:END

        return response()->json($res, $res['status_code']);
    }

    public function delete($site) {
        $sites = new Sites();
        $res = $sites->delete($site);

        return response()->json($res);
    }

    public function order(Request $request) {
        $sites = new Sites();
        $json = $request->json()->all();
        $sites->order($json);
        return response()->json($json);
    }
}
