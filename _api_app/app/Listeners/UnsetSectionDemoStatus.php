<?php

namespace App\Listeners;

use App\Events\SectionUpdated;
use App\Sites\Sections\SiteSectionsDataService;

class UnsetSectionDemoStatus
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  ExampleEvent  $event
     * @return void
     */
    public function handle(SectionUpdated $event)
    {
        $siteSectionsDS = new SiteSectionsDataService($event->siteName);
        $siteSectionsDS->unsetDemoStatus($event->sectionName);
    }
}
