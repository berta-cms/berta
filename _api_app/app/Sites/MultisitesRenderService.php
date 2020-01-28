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

    public function __construct(){}

    public function getViewData()
    {
        $SitesDataService = new SitesDataService();
        $multisites = $SitesDataService->get();

        // foreach ($multisites as $siteName => $sites) {
        //     $isCurrentSite = $currentSite === $siteName || ($siteName == '0' && $currentSite == '')? true : false;
        //     $isAvailable = $environment == 'engine' || $currentSite != $siteName || ($siteName == '0' && $currentSite != '') ? true : false;

        //     if ($sites['title']['value'] != '') {
        //         $displayName = $sites['title']['value'];
        //     } elseif ($siteName === '0') {
        //         $displayName = 'Main Site';
        //     } else {
        //         $displayName = $siteName;
        //     }
        // }

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
         *  environment: string
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

