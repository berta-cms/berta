<?php

namespace App\Sites\Sections\Entries;

use App\Shared\Helpers;

class SectionEntryRenderService
{
    private $entry;
    private $section;
    private $site_settings;
    private $site_template_settings;

    public function __construct($options)
    {
        $options = array_merge(
            [
                'entry' => null,
                'section' => null,
                'site_settings' => null,
                'site_template_settings' => null,
            ],
            $options
        );

        $this->entry = $options['entry'];
        $this->section = $options['section'];
        $this->site_settings = $options['site_settings'];
        $this->site_template_settings = $options['site_template_settings'];
    }

    /**
     * Prepare data for view
     */
    private function getViewData()
    {
        $entry = $this->entry;

        $entry['classList'] = $this->getClassList();
        $entry['entryId'] = $this->getEntryId();

        return $entry;
    }

    private function getClassList() {
        $classes = ['entry', 'xEntry', 'clearfix'];

        $classes[] = 'xEntryId-' . $this->entry['id'];
        $classes[] = 'xSection-' . $this->section['name'];

        $template_name = explode('-', $this->site_settings['template']['template'])[0];
        $section_type = isset($this->section['@attributes']['type']) ? $this->section['@attributes']['type'] : null;

        $isResponsive = isset($this->site_template_settings['pageLayout']['responsive']) ? $this->site_template_settings['pageLayout']['responsive'] : 'no';

        if ($template_name == 'messy') {
            $classes[] = 'xShopMessyEntry';

            if ($section_type == 'portfolio') {
                $isResponsive = 'yes';
            }

            if ($isResponsive == 'no') {
                $classes = array_merge($classes, ['mess', 'xEditableDragXY', 'xProperty-positionXY']);
            }
        }

        if (isset($this->entry['content']['fixed']) && $this->entry['content']['fixed']) {
            $classes[] = 'xFixed';
        }

        if ($section_type == 'portfolio') {
            $classes[] = 'xHidden';
        }

        return implode(' ', $classes);
    }

    private function getEntryId() {
        $section_type = isset($this->section['@attributes']['type']) ? $this->section['@attributes']['type'] : null;

        if ($section_type == 'portfolio' && isset($this->entry['content']['title']) && $this->entry['content']['title']) {
            $title = $this->entry['content']['title'];
        } else {
            $title = 'entry-'.$this->entry['id'];
        }
        $slug = Helpers::slugify($title, '-', '-');

        return $slug;
    }

    public function render($tag = null)
    {
        $data = $this->getViewData();

        return view('Sites/Sections/Entries/entry', $data);
    }
}
