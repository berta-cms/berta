<?php

namespace App\Sites\Sections;

class SectionsMenuRenderService
{
    private $sections;
    private $sectionSlug;
    private $siteSettings;
    private $sectionTags;
    private $tagSlug;
    private $isEditMode;

    public function __construct(
        array $sections,
        $sectionSlug,
        array $siteSettings,
        array $sectionTags,
        $tagSlug,
        $isEditMode
    ) {
        $this->sections = $sections;
        $this->sectionSlug = $sectionSlug;
        $this->siteSettings = $siteSettings;
        $this->sectionTags = $sectionTags;
        $this->tagSlug = $tagSlug;
        $this->isEditMode = $isEditMode;
    }

    private function getTags()
    {
        $tags = array_filter($this->sectionTags['section'], function ($section) {
            return !empty($section['tag']);
        });

        $tags = array_reduce($tags, function ($sections, $section) {
            // @TODO Add url for each tag
            $sections[$section['@attributes']['name']] = $section['tag'];
            return $sections;
        }, []);

        return $tags;
    }

    private function getViewData()
    {
        $sections = $this->sections;
        $tags = $this->getTags();

        // Filter sections
        $sections = array_filter($sections, function ($section) {
            $isEmptyTitle = empty($section['title']);
            $isCartSection = isset($section['@attributes']['type']) && $section['@attributes']['type'] == 'shopping_cart';
            return !$isEmptyTitle && !$isCartSection;
        });

        if (!$this->isEditMode) {
            // Remove unpublished sites from public page
            $sections = array_filter($sections, function ($section) {
                return $section['@attributes']['published'] == '1';
            });

            // Show menu in first section?
            if ($this->siteSettings['navigation']['landingSectionMenuVisible'] == 'no' && !empty($sections) && current($sections)['name'] == $this->sectionSlug) {
                $sections = [];
            }

            // Is first section visible in menu?
            // Hide except if there is tags
            if ($this->siteSettings['navigation']['landingSectionVisible'] == 'no' && !empty($sections)) {
                $firstSectionSlug = current($sections)['name'];

                if (empty($tags[$firstSectionSlug])) {
                    array_shift($sections);
                }
            }
        }

        $sections = array_map(function ($section) use ($tags) {
            // @todo Add url to section
            $section['tags'] = !empty($tags[$section['name']]) ? $tags[$section['name']] : [];
            return $section;
        }, $sections);

        return [
            'sections' => $sections
        ];
    }

    public function render()
    {
        $data = $this->getViewData();
        if (empty($data['sections'])) {
            return '';
        }

        return view('Sites/Sections/sectionsMenu', $data);
    }
}
