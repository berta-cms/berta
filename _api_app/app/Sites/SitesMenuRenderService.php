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
        array $siteSettingsDS,
        array $siteTemplateSettings
    ){
        $this->currentSite = $currentSite;
        $this->isEditMode = $isEditMode;
        $this->siteSettingsDS = $siteSettingsDS;
        $this->siteTemplateSettings = $siteTemplateSettings;
    }

    public function messyStyle($params)
    {
        $pos = !empty($params) ? explode(',', $params) :
            [
                rand(0 , 960),
                rand(0 , 600 )
            ];
        return 'left:' . $pos[0] . 'px;top:' . $pos[1]. 'px;';
    }

    public function getViewData()
    {
        $sitesDataService = new SitesDataService();
        $sites = $sitesDataService->get();
        $isResponsive = isset($this->siteTemplateSettings['pageLayout']['responsive']) && $this->siteTemplateSettings['pageLayout']['responsive'] == 'yes';
        $siteSettings =   $this->siteSettingsDS;
        $template = isset($siteSettings['template']['template']) ? $siteSettings['template']['template'] : '';
        $templateName = explode('-', $template)[0];
        $i = 0;

        if ($templateName == 'messy') {

            $data_path = '';

            if ($this->isEditMode && !$isResponsive) {
               $data_path = $this->currentSite . '/settings/siteTexts/multisitesXY';
            }

            $data['ulAtribute'] = [
                'class' => $isResponsive ? '' : 'mess xEditableDragXY xProperty-multisitesXY',
                'style' => $isResponsive ? '' : self::messyStyle(array_key_exists('siteTexts', $siteSettings ) && array_key_exists('multisitesXY', $siteSettings['siteTexts'] ) ? $siteSettings['siteTexts']['multisitesXY'] : ''),
                'data' => $data_path
            ];
        }

        foreach ($sites as $site) {
            $isPublished = $this->isEditMode || $site['@attributes']['published'] == 1;

            if($isPublished) {
                $className = $this->currentSite === $site['name'] ? 'selected' : null;

                if ($this->isEditMode  || $this->currentSite != $site['name'] || ($site['name'] == '' && $this->currentSite == '')) {
                    $displayName = $site['title'] !== '' ? $site['title'] : $site['name'];
                    $link = $this->isEditMode ? './?site='.$site['name'] : '/'.$site['name'];
                    $link = $link == './?site=' ? './' : $link;
                    $data['sites'][] = [
                        'name' => $displayName,
                        'className' => $className,
                        'link' => $link
                    ];
                }
                $i++;
            }
        }

        if ($i > 1) {
            return $data;
        }

        return null;
    }

    public function render()
    {
        $data = $this->getViewData();
        if ($data) {
            return view('Sites/sitesMenu', $data);
        }
        return '';
    }
}

