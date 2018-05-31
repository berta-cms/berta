<?php

namespace App\Sites\Sections\Entries;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Sites\Sections\Entries\SectionEntriesDataService;

class SectionEntriesController extends Controller
{

    public function update(Request $request)
    {
        $json = $request->json()->all();
        $path_arr = explode('/', $json['path']);
        $site = $path_arr[0];
        $sectionName = $path_arr[2];
        $sectionEntriesDataService = new SectionEntriesDataService($site, $sectionName);
        $res = $sectionEntriesDataService->saveValueByPath($json['path'], $json['value']);

        // @@@:TODO: Replace this with something sensible, when migration to redux is done
        $res['update'] = $res['value'];
        // @@@:TODO:END

        return response()->json($res);
    }

}
