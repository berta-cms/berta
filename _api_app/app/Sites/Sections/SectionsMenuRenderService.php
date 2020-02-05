<?php

namespace App\Sites\Sections;

class SectionsMenuRenderService
{
    private function getViewData()
    {
        return [];
    }

    public function render()
    {
        $data = $this->getViewData();
        return view('Sites/Sections/sectionsMenu', $data);
    }
}
