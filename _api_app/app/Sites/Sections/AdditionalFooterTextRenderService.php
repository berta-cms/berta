<?php

namespace App\Sites\Sections;

use App\Shared\Helpers;

class AdditionalFooterTextRenderService
{
    public $socialMediaLinksRS;

    public function __construct($socialMediaLinksRS)
    {
        $this->socialMediaLinksRS = $socialMediaLinksRS;
    }

    private function getViewData()
    {
        return [];
    }

    public function render()
    {
        $data = $this->getViewData();

        return view('Sites/Sections/additionalFooterText', $data);
    }
}
