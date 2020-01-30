<?php

namespace App\Sites;

use App\Shared\Helpers;
use App\Shared\Storage;
use App\Sites\SitesDataService;
use App\Sites\Settings\SiteSettingsDataService;

class MultisitesMenuRenderService
{
    private $currentSite;
    private $isEditMode;
    private $berta;

    /**
     * Construct SitesRenderService instance
     *
     * @param string $currentSite
     * @param bool $isEditMode
     */

    public function __construct(
        $currentSite,
        $isEditMode,
        $berta
    ){
        $this->currentSite = $currentSite;
        $this->isEditMode = $isEditMode;
        $this->berta = $berta;
    }

    public function messyClass($params)
    {
        $isResponsive = $this->berta->settings->get('pageLayout', 'responsive') == 'yes';

        if ($isResponsive) {
            return;
        }
        return 'mess xEditableDragXY xProperty-' . $params;
    }

    public function messyStyle($params)
    {
        $isResponsive = $this->berta->settings->get('pageLayout', 'responsive') == 'yes';

        if ($isResponsive) {
            return;
        }

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
        $i = 0;

        if ($this->berta && $this->berta->templateName == 'messy') {

            $data_path = '';
            $siteSettingsDataService = new SiteSettingsDataService('');
            $siteSettings =  $siteSettingsDataService->getSettingsBySite($this->currentSite);

            if ($this->isEditMode && $this->berta->settings->get('pageLayout', 'responsive') != 'yes') {
               $data_path = $this->currentSite . '/settings/siteTexts/multisitesXY';
            }

            $data['ulAtribute'] = [
                'class' => self::messyClass('multisitesXY'),
                'style' => self::messyStyle(array_key_exists('siteTexts', $siteSettings ) ? $siteSettings['siteTexts']['multisitesXY'] : '' ),
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
            return view('Sites/multisitesMenu', $data);
        }
        return '';
    }
}

