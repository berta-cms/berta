<?php

use App\Http\Middleware\Authenticate;
use App\Http\Middleware\SetupMiddleware;
use App\Models\User;
use App\Plugins\Shop\ShopController;
use Illuminate\Support\Facades\Route;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\getJson;
use function Pest\Laravel\withoutMiddleware;

$pluginInstalled = class_exists(ShopController::class);

beforeEach(function () {
    // SetupMiddleware reconciles the real .env file on every request.
    withoutMiddleware(SetupMiddleware::class);
    config(['plugin-Shop.key' => 'shop.test']);
});

// A real unauthenticated request can't run here: the guard's failure path
// logs out through the legacy engine.
it('requires authentication for the settings config', function () {
    $middleware = Route::getRoutes()->getByName('settings-config')->gatherMiddleware();

    expect($middleware)->toContain(Authenticate::class);
})->skip(! $pluginInstalled, 'Shop plugin not installed');

it('returns 403 for the settings config on a domain without a shop key', function () {
    actingAs(new User);

    getJson('http://other.test' . route('settings-config', [], false))
        ->assertForbidden()
        ->assertJsonPath('message', 'Shop not available!');
})->skip(! $pluginInstalled, 'Shop plugin not installed');

it('returns the shop settings config grouped by section', function () {
    actingAs(new User);

    getJson('http://shop.test' . route('settings-config', [], false))
        ->assertOk()
        ->assertJsonPath('data.group_config._.title', 'Configuration values')
        ->assertJsonPath('data.group_config.currency.default', 'EUR');
})->skip(! $pluginInstalled, 'Shop plugin not installed');
