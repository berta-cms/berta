<?php

namespace App\Sites\Sections;

class SectionsMenuRenderService
{
    private $sections;
    private $siteSettings;
    private $isEditMode;

    public function __construct(
        array $sections,
        array $siteSettings,
        $isEditMode
    ) {
        $this->sections = $sections;
        $this->siteSettings = $siteSettings;
        $this->isEditMode = $isEditMode;
    }

    private function getViewData()
    {
        $sections = $this->sections;

        if (!$this->isEditMode) {
            // Remove unpublished sites from public page
            $sections = array_filter($sections, function ($section) {
                return $section['@attributes']['published'] == '1';
            });
        }

        // Remove sections without title
        $sections = array_filter($sections, function ($section) {
            return !empty($section['title']);
        });

        // @todo filter out:
        // - navigation.landingSectionMenuVisible
        // - navigation.landingSectionVisible
        // - cart page

        \var_export([$this->isEditMode, $sections]);

        return [
            'sections' => $sections
        ];
    }

    public function render()
    {
        $data = $this->getViewData();
        return view('Sites/Sections/sectionsMenu', $data);
    }
}
