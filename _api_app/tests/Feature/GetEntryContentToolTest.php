<?php

use App\Plugins\AiAssistant\Tools\GetEntryContentTool;
use Illuminate\Support\Facades\File;
use Laravel\Ai\Tools\Request;

$pluginInstalled = class_exists(GetEntryContentTool::class);

beforeEach(function () {
    $this->bertaRoot = sys_get_temp_dir() . '/berta_chat_content_' . uniqid();
    File::ensureDirectoryExists($this->bertaRoot . '/storage');
    config(['app.old_berta_root' => $this->bertaRoot]);
    // The default template shows entry titles.
    linkBertaEngine($this->bertaRoot);
    writeTemplate($this->bertaRoot, 'default');
    file_put_contents(
        $this->bertaRoot . '/storage/sections.xml',
        '<?xml version="1.0" encoding="utf-8"?><sections><section><name><![CDATA[works]]></name><title><![CDATA[Works]]></title></section></sections>',
    );
    file_put_contents(
        $this->bertaRoot . '/storage/blog.works.xml',
        '<?xml version="1.0" encoding="utf-8"?><blog section="works">'
        . '<entry><id><![CDATA[1]]></id><content><title><![CDATA[First]]></title></content></entry>'
        . '<entry><id><![CDATA[2]]></id><content><title><![CDATA[Second]]></title><description><![CDATA[<p>Hello</p>]]></description></content></entry>'
        . '</blog>',
    );
});

afterEach(function () {
    File::deleteDirectory($this->bertaRoot);
});

it('returns the content of an entry for the ai chat', function () {
    $result = (new GetEntryContentTool(''))->handle(new Request(['section_name' => 'works', 'entry_id' => '2']));

    expect(json_decode($result, true))->toBe([
        'id' => '2', 'title' => 'Second', 'description' => '<p>Hello</p>', 'order' => 1,
    ]);
})->skip(! $pluginInstalled, 'AiAssistant plugin not installed');

it('tells the ai chat when the entry does not exist', function () {
    $result = (new GetEntryContentTool(''))->handle(new Request(['section_name' => 'works', 'entry_id' => '99']));

    expect($result)->toBe('Entry not found.');
})->skip(! $pluginInstalled, 'AiAssistant plugin not installed');

it('leaves out the title where the template has no entry titles', function () {
    writeTemplate($this->bertaRoot, 'messy-0.4.2');

    $result = (new GetEntryContentTool(''))->handle(new Request(['section_name' => 'works', 'entry_id' => '2']));

    expect(json_decode($result, true))->toBe(['id' => '2', 'description' => '<p>Hello</p>', 'order' => 1]);
})->skip(! $pluginInstalled, 'AiAssistant plugin not installed');
