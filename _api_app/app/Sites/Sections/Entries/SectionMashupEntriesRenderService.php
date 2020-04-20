<?php

namespace App\Sites\Sections\Entries;

class SectionMashupEntriesRenderService
{
    private function getViewData(
        $siteSlug
    ) {
        return [];
    }

    public function render(
        $siteSlug
    ) {
        $data = $this->getViewData(
            $siteSlug
        );

        return view('Sites/Sections/Entries/mashupEntries', $data);
    }
}
