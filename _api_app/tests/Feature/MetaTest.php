<?php

use function Pest\Laravel\get;

it('has correct app version', function () {
    include realpath(config('app.old_berta_root') . '/engine/inc.version.php');
    $currentAppVersion = $options['version'];

    get(route('meta'))->assertJsonFragment([
        'version' => $currentAppVersion,
    ]);
});
