<?php

use App\Sites\SitesDataService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

beforeEach(function () {
    $this->bertaRoot = sys_get_temp_dir() . '/berta_sites_' . uniqid();
    $this->storage = $this->bertaRoot . '/storage';
    File::ensureDirectoryExists($this->storage . '/-sites/other');
    config(['app.old_berta_root' => $this->bertaRoot]);
    file_put_contents(
        $this->storage . '/-sites/sites.xml',
        '<?xml version="1.0" encoding="utf-8"?><sites><site published="1"><name></name><title><![CDATA[Main]]></title></site>'
        . '<site published="0"><name><![CDATA[other]]></name><title><![CDATA[Other]]></title></site></sites>',
    );
    file_put_contents($this->storage . '/-sites/other/sections.xml', 'sections');
});

afterEach(function () {
    File::deleteDirectory($this->bertaRoot);
});

it('adds back a deleted subsite whose folder is in place again, at the end', function () {
    $record = (new SitesDataService)->delete('other');
    File::ensureDirectoryExists($this->storage . '/-sites/other');

    expect((new SitesDataService)->restore($record))->toBe($record)
        ->and(array_column((new SitesDataService)->get(), 'name'))->toBe(['', 'other'])
        ->and((new SitesDataService)->get()[1]['title'])->toBe('Other');
});

it('does not restore a subsite whose name is taken or whose folder is missing', function () {
    $record = (new SitesDataService)->get()[1];

    expect((new SitesDataService)->restore($record))->toHaveKey('error_message');

    (new SitesDataService)->delete('other');

    expect((new SitesDataService)->restore($record))->toHaveKey('error_message')
        ->and(array_column((new SitesDataService)->get(), 'name'))->toBe(['']);
});

it('never deletes the main site, whose name would point at the folder of all subsites', function () {
    expect((new SitesDataService)->delete(''))->toHaveKey('error_message')
        ->and($this->storage . '/-sites/other/sections.xml')->toBeFile();
});

it('gives a new site a settings file with the default template, and a copy the settings of its source', function () {
    linkBertaEngine($this->bertaRoot);
    file_put_contents($this->storage . '/-sites/other/settings.xml', '<?xml version="1.0" encoding="utf-8"?><settings><template><template><![CDATA[white-0.3.5]]></template></template></settings>');

    $new = (new SitesDataService)->create(Request::create('/'));
    $copy = (new SitesDataService)->create(Request::create('/'), 'other');

    expect(file_get_contents($this->storage . "/-sites/{$new['name']}/settings.xml"))->toContain('messy-0.4.2')
        ->and(file_get_contents($this->storage . "/-sites/{$copy['name']}/settings.xml"))->toContain('white-0.3.5');
});
