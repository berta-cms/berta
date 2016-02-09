<?php

namespace App\Http\Controllers;

use App\Sections;
use Illuminate\Http\Request;

class SectionController extends Controller
{
    public function orderSections(Request $request) {
        $sections = new Sections();
        $json = $request->json()->all();
        $sections->orderSections($json['site'], $json['sections']);
        return response()->json($json);
    }
}
