<?php

use App\Http\Middleware\SetupMiddleware;
use App\Models\User;
use App\Plugins\AiAssistant\Mcp\BertaSiteServer;
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
