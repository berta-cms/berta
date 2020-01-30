<?php

namespace App\Sites;

use App\Shared\Helpers;
use App\Shared\Storage;
use App\Sites\SitesDataService;

class MultisitesMenuRenderService
{
    private $currentSite;
    private $isEditMode;

    /**
     * Construct SitesRenderService instance
     *
     * @param string $currentSite
     * @param bool $isEditMode
     */

    public function __construct(
        $currentSite,
        $isEditMode
    ){
        $this->currentSite = $currentSite;
        $this->isEditMode = $isEditMode;
    }

    public function getViewData()
    {
        $sitesDataService = new SitesDataService();
        $sites = $sitesDataService->get();
        $data['sites'] = [];
        $i = 0;

        foreach ($sites as $site) {
            $isPublished = $this->isEditMode || $site['@attributes']['published'] == 1 ? true : false;

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

