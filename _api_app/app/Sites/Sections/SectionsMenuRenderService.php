<?php

namespace App\Sites\Sections;

use App\Shared\Helpers;

class SectionsMenuRenderService
{
    private $DRAGGABLE_MENU_CLASSES = ['mess', 'xEditableDragXY', 'xProperty-positionXY'];

    private function getTags($sectionTags, $sectionSlug, $tagSlug)
    {
        $tags = array_filter($sectionTags['section'], function ($section) {
            return !empty($section['tag']);
        });

        $tags = array_reduce($tags, function ($sections, $section) use ($sectionSlug, $tagSlug) {
            $sections[$section['@attributes']['name']] = array_map(function ($tag) use ($section, $sectionSlug, $tagSlug) {
                return [
                    'attributes' => Helpers::arrayToHtmlAttributes([
                        'class' => $this->getSubmenuItemClassList($tag, $section, $sectionSlug, $tagSlug)
                    ]),
                    'title' => $tag['@value'],
                    'name' => $tag['@attributes']['name']
                ];
            }, $section['tag']);
            return $sections;
        }, []);

        return $tags;
    }

    private function getViewData(
        $site,
        $sections,
        $sectionSlug,
        $siteSettings,
        $siteTemplateSettings,
        $sectionTags,
        $tagSlug,
        $isPreviewMode,
        $isEditMode
    ) {
        $templateName = explode('-', $siteSettings['template']['template'])[0];
        $tags = $this->getTags($sectionTags, $sectionSlug, $tagSlug);
        $submenu = [];

        // Filter sections
        $availableSections = array_filter($sections, function ($section) {
            $isEmptyTitle = empty($section['title']);
            $isCartSection = isset($section['@attributes']['type']) && $section['@attributes']['type'] == 'shopping_cart';
            return !$isEmptyTitle && !$isCartSection;
        });

        if (!$isEditMode) {
            // Remove unpublished sections from public page
            $availableSections = array_filter($availableSections, function ($section) {
                return $section['@attributes']['published'] == '1';
            });

            // Show menu in first section?
            if ($siteSettings['navigation']['landingSectionMenuVisible'] == 'no' && !empty($availableSections) && current($availableSections)['name'] == $sectionSlug) {
                $availableSections = [];
            }

            // Is first section visible in menu?
            // Hide except if there is tags
            if ($siteSettings['navigation']['landingSectionVisible'] == 'no' && !empty($availableSections)) {
                $firstSectionSlug = current($availableSections)['name'];

                if (empty($tags[$firstSectionSlug])) {
                    array_shift($availableSections);
                }
            }
        }

        if (empty($availableSections)) {
            return;
        }

        $currentSectionOrder = array_search($sectionSlug, array_column($sections, 'name'));
        $currentSection = $sections[$currentSectionOrder];
        $currentSectionType = isset($currentSection['@attributes']['type']) ? $currentSection['@attributes']['type'] : null;
        $isResponsiveTemplate = isset($siteTemplateSettings['pageLayout']['responsive']) && $siteTemplateSettings['pageLayout']['responsive'] == 'yes';
        $isResponsive = $currentSectionType == 'portfolio' || $isResponsiveTemplate;

        $availableSections = array_map(function ($section) use ($tags, $isResponsiveTemplate, $sectionSlug, $templateName, $siteTemplateSettings, $isResponsive, $isEditMode, $site, $sections, $siteSettings, $isPreviewMode) {
            $section['attributes'] = Helpers::arrayToHtmlAttributes([
                'class' => $this->getSectionClassList($section, $sectionSlug, $templateName, $siteTemplateSettings, $isResponsive),
                'style' => $this->getSectionStyleList($section, $isResponsive, $templateName),
                'data-path' => $isEditMode && !$isResponsive ? $site . '/section/' . $section['order'] . '/positionXY' : ''
            ]);

            $section['linkAttributes'] = Helpers::arrayToHtmlAttributes([
                'href' => $this->getUrl($section, $site, $sections, $siteSettings, $isEditMode, $isPreviewMode, null),
                'target' => !empty($section['@attributes']['type']) && $section['@attributes']['type'] == 'external_link' ? (!empty($section['target']) ? $section['target'] : '_blank') : ''
            ]);

            $section['tags'] = !empty($tags[$section['name']]) ? $tags[$section['name']] : [];

            switch ($templateName) {
                case 'messy':
                    $section['tags'] = array_filter($section['tags'], function ($tag) use ($section, $siteTemplateSettings, $isResponsive, $sectionSlug) {
                        if ($siteTemplateSettings['tagsMenu']['hidden'] == 'yes') {
                            return false;
                        }

                        if (!$isResponsive && $siteTemplateSettings['tagsMenu']['alwaysOpen'] != 'yes' && $sectionSlug != $section['name']) {
                            return false;
                        }

                        return true;
                    });
                    break;

                case 'white':
                    $section['tags'] = array_filter($section['tags'], function ($tag) use ($section, $sectionSlug) {
                        if ($sectionSlug != $section['name']) {
                            return false;
                        }

                        return true;
                    });
                    break;
                case 'default':
                    $section['tags'] = array_filter($section['tags'], function ($tag) use ($isResponsiveTemplate) {
                        return $isResponsiveTemplate;
                    });
                    break;
            }

            if (!empty($section['tags'])) {
                $section['submenuAttributes'] = Helpers::arrayToHtmlAttributes([
                    'class' => $this->getSubmenuClassList($section, $isEditMode)
                ]);

                $section['tags'] = array_map(function ($tag) use ($section, $site, $sections, $siteSettings, $isEditMode, $isPreviewMode) {
                    $tag['linkAttributes'] = Helpers::arrayToHtmlAttributes([
                        'class' => 'handle',
                        'href' => $this->getUrl($section, $site, $sections, $siteSettings, $isEditMode, $isPreviewMode, $tag)
                    ]);
                    return $tag;
                }, $section['tags']);
            }

            return $section;
        }, $availableSections);

        // Separate submenu for `default` template
        if ($templateName == 'default' && isset($tags[$sectionSlug])) {
            $submenu['tags'] = $tags[$sectionSlug];
            $currentSection['tags'] = $submenu['tags'];

            if (!empty($currentSection['tags'])) {
                $submenu['submenuAttributes'] = Helpers::arrayToHtmlAttributes([
                    'class' => $this->getSubmenuClassList($currentSection, $isEditMode)
                ]);

                $submenu['tags'] = array_map(function ($tag) use ($currentSection, $site, $sections, $siteSettings, $isEditMode, $isPreviewMode) {
                    $tag['linkAttributes'] = Helpers::arrayToHtmlAttributes([
                        'class' => 'handle',
                        'href' => $this->getUrl($currentSection, $site, $sections, $siteSettings, $isEditMode, $isPreviewMode, $tag)
                    ]);
                    return $tag;
                }, $submenu['tags']);
            }
        }

        return [
            'sections' => $availableSections,
            'submenu' => $submenu
        ];
    }

