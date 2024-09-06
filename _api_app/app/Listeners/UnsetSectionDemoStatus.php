<?php

namespace App\Listeners;

use App\Events\SectionUpdated;
use App\Sites\Sections\SiteSectionsDataService;

class UnsetSectionDemoStatus
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(SectionUpdated $event): void
    {
        $siteSectionsDS = new SiteSectionsDataService($event->siteName);
        $siteSectionsDS->unsetDemoStatus($event->sectionName);
    }
}
