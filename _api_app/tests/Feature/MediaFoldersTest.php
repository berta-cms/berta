<?php

use App\Events\SectionUpdated;
use App\Sites\Sections\Entries\SectionEntriesDataService;
use App\Sites\Sections\SiteSectionsDataService;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\File;

beforeEach(function () {
    $this->bertaRoot = sys_get_temp_dir() . '/berta_media_folders_' . uniqid();
    $this->storage = $this->bertaRoot . '/storage';
    File::ensureDirectoryExists($this->storage);
    config(['app.old_berta_root' => $this->bertaRoot]);
    linkBertaEngine($this->bertaRoot);
    writeTemplate($this->bertaRoot, 'messy');

    // "photographs" has a gallery in a folder named after another section, as on sites from older Berta versions,
    // and a background; "news" has two entries with their own folders.
    file_put_contents(
        $this->storage . '/sections.xml',
        '<?xml version="1.0" encoding="utf-8"?><sections>'
        . '<section tags_behavior="invisible" published="1" entry_count="1"><name><![CDATA[photographs]]></name><title><![CDATA[Photographs]]></title>'
        . '<mediafolder><![CDATA[photographs-background]]></mediafolder></section>'
        . '<section tags_behavior="invisible" published="1" entry_count="2"><name><![CDATA[news]]></name><title><![CDATA[News]]></title></section>'
        . '</sections>',
    );
    writeBlog($this->storage, 'photographs', ['1' => 'news1']);
    writeBlog($this->storage, 'news', ['1' => 'news2', '2' => 'news-old']);
    writeMediaFile($this->storage, 'news1/sky.jpg');
    writeMediaFile($this->storage, 'news2/sea.jpg');
    writeMediaFile($this->storage, 'news-old/field.jpg');
    writeMediaFile($this->storage, 'photographs-background/bg.jpg');

    Event::fake([SectionUpdated::class]);
});

afterEach(function () {
    File::deleteDirectory($this->bertaRoot);
});

/**
 * Writes a section's entries file, with each entry's media folder.
 *
 * @param  array<string, string>  $mediaFolders  entry id => media folder
 */
function writeBlog(string $storage, string $section, array $mediaFolders): void
{
    $entries = '';

    foreach ($mediaFolders as $id => $mediaFolder) {
        $entries .= "<entry><id><![CDATA[{$id}]]></id><uniqid><![CDATA[u{$section}{$id}]]></uniqid><mediafolder><![CDATA[{$mediaFolder}]]></mediafolder>"
            . '<mediaCacheData type="slideshow"><file type="image" src="x.jpg"><![CDATA[]]></file></mediaCacheData></entry>';
    }

    file_put_contents($storage . "/blog.{$section}.xml", "<?xml version=\"1.0\" encoding=\"utf-8\"?><blog section=\"{$section}\">{$entries}</blog>");
}

function writeMediaFile(string $storage, string $path): void
{
    File::ensureDirectoryExists(dirname($storage . '/media/' . $path));
    file_put_contents($storage . '/media/' . $path, 'image');
}

/**
 * The media folder of each entry of a section, by entry id.
 *
 * @return array<string, string>
 */
function mediaFolders(string $section): array
{
    $entries = (new SectionEntriesDataService('', $section))->get()['entry'];

    return array_combine(array_column($entries, 'id'), array_column($entries, 'mediafolder'));
}

it('copies a section into new media folders, also where a folder is not named after its section', function () {
    $copy = (new SiteSectionsDataService)->cloneSection('photographs', 'Photographs');

    $copiedFolder = mediaFolders($copy['name'])['1'];
    expect($copy['name'])->toBe('clone-of-photographs')
        ->and($copiedFolder)->not->toBe('news1')
        ->and($this->storage . "/media/{$copiedFolder}/sky.jpg")->toBeFile()
        ->and($this->storage . '/media/clone-of-photographs-background/bg.jpg')->toBeFile();

    (new SiteSectionsDataService)->delete($copy['name']);

    expect($this->storage . "/media/{$copiedFolder}")->not->toBeDirectory()
        ->and($this->storage . '/media/news1/sky.jpg')->toBeFile()
        ->and($this->storage . '/media/photographs-background/bg.jpg')->toBeFile();
});

it('moves an entry with its gallery into a folder no other gallery uses', function () {
    $moved = (new SectionEntriesDataService('', 'photographs'))->moveEntry('1', 'news');

    // news1 is still taken by the moving entry and news2 by another entry, so the copy gets news3.
    expect($moved)->not->toHaveKey('error_message')
        ->and(mediaFolders('news')['3'])->toBe('news3')
        ->and($this->storage . '/media/news3/sky.jpg')->toBeFile()
        ->and($this->storage . '/media/news1')->not->toBeDirectory()
        ->and($this->storage . '/media/news2/sea.jpg')->toBeFile();
});

