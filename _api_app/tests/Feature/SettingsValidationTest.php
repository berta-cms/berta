<?php

use App\Http\Middleware\SetupMiddleware;
use App\Models\User;
use Illuminate\Support\Facades\File;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\patchJson;
use function Pest\Laravel\withoutMiddleware;

beforeEach(function () {
    $this->bertaRoot = sys_get_temp_dir() . '/berta_settings_validation_' . uniqid();
    File::ensureDirectoryExists($this->bertaRoot . '/storage');
    config(['app.old_berta_root' => $this->bertaRoot]);
    linkBertaEngine($this->bertaRoot);
    writeTemplate($this->bertaRoot, 'messy-0.4.2');

    // SetupMiddleware reconciles the real .env file on every request.
    withoutMiddleware(SetupMiddleware::class);
    actingAs(new User);
});

afterEach(function () {
    File::deleteDirectory($this->bertaRoot);
});

describe('design settings', function () {
    it('saves a valid value', function () {
        patchJson(route('site_template_settings'), ['path' => '/template-settings/messy-0.4.2/generalFontSettings/fontWeight', 'value' => 'bold'])
            ->assertOk()
            ->assertJsonMissingPath('error_message');

        expect(file_get_contents($this->bertaRoot . '/storage/settings.messy.xml'))->toContain('bold');
    });

    it('refuses a value the editor would not offer, without saving it', function () {
        patchJson(route('site_template_settings'), ['path' => '/template-settings/messy-0.4.2/generalFontSettings/fontWeight', 'value' => 'heavy'])
            ->assertStatus(422)
            ->assertJsonPath('error_message', 'Use one of the allowed values: normal | bold.');

        expect(file_exists($this->bertaRoot . '/storage/settings.messy.xml'))->toBeFalse();
    });
});

describe('site settings', function () {
    it('refuses a setting that needs a feature the plan does not include', function () {
        givePlanFeatures($this->bertaRoot, ['multisite']);

        patchJson(route('site_settings'), ['path' => '/settings/socialMediaButtons/socialMediaHTML', 'value' => '<script></script>'])
            ->assertStatus(422)
            ->assertJsonPath('error_message', 'This setting needs the custom_javascript feature, which the website\'s plan doesn\'t include.');

        expect(file_get_contents($this->bertaRoot . '/storage/settings.xml'))->not->toContain('<script>');
    });

    it('saves that setting when the plan includes the feature', function () {
        givePlanFeatures($this->bertaRoot, ['custom_javascript']);

        patchJson(route('site_settings'), ['path' => '/settings/socialMediaButtons/socialMediaHTML', 'value' => '<b>Share</b>'])
            ->assertOk()
            ->assertJsonMissingPath('error_message');
    });

    it('saves entries of list settings as before', function () {
        patchJson(route('site_settings'), ['path' => '/settings/socialMediaLinks/links/0/url', 'value' => 'https://example.com'])
            ->assertOk()
            ->assertJsonMissingPath('error_message');
    });
});
