<?php

namespace App\Sites\TemplateSettings;

use App\Http\Controllers\Controller;
use App\Shared\Helpers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SiteTemplateSettingsController extends Controller
{
    public function update(Request $request)
    {
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

    public function upload(Request $request)
    {
        $file = $request->file('value');
        $path = $request->get('path');

        if (! $file || ! $file->isValid() || ! $path) {
            return Helpers::api_response('Upload failed.', (object) [], 500);
        }

        $validator = Validator::make(['file' => $file], [
            'file' => 'max:' . config('app.image_max_file_size') . '|mimes:' . implode(',', config('app.image_mimes')) . '|not_corrupted_image',
        ]);

        if ($validator->fails()) {
            return Helpers::api_response($validator->getMessageBag()->all(), (object) [], 400);
        }

        $path_arr = explode('/', $path);
        $site = $path_arr[0];
        $template = $path_arr[2];
        $templateSettingsDataService = new SiteTemplateSettingsDataService($site, $template);
        $mediaDir = $templateSettingsDataService->getOrCreateMediaDir();

        if (! is_writable($mediaDir)) {
            return Helpers::api_response('Media folder not writable.', (object) [], 500);
        }

        $res = $templateSettingsDataService->uploadFileByPath($path, $file);
        $res['update'] = $res['value'];
        $res['real'] = $res['value'];

        return response()->json($res);
    }
}
