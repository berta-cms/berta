<?php

namespace App\Sites\Sections\Tags;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SectionTagsController extends Controller
{
    public function order(Request $request)
    {
        $json = $request->json()->all();
        $sectionTagsDataService = new SectionTagsDataService($json['site'], $json['section']);
        $res = $sectionTagsDataService->order($json['tag'], $json['value']);

        return response()->json($res);
    }
}
