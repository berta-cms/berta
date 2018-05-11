<?php

namespace App\Http\Controllers;

use App\SiteSectionsDataService;
use Illuminate\Http\Request;

class SectionController extends Controller
{

    public function test(Request $request) {
        $sectionsData = new SiteSectionsDataService();
        return $sectionsData->validationTest() ? 'true':'false';
    }

    public function create(Request $request) {
        $json = $request->json()->all();
        $sectionsDataService = new SiteSectionsDataService($json['site']);
        $section = $sectionsDataService->create(
            $json['name'],
            $json['title']
        );

        return response()->json($section);
    }

    public function update(Request $request) {
        $json = $request->json()->all();
        $path_arr = explode('/', $json['path']);
        $site = $path_arr[0];
        $sectionsDataService = new SiteSectionsDataService($site);
        $path_arr = array_slice($path_arr, 1);

        $res = $sectionsDataService->saveValueByPath($json['path'], $json['value']);
        // @@@:TODO: Replace this with something sensible, when migration to redux is done
        $res['update'] = $res['value'];
        // @@@:TODO:END

        return response()->json($res);
    }

    public function delete($site, $section) {
        $sectionsDataService = new SiteSectionsDataService($site);
        $res = $sectionsDataService->delete($section);

        return response()->json($res);
    }

    public function reset(Request $request) {
        $json = $request->json()->all();
        $path_arr = explode('/', $json['path']);
        $site = $path_arr[0];
        $sectionsDataService = new SiteSectionsDataService($site);
        $res = $sectionsDataService->deleteValueByPath($json['path']);

        return response()->json($res);
    }

    public function order(Request $request) {
        $json = $request->json()->all();
        $sectionsDataService = new SiteSectionsDataService($json['site']);
        $sectionsDataService->order($json['sections']);
        return response()->json($json);
    }

    public function galleryDelete($site, $section, $file) {
        $sectionsDataService = new SiteSectionsDataService($site);
        $res = $sectionsDataService->galleryDelete($section, $file);
        return response()->json($res);
    }

    public function galleryOrder(Request $request) {
        $json = $request->json()->all();
        $sectionsDataService = new SiteSectionsDataService($json['site']);
        $ret = $sectionsDataService->galleryOrder($json['section'], $json['files']);
        return response()->json($ret);
    }
}
