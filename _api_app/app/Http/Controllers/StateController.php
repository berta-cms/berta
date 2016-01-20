<?php

namespace App\Http\Controllers;

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

        return response()->json($this->getTagsBySite(''));
    }
}
