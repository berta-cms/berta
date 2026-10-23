<?php

use App\Plugins\AiAssistant\Tools\ListSectionEntriesTool;
use Illuminate\Support\Facades\File;
use Laravel\Ai\Tools\Request;

$pluginInstalled = class_exists(ListSectionEntriesTool::class);

beforeEach(function () {
    $this->bertaRoot = sys_get_temp_dir() . '/berta_chat_entries_' . uniqid();
    File::ensureDirectoryExists($this->bertaRoot . '/storage');
    config(['app.old_berta_root' => $this->bertaRoot]);
    // The default template shows entry titles.
    linkBertaEngine($this->bertaRoot);
    writeTemplate($this->bertaRoot, 'default');
    file_put_contents(
        $this->bertaRoot . '/storage/sections.xml',
        '<?xml version="1.0" encoding="utf-8"?><sections><section><name><![CDATA[works]]></name><title><![CDATA[Works]]></title></section></sections>',
    );
});

afterEach(function () {
    File::deleteDirectory($this->bertaRoot);
});

it('lists section entries for the ai chat', function () {
    file_put_contents(
        $this->bertaRoot . '/storage/blog.works.xml',
        '<?xml version="1.0" encoding="utf-8"?><blog section="works">'
        . '<entry><id><![CDATA[1]]></id>'
        . '<mediaCacheData type="slideshow"><file type="image" src="a.jpg"/><file type="image" src="b.jpg"/><file type="video" src="c.mp4"/></mediaCacheData>'
        . '<content><title><![CDATA[First]]></title><description><![CDATA[<p>Hello</p>]]></description></content></entry>'
        . '<entry><id><![CDATA[2]]></id><content><cartTitle><![CDATA[Product]]></cartTitle></content></entry>'
        . '</blog>',
    );

    $result = (new ListSectionEntriesTool(''))->handle(new Request(['section_name' => 'works']));

    expect(json_decode($result, true))->toBe([
        [
            'id' => '1', 'title' => 'First', 'description' => '<p>Hello</p>', 'order' => 0,
            'gallery' => ['type' => 'slideshow', 'file_count' => 3, 'image_count' => 2, 'video_count' => 1],
        ],
        [
            'id' => '2', 'title' => '', 'description' => '', 'order' => 1,
            'gallery' => ['type' => null, 'file_count' => 0, 'image_count' => 0, 'video_count' => 0],
        ],
    ]);
})->skip(! $pluginInstalled, 'AiAssistant plugin not installed');

it('tells the ai chat when a section has no entries', function () {
    $result = (new ListSectionEntriesTool(''))->handle(new Request(['section_name' => 'works']));

    expect($result)->toBe('No entries found in this section.');
})->skip(! $pluginInstalled, 'AiAssistant plugin not installed');
