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
}
