<?php

namespace App\Sites\Settings;

use App\Http\Controllers\Controller;
use App\Shared\Helpers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

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

    public function upload(Request $request)
    {
        $file = $request->file('value');
        $path = $request->get('path');

        if (! $file || ! $file->isValid() || ! $path) {
            return Helpers::api_response('Upload failed.', (object) [], 500);
        }

        $validator = Validator::make(['file' => $file], [
            'file' => 'max:' . config('app.image_max_file_size') . '|mimes:' . implode(',', config('app.image_mimes')) . ',' . implode(',', config('app.ico_mimes')),
        ]);

        $isImage = in_array($file->guessExtension(), config('app.image_mimes'));

        $validator->sometimes('file', 'not_corrupted_image', function ($file) use ($isImage) {
            return $isImage;
        });

        if ($validator->fails()) {
            return Helpers::api_response($validator->getMessageBag()->all(), (object) [], 400);
        }

        $path_arr = explode('/', $path);
        $site = $path_arr[0];
        $settingsDataService = new SiteSettingsDataService($site);
        $mediaDir = $settingsDataService->getOrCreateMediaDir();

        if (! is_writable($mediaDir)) {
            return Helpers::api_response('Media folder not writable.', (object) [], 500);
        }

        $res = $settingsDataService->uploadFileByPath($path, $file);
        $res['update'] = $res['value'];
        $res['real'] = $res['value'];

        return response()->json($res);
    }
}
