<?php

namespace App\Sites;

use App\Shared\Helpers;
use App\Shared\Storage;

class SitesRenderService
{
    private $multisites;
    private $currentSite;
    private $environment;
    private $isAvailable;
    private $isCurrentSite

    /**
     * Construct SitesRenderService instance
     *
     * @param array $multisite name, title, atribute,
     * @param string $currentSite
     * @param string $environment
     * @param bool $isAvailable
     * @param bool $isCurrentSite
     */

    public function __construct()
    {

    }

    public function getViewData()
    {

        foreach ($multisites as $siteName => $sites) {
            $isCurrentSite = $currentSite === $siteName || ($siteName == '0' && $currentSite == '')? true : false;
            $isAvailable = $environment == 'engine' || $currentSite != $siteName || ($siteName == '0' && $currentSite != '') ? true : false;

            if ($sites['title']['value'] != '') {
                $displayName = $sites['title']['value'];
            } elseif ($siteName === '0') {
                $displayName = 'Main Site';
            } else {
                $displayName = $siteName;
            }




        }



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

        if (count($data) > 1) {
            return view('Sites/multisites', $data);
        }

        return null

    }
}

