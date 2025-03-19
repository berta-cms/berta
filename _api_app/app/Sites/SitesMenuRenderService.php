<?php

namespace App\Sites;

use App\Shared\Helpers;

class SitesMenuRenderService
{
    private $DRAGGABLE_MENU_CLASSES = 'mess xEditableDragXY xProperty-multisitesXY';

    private function getStyles($params)
    {
        $pos = ! empty($params) ? explode(',', $params) :
            [
                rand(0, 960),
                rand(0, 600),
            ];

        return 'left:' . $pos[0] . 'px;top:' . $pos[1] . 'px;';
    }

    /**
     * Prepare data for template
     *
     * @param  string  $currentSite
     * @param  bool  $isEditMode
     * @param  array  $siteSettings
     * @param  array  $siteTemplateSettings
     * @param  array  $sites
     * @return array
     */
    private function getViewData(
        $currentSite,
        $isEditMode,
        $siteSettings,
        $siteTemplateSettings,
        $sites
    ) {
        $isResponsive = isset($siteTemplateSettings['pageLayout']['responsive']) && $siteTemplateSettings['pageLayout']['responsive'] == 'yes';
        $template = isset($siteSettings['template']['template']) ? $siteSettings['template']['template'] : '';
        $templateName = explode('-', $template)[0];
        $menuAttributes = [];

        if (! $isEditMode) {
            $sites = array_filter($sites, function ($site) {
                return $site['@attributes']['published'] == 1;
            });
        }

        if (count($sites) < 2) {
            return null;
        }

        // Hide current site from menu
        if (! $isEditMode) {
            $sites = array_filter($sites, function ($site) use ($currentSite) {
                return $currentSite !== $site['name'];
            });
        }

        $data['sites'] = array_map(function ($site) use ($currentSite, $isEditMode) {
            if ($isEditMode) {
                $link = ! empty($site['name']) ? './?site=' . $site['name'] : './';
            } else {
                $link = '/' . $site['name'];
            }

            return [
                'name' => ! empty($site['title']) ? $site['title'] : $site['name'],
                'className' => $currentSite === $site['name'] ? 'selected' : null,
                'link' => $link,
            ];
        }, $sites);

        if ($templateName == 'messy') {
            if ($isEditMode && ! $isResponsive) {
                $menuAttributes['data-path'] = $currentSite . '/settings/siteTexts/multisitesXY';
            }

            if (! $isResponsive) {
                $menuAttributes['class'] = $this->DRAGGABLE_MENU_CLASSES;
                $menuAttributes['style'] = $this->getStyles(isset($siteSettings['siteTexts']['multisitesXY']) ? $siteSettings['siteTexts']['multisitesXY'] : '');
            }
        }

        $data['attributes'] = Helpers::arrayToHtmlAttributes($menuAttributes);

        return $data;
    }

    /**
     * Render sites menu
     *
     * @param  string  $currentSite
     * @param  bool  $isEditMode
     * @param  array  $siteSettings
     * @param  array  $siteTemplateSettings
     * @param  array  $sites
     * @return string
     */
    public function render(
        $currentSite,
        $user,
        $isEditMode,
        $siteSettings,
        $siteTemplateSettings,
        $sites
    ) {
        if (! in_array('multisite', $user->features)) {
            return '';
        }

        $data = $this->getViewData($currentSite, $isEditMode, $siteSettings, $siteTemplateSettings, $sites);
        if (! $data) {
            return '';
        }

        return view('Sites/sitesMenu', $data);
    }
}
