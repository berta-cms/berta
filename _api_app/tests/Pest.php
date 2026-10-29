<?php

use Illuminate\Support\Facades\File;
use Tests\TestCase;

/*
|--------------------------------------------------------------------------
| Test Case
|--------------------------------------------------------------------------
|
| The closure you provide to your test functions is always bound to a specific PHPUnit test
| case class. By default, that class is "PHPUnit\Framework\TestCase". Of course, you may
| need to change it using the "pest()" function to bind a different classes or traits.
|
*/

// Plugins (separate repositories in app/Plugins) keep their own tests in their tests folder.
pest()->extend(TestCase::class)->in('Feature', '../app/Plugins/*/tests');

/*
|--------------------------------------------------------------------------
| Expectations
|--------------------------------------------------------------------------
|
| When you're writing tests, you often need to check that values meet certain conditions. The
| "expect()" function gives you access to a set of "expectations" methods that you can use
| to assert different things. Of course, you may extend the Expectation API at any time.
|
*/

expect()->extend('toBeOne', function () {
    return $this->toBe(1);
});

/*
|--------------------------------------------------------------------------
| Functions
|--------------------------------------------------------------------------
|
| While Pest is very powerful out-of-the-box, you may have some testing code specific to your
| project that you don't want to repeat in every file. Here you can also expose helpers as
| global functions to help you to reduce the number of lines of code in your test files.
|
*/

function something()
{
    // ..
}

/**
 * Links the legacy engine into a temporary Berta root. Site settings read the engine's
 * definitions, and an anonymous request's auth check logs out through the legacy engine.
 */
function linkBertaEngine(string $bertaRoot): void
{
    // The real Berta root, as in config/app.php; tests may already point app.old_berta_root elsewhere
    $realRoot = dirname(base_path());
    File::ensureDirectoryExists($bertaRoot . '/engine');

    foreach (['engine/_classes', 'engine/lang', 'engine/inc.setting-definition.php', 'engine/inc.font-options.php', 'engine/inc.version.php', '_templates'] as $path) {
        symlink("{$realRoot}/{$path}", "{$bertaRoot}/{$path}");
    }
}

/**
 * Puts the website in a temporary Berta root on a hosting plan with these features, as UserModel reads them.
 * Needs linkBertaEngine().
 *
 * @param  list<string>  $features
 * @param  array<string, int>  $limits  e.g. ['ai_assistant_daily' => 10]
 */
function givePlanFeatures(string $bertaRoot, array $features, array $limits = []): void
{
    File::ensureDirectoryExists($bertaRoot . '/engine/config');
    File::put($bertaRoot . '/engine/config/inc.conf.php', "<?php\n\$options['AUTH_user'] = 'owner';\n\$options['AUTH_password'] = 'password';\n");
    symlink(dirname(base_path()) . '/engine/inc.hosting.php', $bertaRoot . '/engine/inc.hosting.php');
    File::put($bertaRoot . '/engine/hosting', json_encode(['login' => 'https://berta.me/login', 'plans' => [['id' => '2', 'features' => $features, 'limits' => $limits]]]));
    File::put($bertaRoot . '/engine/plan', '2');
}

/**
 * Sets the main site's template in a temporary Berta root. Needs linkBertaEngine() to be read.
 */
function writeTemplate(string $bertaRoot, string $template): void
{
    file_put_contents(
        $bertaRoot . '/storage/settings.xml',
        "<?xml version=\"1.0\" encoding=\"utf-8\"?><settings><template><template><![CDATA[{$template}]]></template></template></settings>",
    );
}

// Plugins share helpers between their own tests in their tests/Helpers.php.
foreach (glob(__DIR__ . '/../app/Plugins/*/tests/Helpers.php') ?: [] as $pluginHelpers) {
    require_once $pluginHelpers;
}
