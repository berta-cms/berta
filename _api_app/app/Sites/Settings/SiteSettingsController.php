<?php

namespace App\Sites\Settings;

use App\Http\Controllers\Controller;
use App\Sites\Settings\SiteSettingsDataService;
use Illuminate\Http\Request;

class SiteSettingsController extends Controller
{
    public function createChildren(Request $request)
    {
        $json = $request->json()->all();
        $path_arr = explode('/', $json['path']);
        $site = $path_arr[0];
        $settingsDataService = new SiteSettingsDataService($site);

        $newChildren = $settingsDataService->createChildren(
            $json['path'],
            $json['value']
        );

        return response()->json($newChildren);
    }

    public function update(Request $request)
    {
        $json = $request->json()->all();
        $path_arr = explode('/', $json['path']);
        $site = $path_arr[0];
        $settings = new SiteSettingsDataService($site);

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
