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
        $this->isEditMode = true;
    }

    public function getViewData()
    {

        $SitesDataService = new SitesDataService();
        $multisites = $SitesDataService->get();
        $data['multisite'] = [];
        $i = 0;
        foreach ($multisites as $sites) {
            $isPublished = $this->isEditMode == true ? true : $sites['@attributes']['published'];
            $isCurrentSite = $this->currentSite === $sites['name'] ? true : false;
            $isAvailable = $this->isEditMode == true || $this->currentSite != $sites['name'] || ($sites['name'] == '' && $this->currentSite == '') ? true : false;
            $displayName = $sites['title'] !== '' ? $sites['title'] : $sites["name"];

            $data['multisite'] = $data['multisite'] + [
                $i => [
                    'Name' => $displayName,
                    'isPublished' => $isPublished,
                    'isCurrentSite' => $isCurrentSite,
                    'isAvailable' => $isAvailable
                ],
            ];
            $i++;
        }
        return $data;
    }

    public function render()
    {
        $data = $this->getViewData();
        var_dump($data);
        if (count($data['multisite']) > 1) {
            return view('Sites/multisites', $data);
        }
        return null;
    }
}

