<?php

namespace App\Sites\Sections;

class SectionBackgroundGalleryRenderService
{
    private function getViewData(
        $siteSettings,
        $siteTemplateSettings,
        $sectionSlug,
        $sections
    ) {
        return [
        ];
    }

    public function render(
        $siteSettings,
        $siteTemplateSettings,
        $sectionSlug,
        $sections
    ) {
        $data = $this->getViewData(
            $siteSettings,
            $siteTemplateSettings,
            $sectionSlug,
            $sections
        );

        return view('Sites/Sections/sectionBackgroundGallery', $data);
    }
}
