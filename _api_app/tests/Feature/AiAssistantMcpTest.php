<?php

use App\Http\Middleware\SetupMiddleware;
use App\Models\User;
use App\Plugins\AiAssistant\Mcp\BertaSiteServer;
use App\Plugins\AiAssistant\Mcp\Tools\GetEntryGalleryTool;
use App\Plugins\AiAssistant\Mcp\Tools\GetSiteSettingsTool;
use App\Plugins\AiAssistant\Mcp\Tools\ListEntriesTool;
use App\Plugins\AiAssistant\Mcp\Tools\ListSectionsTool;
use Firebase\JWT\JWT;
use Illuminate\Support\Facades\File;
use Illuminate\Testing\Fluent\AssertableJson;

use function Pest\Laravel\postJson;
use function Pest\Laravel\withoutMiddleware;

$pluginInstalled = class_exists(BertaSiteServer::class);

it('returns 401 for mcp requests without a token', function () {
    postJson('/v1/plugin/ai/mcp', ['jsonrpc' => '2.0', 'id' => 1, 'method' => 'ping'])
        ->assertStatus(401);
})->skip(! $pluginInstalled, 'AiAssistant plugin not installed');

it('accepts mcp requests with a site jwt in the X-Authorization header', function () {
    $token = JWT::encode(['iat' => time(), 'exp' => time() + 300, 'uid' => 1], config('app.key'), 'HS256');

    postJson('/v1/plugin/ai/mcp', ['jsonrpc' => '2.0', 'id' => 1, 'method' => 'ping'], ['X-Authorization' => "Bearer {$token}"])
        ->assertOk()
        ->assertJsonPath('id', 1);
})->skip(! $pluginInstalled, 'AiAssistant plugin not installed');

describe('list-sections tool', function () {
    beforeEach(function () {
        $this->bertaRoot = sys_get_temp_dir() . '/berta_mcp_' . uniqid();
        File::ensureDirectoryExists($this->bertaRoot . '/storage');
        config(['app.old_berta_root' => $this->bertaRoot]);

        // SetupMiddleware reconciles the real .env file on every request.
        withoutMiddleware(SetupMiddleware::class);
    });

    afterEach(function () {
        File::deleteDirectory($this->bertaRoot);
    });

    // Normalization cases are covered in SiteContentReaderTest.
    it('returns the main site sections as structured content', function () {
        file_put_contents(
            $this->bertaRoot . '/storage/sections.xml',
            '<?xml version="1.0" encoding="utf-8"?><sections>'
            . '<section published="1" type="shop" entry_count="2"><name><![CDATA[shop]]></name><title><![CDATA[Shop]]></title></section>'
            . '</sections>',
        );

        BertaSiteServer::actingAs(new User)
            ->tool(ListSectionsTool::class)
            ->assertOk()
            // The hosting gateway calls the tool by this name.
            ->assertName('list-sections')
            ->assertStructuredContent(fn (AssertableJson $json) => $json->where('sections', [[
                'name' => 'shop', 'title' => 'Shop', 'type' => 'shop', 'published' => true, 'entry_count' => 2, 'order' => 0,
                'seo' => ['title' => '', 'keywords' => '', 'description' => ''],
            ]]));
    });
})->skip(! $pluginInstalled, 'AiAssistant plugin not installed');

describe('list-entries tool', function () {
    beforeEach(function () {
        $this->bertaRoot = sys_get_temp_dir() . '/berta_mcp_' . uniqid();
        File::ensureDirectoryExists($this->bertaRoot . '/storage');
        config(['app.old_berta_root' => $this->bertaRoot]);
        // The default template shows entry titles; the title rule is covered in SiteContentReaderTest.
        linkBertaEngine($this->bertaRoot);
        writeTemplate($this->bertaRoot, 'default');
        file_put_contents(
            $this->bertaRoot . '/storage/sections.xml',
            '<?xml version="1.0" encoding="utf-8"?><sections><section><name><![CDATA[works]]></name><title><![CDATA[Works]]></title></section></sections>',
        );

        // SetupMiddleware reconciles the real .env file on every request.
        withoutMiddleware(SetupMiddleware::class);
    });

    afterEach(function () {
        File::deleteDirectory($this->bertaRoot);
    });

    // Normalization cases are covered in SiteContentReaderTest.
    it('returns the entries of a section as structured content', function () {
        file_put_contents(
            $this->bertaRoot . '/storage/blog.works.xml',
            '<?xml version="1.0" encoding="utf-8"?><blog section="works"><entry><id><![CDATA[1]]></id>'
            . '<content><title><![CDATA[First]]></title><description><![CDATA[<p>Hello</p>]]></description></content></entry></blog>',
        );

        BertaSiteServer::actingAs(new User)
            ->tool(ListEntriesTool::class, ['section' => 'works'])
            ->assertOk()
            // The hosting gateway calls the tool by this name.
            ->assertName('list-entries')
            ->assertStructuredContent(fn (AssertableJson $json) => $json
                ->where('section', 'works')
                ->where('entry_titles', true)
                ->where('entries', [[
                    'id' => '1', 'title' => 'First', 'description' => '<p>Hello</p>', 'order' => 0,
                    'gallery' => ['type' => null, 'file_count' => 0, 'image_count' => 0, 'video_count' => 0],
                ]]));
    });

    it('rejects sections that do not exist', function () {
        BertaSiteServer::actingAs(new User)
            ->tool(ListEntriesTool::class, ['section' => '../sections'])
            ->assertHasErrors(['Section "../sections" not found. Call list-sections to see the sections.']);
    });

    it('requires the section argument', function () {
        BertaSiteServer::actingAs(new User)
            ->tool(ListEntriesTool::class, [])
            ->assertHasErrors(['Provide the section name. Call list-sections to see the sections.']);
    });
})->skip(! $pluginInstalled, 'AiAssistant plugin not installed');

