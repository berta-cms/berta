<?php

namespace App\Sites;

use App\Shared\Helpers;
use App\Shared\Storage;
use App\Sites\SitesDataService;

class MultisitesRenderService
{
    private $multisites;
    private $currentSite;
    private $environment;
    private $isAvailable;
    private $isCurrentSite;

    /**
     * Construct SitesRenderService instance
     *
     * @param array $multisite name, title, atribute,
     * @param string $currentSite
     * @param string $environment
     * @param bool $isAvailable
     * @param bool $isCurrentSite
     */


    public function getViewData()
    {
        $SitesDataService = new SitesDataService();
        $multisites = $SitesDataService->get();



            return $multisites;

        /**
         * Return
         *
         * [
         *  multisites =>
         *      siteName =>
         *          Name: string
         *          Title: string
         *          displayName: string
         *          Link: string
         *          isAvailable: bool
         *          isCurrentSite: bool
         *      .....=>
         *          ....
         * ]
         */
    }

    public function render()
    {
        $data = $this->getViewData();
        var_dump($data);
        return view('Sites/multisites', $data);

    }
}

