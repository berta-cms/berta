<?php

namespace App\Sites\TemplateSettings;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Sites\TemplateSettings\SiteTemplateSettingsDataService;

class SiteTemplateSettingsController extends Controller
{

    public function update(Request $request) {
        $json = $request->json()->all();
        $path_arr = explode('/', $json['path']);
        $site = $path_arr[0];
        $template = $path_arr[2];
        $templateSettingsDataService = new SiteTemplateSettingsDataService($site, $template);

        $res = $templateSettingsDataService->saveValueByPath($json['path'], $json['value']);
        // @@@:TODO: Replace this with something sensible, when migration to redux is done
        $res['update'] = $res['value'];
        $res['real'] = $res['value'];
        // @@@:TODO:END

        return response()->json($res);
    }

    public function upload(Request $request) {
        $data = $request->all();
        $path_arr = explode('/', $data['path']);
        $site = $path_arr[0];
        $template = $path_arr[2];

        $templateSettingsDataService = new SiteTemplateSettingsDataService($site, $template);
        $res = $templateSettingsDataService->uploadFileByPath($data);

        $res['update'] = $res['value'];
        $res['real'] = $res['value'];

        return response()->json($res);
    }

}
