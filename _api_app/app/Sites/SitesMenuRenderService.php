<?php

namespace App\Sites;

use App\Shared\Helpers;
use App\Shared\Storage;
use App\Sites\SitesDataService;
use App\Sites\Settings\SiteSettingsDataService;

class sitesMenuRenderService
{
    private $currentSite;
    private $isEditMode;
    private $siteTemplateSettings;

    /**
     * Construct SitesRenderService instance
     *
     * @param string $currentSite
     * @param bool $isEditMode
     * @param array $siteTemplateSettings
     */
    public function __construct(
        $currentSite,
        $isEditMode,
        array $siteSettings,
        array $siteTemplateSettings
    ) {
        $this->currentSite = $currentSite;
        $this->isEditMode = $isEditMode;
        $this->siteSettings = $siteSettings;
        $this->siteTemplateSettings = $siteTemplateSettings;
    }

    public function getStyles($params)
    {
        $pos = !empty($params) ? explode(',', $params) :
            [
                rand(0, 960),
                rand(0, 600)
            ];
        return 'left:' . $pos[0] . 'px;top:' . $pos[1] . 'px;';
    }

    public function getViewData()
    {
        $sitesDataService = new SitesDataService();
        $sites = $sitesDataService->get();
        $isResponsive = isset($this->siteTemplateSettings['pageLayout']['responsive']) && $this->siteTemplateSettings['pageLayout']['responsive'] == 'yes';
        $template = isset($this->siteSettings['template']['template']) ? $this->siteSettings['template']['template'] : '';
        $templateName = explode('-', $template)[0];
        $menuAttributes = [];

        if (!$this->isEditMode) {
            $sites = array_filter($sites, function ($site) {
                return $site['@attributes']['published'] == 1;
            });
        }

        if (count($sites) < 2) {
            return null;
        }

        // Hide current site from menu
        if (!$this->isEditMode) {
            $sites = array_filter($sites, function ($site) {
                return $this->currentSite !== $site['name'];
            });
        }

        $data['sites'] = array_map(function ($site) {
            if ($this->isEditMode) {
                $link = !empty($site['name']) ? './?site=' . $site['name'] : './';
            } else {
                $link = '/' . $site['name'];
            }

            return [
                'name' => !empty($site['title']) ? $site['title'] : $site['name'],
                'className' => $this->currentSite === $site['name'] ? 'selected' : null,
                'link' => $link
            ];
        }, $sites);

        if ($templateName == 'messy') {
            if ($this->isEditMode && !$isResponsive) {
                $menuAttributes['data-path'] = $this->currentSite . '/settings/siteTexts/multisitesXY';
            }

            if (!$isResponsive) {
                $menuAttributes['class'] = 'mess xEditableDragXY xProperty-multisitesXY';
                $menuAttributes['style'] = $this->getStyles(isset($this->siteSettings['siteTexts']['multisitesXY']) ? $this->siteSettings['siteTexts']['multisitesXY'] : '');
            }
        }

        $data['attributes'] = Helpers::arrayToHtmlAttributes($menuAttributes);
        return $data;
    }

    public function render()
    {
        $data = $this->getViewData();
        if (!$data) {
            return '';
        }
        return view('Sites/sitesMenu', $data);
    }
}
