<?php

use App\Plugins\AiAssistant\Tools\GetEntryGalleryTool;
use Illuminate\Support\Facades\File;
use Laravel\Ai\Tools\Request;

$pluginInstalled = class_exists(GetEntryGalleryTool::class);

beforeEach(function () {
    $this->bertaRoot = sys_get_temp_dir() . '/berta_chat_gallery_' . uniqid();
    File::ensureDirectoryExists($this->bertaRoot . '/storage');
    config(['app.old_berta_root' => $this->bertaRoot]);
    file_put_contents(
        $this->bertaRoot . '/storage/sections.xml',
        '<?xml version="1.0" encoding="utf-8"?><sections><section><name><![CDATA[works]]></name><title><![CDATA[Works]]></title></section></sections>',
    );
    file_put_contents(
        $this->bertaRoot . '/storage/blog.works.xml',
        '<?xml version="1.0" encoding="utf-8"?><blog section="works"><entry><id><![CDATA[5]]></id>'
        . '<mediaCacheData type="slideshow" autoplay="3">'
        . '<file type="image" src="Photo.JPG" width="500"><![CDATA[<p>Sunset</p>]]></file>'
        . '<file type="video" src="clip.mp4"/>'
        . '</mediaCacheData></entry></blog>',
    );
});

afterEach(function () {
    File::deleteDirectory($this->bertaRoot);
});

it('describes the gallery of an entry for the ai chat', function () {
    $result = (new GetEntryGalleryTool(''))->handle(new Request(['section_name' => 'works', 'entry_id' => '5']));

    expect(json_decode($result, true))->toBe([
        'settings' => ['type' => 'slideshow', 'autoplay' => '3'],
        'file_count' => 2,
        'image_count' => 1,
        'video_count' => 1,
        'files' => [
            ['type' => 'image', 'extension' => 'jpg', 'src' => 'Photo.JPG', 'caption' => '<p>Sunset</p>'],
            ['type' => 'video', 'extension' => 'mp4', 'src' => 'clip.mp4', 'caption' => ''],
        ],
    ]);
})->skip(! $pluginInstalled, 'AiAssistant plugin not installed');

it('tells the ai chat when the entry does not exist', function () {
    $result = (new GetEntryGalleryTool(''))->handle(new Request(['section_name' => 'works', 'entry_id' => '99']));

    expect($result)->toBe('Entry not found.');
})->skip(! $pluginInstalled, 'AiAssistant plugin not installed');