it('keeps the entry and its files when the move can not copy them', function () {
    if (function_exists('posix_getuid') && posix_getuid() === 0) {
        $this->markTestSkipped('Root can write to a read-only folder.');
    }

    chmod($this->storage . '/media', 0555);

    try {
        $moved = (new SectionEntriesDataService('', 'photographs'))->moveEntry('1', 'news');
    } finally {
        chmod($this->storage . '/media', 0755);
    }

    expect($moved)->toHaveKey('error_message')
        ->and(mediaFolders('photographs'))->toBe(['1' => 'news1'])
        ->and(mediaFolders('news'))->toHaveCount(2)
        ->and($this->storage . '/media/news1/sky.jpg')->toBeFile();
});

it('names the media folders after a renamed section, one per entry', function () {
    (new SiteSectionsDataService)->saveValueByPath('/section/1/title', 'Archive');

    expect(mediaFolders('archive'))->toBe(['1' => 'archive1', '2' => 'archive2'])
        ->and($this->storage . '/media/archive1/sea.jpg')->toBeFile()
        ->and($this->storage . '/media/archive2/field.jpg')->toBeFile();
});

it('keeps an entry in its folder when the new folder name is in use', function () {
    File::ensureDirectoryExists($this->storage . '/media/archive1');

    (new SiteSectionsDataService)->saveValueByPath('/section/1/title', 'Archive');

    expect(mediaFolders('archive'))->toBe(['1' => 'news2', '2' => 'archive2'])
        ->and($this->storage . '/media/news2/sea.jpg')->toBeFile();
});

it('keeps the section name and its folders when only the title case changes', function () {
    $saved = (new SiteSectionsDataService)->saveValueByPath('/section/1/title', 'NEWS');

    expect($saved['section']['name'])->toBe('news')
        ->and($saved['section']['title'])->toBe('NEWS')
        ->and(mediaFolders('news'))->toBe(['1' => 'news2', '2' => 'news-old']);
});

it('keeps the background where it is when its folder can not be renamed', function () {
    writeMediaFile($this->storage, 'gallery-background/other.jpg');

    $saved = (new SiteSectionsDataService)->saveValueByPath('/section/0/title', 'Gallery');

    expect($saved['section']['name'])->toBe('gallery')
        ->and($saved['section']['mediafolder'])->toBe('photographs-background')
        ->and($this->storage . '/media/photographs-background/bg.jpg')->toBeFile();
});

it('keeps a media folder that another entry uses when an entry is deleted', function (string $sharingSection) {
    writeBlog($this->storage, 'news', ['1' => 'news2', '2' => 'news-old', '3' => $sharingSection === 'news' ? 'news2' : 'news1']);

    (new SectionEntriesDataService('', $sharingSection === 'news' ? 'news' : 'photographs'))->deleteEntry('1');

    expect($this->storage . ($sharingSection === 'news' ? '/media/news2/sea.jpg' : '/media/news1/sky.jpg'))->toBeFile();
})->with([
    'in the same section' => 'news',
    'in another section' => 'photographs',
]);

it('still deletes the media folder of a deleted entry that no other gallery uses', function () {
    (new SectionEntriesDataService('', 'news'))->deleteEntry('2');

    expect($this->storage . '/media/news-old')->not->toBeDirectory();
});

it('keeps media folders that other sections use when a section is deleted', function () {
    writeBlog($this->storage, 'news', ['1' => 'news2', '2' => 'news1']);

    (new SiteSectionsDataService)->delete('photographs');

    expect($this->storage . '/media/news1/sky.jpg')->toBeFile()
        ->and($this->storage . '/media/photographs-background')->not->toBeDirectory()
        ->and($this->storage . '/blog.photographs.xml')->not->toBeFile();
});

it('keeps a gallery file in a folder another gallery refers to, and still deletes one in its own folder', function () {
    // photographs entry 1 has its gallery in news1, which news entry 2 refers to as well.
    writeBlog($this->storage, 'news', ['1' => 'news2', '2' => 'news1']);
    writeMediaFile($this->storage, 'news1/x.jpg');
    writeMediaFile($this->storage, 'news2/x.jpg');

    (new SectionEntriesDataService('', 'photographs'))->galleryDelete('photographs', '1', 'x.jpg');
    (new SectionEntriesDataService('', 'news'))->galleryDelete('news', '1', 'x.jpg');

    expect($this->storage . '/media/news1/x.jpg')->toBeFile()
        ->and($this->storage . '/media/news2/x.jpg')->not->toBeFile()
        ->and((new SectionEntriesDataService('', 'photographs'))->get()['entry'][0]['mediaCacheData']['file'])->toBe([]);
});