describe('get-entry-gallery tool', function () {
    beforeEach(function () {
        $this->bertaRoot = sys_get_temp_dir() . '/berta_mcp_' . uniqid();
        File::ensureDirectoryExists($this->bertaRoot . '/storage');
        config(['app.old_berta_root' => $this->bertaRoot]);
        file_put_contents(
            $this->bertaRoot . '/storage/sections.xml',
            '<?xml version="1.0" encoding="utf-8"?><sections><section><name><![CDATA[works]]></name><title><![CDATA[Works]]></title></section></sections>',
        );
        file_put_contents(
            $this->bertaRoot . '/storage/blog.works.xml',
            '<?xml version="1.0" encoding="utf-8"?><blog section="works"><entry><id><![CDATA[5]]></id>'
            . '<mediaCacheData type="row"><file type="image" src="a.jpg"><![CDATA[Caption]]></file></mediaCacheData></entry></blog>',
        );

        // SetupMiddleware reconciles the real .env file on every request.
        withoutMiddleware(SetupMiddleware::class);
    });

    afterEach(function () {
        File::deleteDirectory($this->bertaRoot);
    });

    // Gallery normalization is covered in SiteContentReaderTest and GetEntryGalleryToolTest.
    it('returns the gallery of an entry as structured content', function () {
        BertaSiteServer::actingAs(new User)
            ->tool(GetEntryGalleryTool::class, ['section' => 'works', 'entry_id' => '5'])
            ->assertOk()
            // The hosting gateway offers the tool under this name.
            ->assertName('get-entry-gallery')
            ->assertStructuredContent([
                'section' => 'works',
                'entry_id' => '5',
                'settings' => ['type' => 'row'],
                'file_count' => 1,
                'image_count' => 1,
                'video_count' => 0,
                'files' => [['type' => 'image', 'extension' => 'jpg', 'src' => 'a.jpg', 'caption' => 'Caption']],
            ]);
    });

    it('rejects unknown sections and entries', function (array $arguments, string $error) {
        BertaSiteServer::actingAs(new User)
            ->tool(GetEntryGalleryTool::class, $arguments)
            ->assertHasErrors([$error]);
    })->with([
        'unknown section' => [['section' => '../sections', 'entry_id' => '5'], 'Section "../sections" not found. Call list-sections to see the sections.'],
        'unknown entry' => [['section' => 'works', 'entry_id' => '99'], 'Entry "99" not found in section "works". Call list-entries to see the entries.'],
    ]);

    it('requires the section and entry', function () {
        BertaSiteServer::actingAs(new User)
            ->tool(GetEntryGalleryTool::class, [])
            ->assertHasErrors([
                'Provide the section name. Call list-sections to see the sections.',
                'Provide the entry ID. Call list-entries to see the entries of the section.',
            ]);
    });
})->skip(! $pluginInstalled, 'AiAssistant plugin not installed');

describe('get-site-settings tool', function () {
    beforeEach(function () {
        $this->bertaRoot = sys_get_temp_dir() . '/berta_mcp_' . uniqid();
        File::ensureDirectoryExists($this->bertaRoot . '/storage');
        config(['app.old_berta_root' => $this->bertaRoot]);
        linkBertaEngine($this->bertaRoot);
        file_put_contents(
            $this->bertaRoot . '/storage/settings.xml',
            '<?xml version="1.0" encoding="utf-8"?><settings><berta><installed><![CDATA[1]]></installed></berta><texts><pageTitle><![CDATA[My site]]></pageTitle></texts></settings>',
        );

        // SetupMiddleware reconciles the real .env file on every request.
        withoutMiddleware(SetupMiddleware::class);
    });

    afterEach(function () {
        File::deleteDirectory($this->bertaRoot);
    });

    // Settings normalization is covered in SiteContentReaderTest.
    it('returns the site settings as structured content', function () {
        BertaSiteServer::actingAs(new User)
            ->tool(GetSiteSettingsTool::class)
            ->assertOk()
            // The hosting gateway offers the tool under this name.
            ->assertName('get-site-settings')
            ->assertStructuredContent(fn (AssertableJson $json) => $json->where(
                'groups',
                fn ($groups) => $groups->pluck('name')->doesntContain('berta')
                    && collect($groups->firstWhere('name', 'texts')['settings'])->firstWhere('key', 'pageTitle')['value'] === 'My site',
            ));
    });
})->skip(! $pluginInstalled, 'AiAssistant plugin not installed');
