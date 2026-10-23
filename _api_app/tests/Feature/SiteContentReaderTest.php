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

describe('entries', function () {
    beforeEach(function () {
        // Site settings (for the template) read the engine's setting definitions.
        linkBertaEngine($this->bertaRoot);
        writeTemplate($this->bertaRoot, 'default');
        file_put_contents(
            $this->bertaRoot . '/storage/sections.xml',
            '<?xml version="1.0" encoding="utf-8"?><sections><section><name><![CDATA[works]]></name><title><![CDATA[Works]]></title></section></sections>',
        );
    });

    it('normalizes entries of a section', function () {
        file_put_contents(
            $this->bertaRoot . '/storage/blog.works.xml',
            '<?xml version="1.0" encoding="utf-8"?><blog section="works">'
            . '<entry><id><![CDATA[7]]></id>'
            . '<mediaCacheData type="row"><file type="image" src="a.jpg"/><file type="video" src="b.mp4"/></mediaCacheData>'
            . '<content><title><![CDATA[Series]]></title><description><![CDATA[<p>Text</p>]]></description></content></entry>'
            . '<entry><id><![CDATA[8]]></id><mediaCacheData type="slideshow"></mediaCacheData><content></content></entry>'
            . '</blog>',
        );

        expect((new SiteContentReader)->entries('works'))->toBe([
            [
                'id' => '7', 'title' => 'Series', 'description' => '<p>Text</p>', 'order' => 0,
                'gallery' => ['type' => 'row', 'file_count' => 2, 'image_count' => 1, 'video_count' => 1],
            ],
            [
                'id' => '8', 'title' => '', 'description' => '', 'order' => 1,
                'gallery' => ['type' => 'slideshow', 'file_count' => 0, 'image_count' => 0, 'video_count' => 0],
            ],
        ]);
    });

    it('leaves out entry titles where the template does not show them', function () {
        writeTemplate($this->bertaRoot, 'messy-0.4.2');
        file_put_contents(
            $this->bertaRoot . '/storage/blog.works.xml',
            '<?xml version="1.0" encoding="utf-8"?><blog section="works"><entry><id><![CDATA[1]]></id><content><title><![CDATA[Hidden]]></title></content></entry></blog>',
        );

        $reader = new SiteContentReader;

        expect($reader->showsEntryTitles('works'))->toBeFalse()
            ->and($reader->entries('works')[0])->not->toHaveKey('title');
    });

    it('keeps entry titles in portfolio sections on any template', function () {
        writeTemplate($this->bertaRoot, 'messy-0.4.2');
        file_put_contents(
            $this->bertaRoot . '/storage/sections.xml',
            '<?xml version="1.0" encoding="utf-8"?><sections><section type="portfolio"><name><![CDATA[works]]></name><title><![CDATA[Works]]></title></section></sections>',
        );
        file_put_contents(
            $this->bertaRoot . '/storage/blog.works.xml',
            '<?xml version="1.0" encoding="utf-8"?><blog section="works"><entry><id><![CDATA[1]]></id><content><title><![CDATA[Project]]></title></content></entry></blog>',
        );

        $reader = new SiteContentReader;

        expect($reader->showsEntryTitles('works'))->toBeTrue()
            ->and($reader->entries('works')[0]['title'])->toBe('Project');
    });

    it('knows which sections exist', function () {
        $reader = new SiteContentReader;

        expect($reader->hasSection('works'))->toBeTrue()
            ->and($reader->hasSection('missing'))->toBeFalse()
            ->and($reader->showsEntryTitles('missing'))->toBeFalse();
    });

    it('reads no entries for sections that do not exist', function (string $section) {
        file_put_contents($this->bertaRoot . '/storage/blog.missing.xml', '<?xml version="1.0" encoding="utf-8"?><blog><entry><id>1</id></entry></blog>');

        expect((new SiteContentReader)->entries($section))->toBe([]);
    })->with(['missing', '../storage/blog.missing', '']);
})->skip(! $pluginInstalled, 'AiAssistant plugin not installed');

// File type, extension and caption normalization is pinned in GetEntryGalleryToolTest.
describe('entry gallery', function () {
    beforeEach(function () {
        file_put_contents(
            $this->bertaRoot . '/storage/sections.xml',
            '<?xml version="1.0" encoding="utf-8"?><sections><section><name><![CDATA[works]]></name><title><![CDATA[Works]]></title></section></sections>',
        );
        file_put_contents(
            $this->bertaRoot . '/storage/blog.works.xml',
            '<?xml version="1.0" encoding="utf-8"?><blog section="works">'
            . '<entry><id><![CDATA[1]]></id><mediaCacheData type="row"><file src="untyped.png"/></mediaCacheData></entry>'
            . '<entry><id><![CDATA[2]]></id><content></content></entry>'
            . '</blog>',
        );
    });

    it('treats files without a type as images', function () {
        $gallery = (new SiteContentReader)->entryGallery('works', '1');

        expect($gallery['files'])->toBe([['type' => 'image', 'extension' => 'png', 'src' => 'untyped.png', 'caption' => '']])
            ->and($gallery['image_count'])->toBe(1);
    });

    it('describes an entry without gallery as empty', function () {
        expect((new SiteContentReader)->entryGallery('works', '2'))->toBe([
            'settings' => [], 'file_count' => 0, 'image_count' => 0, 'video_count' => 0, 'files' => [],
        ]);
    });

    it('finds no gallery for unknown sections or entries', function (string $section, string $entryId) {
        expect((new SiteContentReader)->entryGallery($section, $entryId))->toBeNull();
    })->with([
        'unknown entry' => ['works', '99'],
        'unknown section' => ['missing', '1'],
        'path outside storage' => ['../storage/blog.works', '1'],
    ]);
})->skip(! $pluginInstalled, 'AiAssistant plugin not installed');
