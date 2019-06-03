<?php

namespace App\Sites\Settings;

use Illuminate\Http\Request;

use App\Shared\Helpers;
use App\Http\Controllers\Controller;
use App\Sites\Settings\SiteSettingsDataService;

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

    public function deleteChildren(Request $request)
    {
        $json = $request->json()->all();
        $path_arr = explode('/', $json['path']);
        $site = $path_arr[0];
        $settingsDataService = new SiteSettingsDataService($site);
        $res = $settingsDataService->deleteChildren(
            $json['path'],
            $json['value']
        );

        return response()->json($res);
    }

    public function update(Request $request)
    {
        $json = $request->json()->all();
        $path_arr = explode('/', $json['path']);
        $site = $path_arr[0];
        $settingsDataService = new SiteSettingsDataService($site);

        $res = $settingsDataService->saveValueByPath($json['path'], $json['value']);
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

    public function upload(Request $request) {
        $data = $request->all();
        $path_arr = explode('/', $data['path']);
        $site = $path_arr[0];
        $settingsDataService = new SiteSettingsDataService($site);
        $res = $settingsDataService->uploadFileByPath($data);

        if (isset($res['error'])) {
            return Helpers::api_response($res['error'], (object)[], $res['status']);
        }

        $res['update'] = $res['value'];
        $res['real'] = $res['value'];

        return response()->json($res);
    }
}
