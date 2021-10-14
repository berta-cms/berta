<?php

namespace App\Events;

class SectionUpdated extends Event
{
    public $siteName;
    public $sectionName;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($siteName, $sectionName)
    {
        $this->siteName = $siteName;
        $this->sectionName = $sectionName;
    }
}
