<?php

namespace App\Http\Controllers;

use App\Tags;

class StateController extends Controller
{
    public function getState() {
        // $state = array();
        // $sites = $this->getSites();

        // foreach($sites['site'] as $site) {
        //     $site_name = $site['name'];
        //     $sections = $this->getSectionsBySite($site_name);

        //     foreach ($sections['section'] as $section) {
        //         die(var_export($section));
        //     }
        // }

        $tags = new Tags();
        return response()->json($tags->getTagsBySite(''));
    }
}
