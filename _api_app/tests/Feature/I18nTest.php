<?php

use App\Shared\I18n;
use Illuminate\Support\Facades\File;

beforeEach(function () {
    $this->bertaRoot = sys_get_temp_dir() . '/berta_i18n_' . uniqid();
    File::ensureDirectoryExists($this->bertaRoot . '/engine/lang');
    File::put($this->bertaRoot . '/engine/lang/en.php', "<?php return ['greeting_text' => 'Hello', 'farewell_text' => 'Goodbye'];");
    File::put($this->bertaRoot . '/engine/lang/xx.php', "<?php return ['farewell_text' => 'Ardievu', 'Close' => 'Aizvērt'];");
    config(['app.old_berta_root' => $this->bertaRoot]);

    I18n::load_language('xx');
});

afterEach(function () {
    File::deleteDirectory($this->bertaRoot);
    I18n::$translations = null;
    I18n::$fallback = [];
});

it('returns the English text of a key the language has no translation of', function () {
    expect(I18n::_('greeting_text'))->toBe('Hello');
});

it('returns the language\'s own translation of a key or a text', function () {
    expect(I18n::_('farewell_text'))->toBe('Ardievu')
        ->and(I18n::_('Close'))->toBe('Aizvērt');
});

it('returns a text that is not a key unchanged', function () {
    expect(I18n::_('Save'))->toBe('Save');
});
