<?php

namespace App\Http\Controllers;

use App\Sections;
use Illuminate\Http\Request;

class SectionController extends Controller
{
    public function create(Request $request) {
        $json = $request->json()->all();
        $sections = new Sections($json['site']);
        $section = $sections->create(
            $json['name'],
            $json['title']
        );

        return response()->json($section);
    }

    public function update(Request $request) {
        $json = $request->json()->all();
        $path_arr = explode('/', $json['path']);
        $site = $path_arr[0];
        $sections = new Sections($site);
        $path_arr = array_slice($path_arr, 1);

        $res = $sections->saveValueByPath($json['path'], $json['value']);
        // @@@:TODO: Replace this with something sensible, when migration to redux is done
        $res['update'] = $res['value'];
        $res['real'] = $res['value'];
        // @@@:TODO:END

        return response()->json($res);
    }

    public function delete($site, $section) {
        $sections = new Sections($site);
        $res = $sections->delete($section);

        return response()->json($res);
    }

    public function order(Request $request) {
        $json = $request->json()->all();
        $sections = new Sections($json['site']);
        $sections->order($json['sections']);
        return response()->json($json);
    }

    public function galleryDelete($site, $section, $file) {
        $sections = new Sections($site);
        $res = $sections->galleryDelete($section, $file);
        return response()->json($res);
    }

    public function galleryOrder(Request $request) {
        $json = $request->json()->all();
        $sections = new Sections($json['site']);
        $ret = $sections->galleryOrder($json['section'], $json['files']);
        return response()->json($ret);
    }
}
