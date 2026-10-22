<?php

use App\Plugins\AiAssistant\SiteContentReader;
use Illuminate\Support\Facades\File;

$pluginInstalled = class_exists(SiteContentReader::class);

beforeEach(function () {
    $this->bertaRoot = sys_get_temp_dir() . '/berta_reader_' . uniqid();
    File::ensureDirectoryExists($this->bertaRoot . '/storage');
    config(['app.old_berta_root' => $this->bertaRoot]);
});

afterEach(function () {
    File::deleteDirectory($this->bertaRoot);
});

it('normalizes sections from storage', function () {
    file_put_contents(
        $this->bertaRoot . '/storage/sections.xml',
        '<?xml version="1.0" encoding="utf-8"?><sections>'
        . '<section published="1" entry_count="3"><name><![CDATA[works]]></name><title><![CDATA[Works]]></title></section>'
        . '<section published="0" type="shop" entry_count="2"><name><![CDATA[shop]]></name><title></title>'
        . '<seoTitle><![CDATA[Buy prints]]></seoTitle></section>'
        . '<section><name><![CDATA[about]]></name><title lang="en"><![CDATA[About]]></title></section>'
        . '</sections>',
    );

    expect((new SiteContentReader)->sections())->toBe([
        [
            'name' => 'works', 'title' => 'Works', 'type' => 'default', 'published' => true, 'entry_count' => 3, 'order' => 0,
            'seo' => ['title' => '', 'keywords' => '', 'description' => ''],
        ],
        [
            'name' => 'shop', 'title' => '', 'type' => 'shop', 'published' => false, 'entry_count' => 2, 'order' => 1,
            'seo' => ['title' => 'Buy prints', 'keywords' => '', 'description' => ''],
        ],
        [
            'name' => 'about', 'title' => 'About', 'type' => 'default', 'published' => true, 'entry_count' => 0, 'order' => 2,
            'seo' => ['title' => '', 'keywords' => '', 'description' => ''],
        ],
    ]);
})->skip(! $pluginInstalled, 'AiAssistant plugin not installed');

it('returns no sections when the site has no sections file', function () {
    expect((new SiteContentReader)->sections())->toBe([]);
})->skip(! $pluginInstalled, 'AiAssistant plugin not installed');