    private function getUrl($section, $site, $sections, $siteSettings, $isEditMode, $isPreviewMode, $tag = null)
    {
        $urlParts = [];
        $isExternalLink = isset($section['@attributes']['type']) && $section['@attributes']['type'] == 'external_link';
        if ($isExternalLink && !empty($section['link'])) {
            return $section['link'];
        }

        if (!empty($site)) {
            $urlParts['site'] = $site;
        }

        $isFirstSection = $section['name'] == $sections[0]['name'];
        $hasDirectContent = !empty($section['@attributes']['has_direct_content']) && $section['@attributes']['has_direct_content'];
        $alwaysSelectTag = $siteSettings['navigation']['alwaysSelectTag'] == 'yes';
        $isFirstTag = !$tag || $alwaysSelectTag && $tag['name'] == current($section['tags'])['name'];

        if ($isEditMode || !$isFirstSection || !$isFirstTag || ($hasDirectContent && !empty($section['tags']))) {
            $urlParts['section'] = $section['name'];
        }

        if ($tag && ($isEditMode || $hasDirectContent || !$isFirstTag)) {
            $urlParts['tag'] = $tag['name'];
        }

        if ($isEditMode) {
            if (empty($urlParts)) {
                return '.';
            }

            $parts = [];
            foreach ($urlParts as $property => $value) {
                $parts[] = $property . '=' . $value;
            }

            return '?' . implode('&', $parts);
        } else {
            return '/' . implode('/', $urlParts) . ($isPreviewMode ? '?preview=1' : '');
        }
    }

    private function getSectionClassList($section, $sectionSlug, $templateName, $siteTemplateSettings, $isResponsive)
    {
        $classList = [];

        if ($section['name'] == $sectionSlug) {
            $classList[] = 'selected';
        }

        if ($templateName == 'messy') {
            $classList[] = 'xSection-' . $section['name'];

            if ($siteTemplateSettings['menu']['position'] == 'fixed') {
                $classList[] = 'xFixed';
            }

            if (!$isResponsive) {
                $classList = array_merge($classList, $this->DRAGGABLE_MENU_CLASSES);
            }
        }

        return implode(' ', $classList);
    }

    private function getSectionStyleList($section, $isResponsive, $templateName)
    {
        $styles = [];
        if ($templateName == 'messy' && !$isResponsive) {
            if (isset($section['positionXY'])) {
                list($left, $top) = explode(',', $section['positionXY']);
            } else {
                // Place section menu item in random position if not dragged before
                list($left, $top) = [
                    rand(0, 960),
                    rand(0, 600),
                ];
            }

            $styles[] = ['left' => $left . 'px'];
            $styles[] = ['top' => $top . 'px'];

            if (!empty($styles)) {
                $styles = array_map(function ($style) {
                    $key = key($style);
                    return $key . ': ' . ($style[$key]);
                }, $styles);

                return implode(';', $styles);
            }
        }

        return null;
    }

    private function getSubmenuClassList($section, $isEditMode)
    {
        $classList = ['subMenu'];
        $classList[] = 'xSection-' . $section['name'];

        if ($isEditMode && count($section['tags']) > 1) {
            $classList[] = 'xAllowOrdering';
        }

        return implode(' ', $classList);
    }

    private function getSubmenuItemClassList($tag, $section, $sectionSlug, $tagSlug)
    {
        $classList = [];
        $classList[] = 'xTag-' . $tag['@attributes']['name'];

        if ($tag['@attributes']['name'] == $tagSlug && $section['@attributes']['name'] == $sectionSlug) {
            $classList[] = 'selected';
        }

        return implode(' ', $classList);
    }

    public function render(
        $site,
        $sections,
        $sectionSlug,
        $siteSettings,
        $siteTemplateSettings,
        $sectionTags,
        $tagSlug,
        $isPreviewMode,
        $isEditMode
    ) {
        $data = $this->getViewData(
            $site,
            $sections,
            $sectionSlug,
            $siteSettings,
            $siteTemplateSettings,
            $sectionTags,
            $tagSlug,
            $isPreviewMode,
            $isEditMode
        );
        if (empty($data['sections'])) {
            return '';
        }

        return view('Sites/Sections/sectionsMenu', $data);
    }
}
