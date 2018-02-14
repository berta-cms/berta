<?php

namespace App\Http\Controllers;

use App\SiteSettings;
use Illuminate\Http\Request;

class SettingsController extends Controller
{

    public function update(Request $request) {
        $json = $request->json()->all();
        $path_arr = explode('/', $json['path']);
        $site = $path_arr[0];
        $settings = new SiteSettings($site);
        $path_arr = array_slice($path_arr, 1);

        $res = $settings->saveValueByPath($json['path'], $json['value']);
        // @@@:TODO: Replace this with something sensible, when migration to redux is done
        // `real` returns the user input value
        // `update` returns formatted value for frontend special cases:
        // Tags - eliminate duplicates, divide tags with "/"
        // date input format
        // url prefix with "http://"
        $res['update'] = $res['value'];
        $res['real'] = $res['value'];
        // @@@:TODO:END

        return response()->json($res);
    }

}
