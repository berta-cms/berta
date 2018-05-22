<?php

namespace App\Sites\Sections\Entries;

use App\Sites\Sections\Entries\SectionEntriesDataService;

class SectionEntriesRenderService {

    private static function getData() {
        return [
            'name' => 'John Doe'
        ];
    }

    public static function render() {
        $data = self::getData();
        return view('Sites/Sections/Entries/entry', $data);
    }
}
