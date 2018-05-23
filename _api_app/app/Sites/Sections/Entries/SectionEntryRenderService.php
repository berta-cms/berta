<?php

namespace App\Sites\Sections\Entries;

use App\Shared\Helpers;

class SectionEntryRenderService
{
    private $entry;
    private $section;
    private $siteSettings;
    private $siteTemplateSettings;

    public function __construct($options)
    {
        $options = array_merge(
            [
                'entry' => null,
                'section' => null,
                'siteSettings' => null,
                'siteTemplateSettings' => null,
            ],
            $options
        );

        $this->entry = $options['entry'];
        $this->section = $options['section'];
        $this->siteSettings = $options['siteSettings'];
        $this->siteTemplateSettings = $options['siteTemplateSettings'];
    }

    /**
     * Prepare data for view
     */
    private function getViewData()
    {
        $entry = $this->entry;

        $entry['entryId'] = $this->getEntryId();
        $entry['classList'] = $this->getClassList();
        $entry['styleList'] = $this->getStyleList();

        return $entry;
    }

    private function getEntryId() {
        $sectionType = isset($this->section['@attributes']['type']) ? $this->section['@attributes']['type'] : null;

        if ($sectionType == 'portfolio' && isset($this->entry['content']['title']) && $this->entry['content']['title']) {
            $title = $this->entry['content']['title'];
        } else {
            $title = 'entry-'.$this->entry['id'];
        }
        $slug = Helpers::slugify($title, '-', '-');

        return $slug;
    }

    private function getClassList() {
        $classes = ['entry', 'xEntry', 'clearfix'];

        $classes[] = 'xEntryId-' . $this->entry['id'];
        $classes[] = 'xSection-' . $this->section['name'];

        $templateName = explode('-', $this->siteSettings['template']['template'])[0];
        $sectionType = isset($this->section['@attributes']['type']) ? $this->section['@attributes']['type'] : null;

        $isResponsive = isset($this->siteTemplateSettings['pageLayout']['responsive']) ? $this->siteTemplateSettings['pageLayout']['responsive'] : 'no';

        if ($templateName == 'messy') {
            $classes[] = 'xShopMessyEntry';

            if ($sectionType == 'portfolio') {
                $isResponsive = 'yes';
            }

            if ($isResponsive == 'no') {
                $classes = array_merge($classes, ['mess', 'xEditableDragXY', 'xProperty-positionXY']);
            }
        }

        if (isset($this->entry['content']['fixed']) && $this->entry['content']['fixed']) {
            $classes[] = 'xFixed';
        }

        if ($sectionType == 'portfolio') {
            $classes[] = 'xHidden';
        }

        return implode(' ', $classes);
    }

    private function getStyleList() {
        $styles = [];
        $templateName = explode('-', $this->siteSettings['template']['template'])[0];
        $sectionType = isset($this->section['@attributes']['type']) ? $this->section['@attributes']['type'] : null;
        $isResponsive = isset($this->siteTemplateSettings['pageLayout']['responsive']) ? $this->siteTemplateSettings['pageLayout']['responsive'] : 'no';

        if ($templateName == 'messy') {
            if ($sectionType == 'portfolio') {
                $isResponsive = 'yes';
            }

            if ($isResponsive == 'yes') {
                return null;
            }

            if (isset($this->entry['content']['positionXY'])) {
                list($left, $top) = explode(',', $this->entry['content']['positionXY']);
            } else {
                // new (non updated) entries are placed in top right corder
                $placeInFullScreen = isset($this->entry['updated']);
                list($left, $top) = [
                    rand($placeInFullScreen ? 0 : 900, 960),
                    rand($placeInFullScreen ? 0 : 30, $placeInFullScreen ? 600 : 200)
                ];
            }

            $styles[] = ['left' => $left . 'px'];
            $styles[] = ['top' => $top . 'px'];

            if (isset($this->entry['content']['width']) && $this->entry['content']['width']) {
                $styles[] = ['width' => $this->entry['content']['width']];
            } elseif ($sectionType == 'shop' && isset($this->siteSettings['shop']['entryWidth'])) {
                $width = intval($this->siteSettings['shop']['entryWidth']);

                if ($width > 0) {
                    $styles[] = ['width' => $width . 'px'];
                }
            }

            if (!empty($styles)) {
                $styles = array_map(function($style){
                    $key = key($style);
                    return $key . ': ' . ($style[$key]);
                }, $styles);

                return implode(';', $styles);
            }
        }

        return null;
    }

    public function render($tag = null)
    {
        $data = $this->getViewData();

        return view('Sites/Sections/Entries/entry', $data);
    }
}
