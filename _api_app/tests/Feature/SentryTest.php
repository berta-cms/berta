<?php

use function Pest\Laravel\get;

it('returns correct sentry endpoint response header', function () {
    get(route('sentry'))->assertHeader('Content-Type', 'text/plain; charset=UTF-8');
});
