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
        $this->currentSite = '';
        $this->isEditMode = false;
    }

    public function getViewData()
    {

        $sitesDataService = new SitesDataService();
        $sites = $sitesDataService->get();
        $data['multisite'] = [];
        $i = 0;
        foreach ($sites as $site) {
            $isPublished = $this->isEditMode == true ? true : $site['@attributes']['published'] == 1 ? true : false;
            if($isPublished) {
                $isCurrentSite = $this->currentSite === $site['name'] ? true : false;
                $isAvailable = $this->isEditMode == true || $this->currentSite != $site['name'] || ($site['name'] == '' && $this->currentSite == '') ? true : false;
                $displayName = $site['title'] !== '' ? $site['title'] : $site["name"];
                $link = $this->isEditMode == true ? './?site='.$site["name"] : '/'.$site["name"];

                $data['multisite'] = $data['multisite'] + [
                    $i => [
                        'Name' => $displayName,
                        'isCurrentSite' => $isCurrentSite === true ? 'selected' : null,
                        'isAvailable' => $isAvailable,
                        'link' => $link
                    ],
                ];
                $i++;
            }
        }
        return $data;
    }

    public function render()
    {
        $data = $this->getViewData();
        if (count($data['multisite']) > 1) {
            return view('Sites/multisitesMenu', $data);
        }
        return null;
    }
}