it('keeps a background file in a folder an entry refers to, and still deletes one in its own folder', function () {
    // The news background is in news2, the folder of news entry 1.
    file_put_contents(
        $this->storage . '/sections.xml',
        '<?xml version="1.0" encoding="utf-8"?><sections>'
        . '<section tags_behavior="invisible" published="1"><name><![CDATA[photographs]]></name><title><![CDATA[Photographs]]></title>'
        . '<mediafolder><![CDATA[photographs-background]]></mediafolder><mediaCacheData><file type="image" src="bg.jpg"><![CDATA[]]></file></mediaCacheData></section>'
        . '<section tags_behavior="invisible" published="1"><name><![CDATA[news]]></name><title><![CDATA[News]]></title>'
        . '<mediafolder><![CDATA[news2]]></mediafolder><mediaCacheData><file type="image" src="sea.jpg"><![CDATA[]]></file></mediaCacheData></section>'
        . '</sections>',
    );

    (new SiteSectionsDataService)->backgroundGalleryDelete('photographs', 'bg.jpg');
    (new SiteSectionsDataService)->backgroundGalleryDelete('news', 'sea.jpg');

    expect($this->storage . '/media/photographs-background/bg.jpg')->not->toBeFile()
        ->and($this->storage . '/media/news2/sea.jpg')->toBeFile()
        ->and((new SiteSectionsDataService)->get('news')['mediaCacheData']['file'] ?? [])->toBe([]);
});

it('deletes a gallery file with its own resized copies, not those of files with similar names', function (string $gallery, string $folder) {
    file_put_contents(
        $this->storage . '/sections.xml',
        '<?xml version="1.0" encoding="utf-8"?><sections>'
        . '<section tags_behavior="invisible" published="1" entry_count="1"><name><![CDATA[photographs]]></name><title><![CDATA[Photographs]]></title>'
        . '<mediafolder><![CDATA[photographs-background]]></mediafolder><mediaCacheData><file type="image" src="x.jpg"><![CDATA[]]></file></mediaCacheData></section>'
        . '<section tags_behavior="invisible" published="1" entry_count="2"><name><![CDATA[news]]></name><title><![CDATA[News]]></title></section>'
        . '</sections>',
    );
    $copies = ['_smallthumb_x.jpg', '_bg_x.jpg', '_grid_x.jpg', '_600x400_x.jpg'];
    $others = ['ax.jpg', '_smallthumb_ax.jpg', '_600x400_ax.jpg', '_bg_x.jpg.png', 'x.jpg.png'];

    foreach (['x.jpg', ...$copies, ...$others] as $file) {
        writeMediaFile($this->storage, "{$folder}/{$file}");
    }

    if ($gallery === 'entry') {
        (new SectionEntriesDataService('', 'news'))->galleryDelete('news', '1', 'x.jpg');
    } else {
        (new SiteSectionsDataService)->backgroundGalleryDelete('photographs', 'x.jpg');
    }

    expect(array_values(array_diff(scandir($this->storage . "/media/{$folder}"), ['.', '..'])))
        ->toEqualCanonicalizing($gallery === 'entry' ? [...$others, 'sea.jpg'] : [...$others, 'bg.jpg']);
})->with([
    'entry gallery' => ['entry', 'news2'],
    'background' => ['background', 'photographs-background'],
]);

it('removes a settings image with its own resized copies only, in the shared media folder', function () {
    foreach (['logo.png', '_180x180_logo.png', '_16x16_logo.png', 'mylogo.png', '_180x180_mylogo.png', '_smallthumb_mylogo.png'] as $file) {
        writeMediaFile($this->storage, $file);
    }

    SiteSectionsDataService::removeImageWithThumbnails($this->storage . '/media', 'logo.png');

    expect(collect(['logo.png', '_180x180_logo.png', '_16x16_logo.png'])->map(fn (string $file): bool => is_file($this->storage . "/media/{$file}"))->all())
        ->toBe([false, false, false])
        ->and(collect(['mylogo.png', '_180x180_mylogo.png', '_smallthumb_mylogo.png'])->map(fn (string $file): bool => is_file($this->storage . "/media/{$file}"))->all())
        ->toBe([true, true, true]);
});

it('deletes a video with its poster image, unless another file of the gallery uses that image', function () {
    file_put_contents(
        $this->storage . '/blog.news.xml',
        '<?xml version="1.0" encoding="utf-8"?><blog section="news"><entry><id><![CDATA[1]]></id><uniqid><![CDATA[unews1]]></uniqid><mediafolder><![CDATA[news2]]></mediafolder>'
        . '<mediaCacheData type="slideshow">'
        . '<file type="video" src="a.mp4" poster_frame="a.jpg"><![CDATA[]]></file>'
        . '<file type="video" src="b.mp4" poster_frame="shared.jpg"><![CDATA[]]></file>'
        . '<file type="image" src="shared.jpg"><![CDATA[]]></file>'
        . '</mediaCacheData></entry></blog>',
    );

    foreach (['a.mp4', 'a.jpg', '_smallthumb_a.jpg', '_600x400_a.jpg', 'b.mp4', 'shared.jpg', '_smallthumb_shared.jpg'] as $file) {
        writeMediaFile($this->storage, "news2/{$file}");
    }

    (new SectionEntriesDataService('', 'news'))->galleryDelete('news', '1', 'a.mp4');
    (new SectionEntriesDataService('', 'news'))->galleryDelete('news', '1', 'b.mp4');

    expect(array_values(array_diff(scandir($this->storage . '/media/news2'), ['.', '..'])))
        ->toEqualCanonicalizing(['sea.jpg', 'shared.jpg', '_smallthumb_shared.jpg']);
});
