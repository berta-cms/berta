<?php

use App\Plugins\AiAssistant\AiChatController;
use App\Plugins\AiAssistant\AiChatRequest;
use App\Plugins\AiAssistant\AssistantAgent;

use function Pest\Laravel\post;

$pluginInstalled = class_exists(AssistantAgent::class);

it('returns 401 when unauthenticated', function () {
    post(route('ai_chat'), [
        'message' => 'Make the background blue',
        'site' => '',
        'template' => 'default',
    ])->assertStatus(401);
})->skip(! $pluginInstalled, 'AiAssistant plugin not installed');

it('parses structured json response from anthropic', function () {
    AssistantAgent::fake([
        '{"reply": "Changed background to blue.", "design_changes": [{"group": "background", "setting": "backgroundColor", "value": "#0000ff"}], "settings_changes": []}',
    ]);

    $agent = new AssistantAgent('system prompt');
    $result = $agent->chat([['role' => 'user', 'content' => 'make background blue']]);

    expect($result['reply'])->toBe('Changed background to blue.')
        ->and($result['design_changes'])->toHaveCount(1)
        ->and($result['design_changes'][0]['group'])->toBe('background')
        ->and($result['design_changes'][0]['setting'])->toBe('backgroundColor')
        ->and($result['design_changes'][0]['value'])->toBe('#0000ff')
        ->and($result['settings_changes'])->toBeEmpty();
})->skip(! $pluginInstalled, 'AiAssistant plugin not installed');

it('returns empty changes when ai response has no json', function () {
    AssistantAgent::fake([
        'I cannot help with that.',
    ]);

    $agent = new AssistantAgent('system prompt');
    $result = $agent->chat([['role' => 'user', 'content' => 'hello']]);

    expect($result['reply'])->toBe('I cannot help with that.')
        ->and($result['design_changes'])->toBeEmpty()
        ->and($result['settings_changes'])->toBeEmpty();
})->skip(! $pluginInstalled, 'AiAssistant plugin not installed');

it('returns empty changes when json is embedded in prose', function () {
    AssistantAgent::fake([
        'Sure! Here is my response: {"reply": "Done!", "design_changes": [], "settings_changes": []} — let me know if you need more.',
    ]);

    $agent = new AssistantAgent('system prompt');
    $result = $agent->chat([['role' => 'user', 'content' => 'reset']]);

    expect($result['reply'])->toBe('Done!')
        ->and($result['design_changes'])->toBeEmpty()
        ->and($result['settings_changes'])->toBeEmpty();
})->skip(! $pluginInstalled, 'AiAssistant plugin not installed');

it('parses site settings changes from ai response', function () {
    AssistantAgent::fake([
        '{"reply": "Updated the page title.", "design_changes": [], "settings_changes": [{"group": "texts", "setting": "pageTitle", "value": "My Site"}]}',
    ]);

    $agent = new AssistantAgent('system prompt');
    $result = $agent->chat([['role' => 'user', 'content' => 'set the page title to My Site']]);

    expect($result['reply'])->toBe('Updated the page title.')
        ->and($result['design_changes'])->toBeEmpty()
        ->and($result['settings_changes'])->toHaveCount(1)
        ->and($result['settings_changes'][0]['group'])->toBe('texts')
        ->and($result['settings_changes'][0]['setting'])->toBe('pageTitle')
        ->and($result['settings_changes'][0]['value'])->toBe('My Site');
})->skip(! $pluginInstalled, 'AiAssistant plugin not installed');

it('parses is_undo from ai response', function () {
    AssistantAgent::fake([
        '{"reply": "Reverted font size.", "is_undo": true, "design_changes": [{"group": "bodyText", "setting": "fontSize", "value": "12px"}], "settings_changes": []}',
    ]);

    $agent = new AssistantAgent('system prompt');
    $result = $agent->chat([['role' => 'user', 'content' => 'undo']]);

    expect($result['is_undo'])->toBeTrue()
        ->and($result['reply'])->toBe('Reverted font size.')
        ->and($result['design_changes'])->toHaveCount(1)
        ->and($result['design_changes'][0]['value'])->toBe('12px');
})->skip(! $pluginInstalled, 'AiAssistant plugin not installed');

it('enriches changes with previous_value', function () {
    $controller = new AiChatController;
    $method = new ReflectionMethod($controller, 'enrichChangesWithPreviousValues');

    $changes = [
        ['group' => 'bodyText', 'setting' => 'fontSize', 'value' => '16px'],
        ['group' => 'bodyText', 'setting' => 'fontFamily', 'value' => 'Arial'],
    ];
    $currentSettings = [
        'bodyText' => ['fontSize' => '12px'],
    ];

    $result = $method->invoke($controller, $changes, $currentSettings);

    expect($result[0]['previous_value'])->toBe('12px')
        ->and($result[1]['previous_value'])->toBeNull();
})->skip(! $pluginInstalled, 'AiAssistant plugin not installed');

it('includes change history in system prompt', function () {
    $controller = new AiChatController;
    $method = new ReflectionMethod($controller, 'buildChangeHistorySection');

    $changeHistory = [
        [
            'user_message' => 'make the font bigger',
            'design_changes' => [
                ['group' => 'bodyText', 'setting' => 'fontSize', 'value' => '16px', 'previous_value' => '12px'],
            ],
            'settings_changes' => [],
        ],
        [
            'user_message' => 'make background dark',
            'design_changes' => [
                ['group' => 'background', 'setting' => 'backgroundColor', 'value' => '#000000', 'previous_value' => '#ffffff'],
            ],
            'settings_changes' => [],
        ],
    ];

    $result = $method->invoke($controller, $changeHistory);

    expect($result)
        ->toContain('Change History')
        ->toContain('make the font bigger')
        ->toContain('bodyText > fontSize')
        ->toContain('"12px" → "16px"')
        ->toContain('make background dark')
        ->toContain('background > backgroundColor')
        ->toContain('"#ffffff" → "#000000"');
})->skip(! $pluginInstalled, 'AiAssistant plugin not installed');

it('omits change history section when history is empty', function () {
    $controller = new AiChatController;
    $method = new ReflectionMethod($controller, 'buildChangeHistorySection');

    $result = $method->invoke($controller, []);

    expect($result)->toBe('');
})->skip(! $pluginInstalled, 'AiAssistant plugin not installed');

it('parses entry_changes from ai response', function () {
    AssistantAgent::fake([
        '{"reply": "Created an entry.", "is_undo": false, "design_changes": [], "settings_changes": [], "section_changes": [], "entry_changes": [{"operation": "create", "section": "blog", "description": "<p>Hello world</p>"}]}',
    ]);

    $agent = new AssistantAgent('system prompt');
    $result = $agent->chat([['role' => 'user', 'content' => 'add an entry to blog']]);

    expect($result['entry_changes'])->toHaveCount(1)
        ->and($result['entry_changes'][0]['operation'])->toBe('create')
        ->and($result['entry_changes'][0]['section'])->toBe('blog')
        ->and($result['entry_changes'][0]['description'])->toBe('<p>Hello world</p>');
})->skip(! $pluginInstalled, 'AiAssistant plugin not installed');

it('returns empty entry_changes when not in ai response', function () {
    AssistantAgent::fake([
        '{"reply": "Done.", "design_changes": [], "settings_changes": [], "section_changes": []}',
    ]);

    $agent = new AssistantAgent('system prompt');
    $result = $agent->chat([['role' => 'user', 'content' => 'hello']]);

    expect($result['entry_changes'])->toBeArray()->toBeEmpty();
})->skip(! $pluginInstalled, 'AiAssistant plugin not installed');

it('includes entry changes in change history section', function () {
    $controller = new AiChatController;
    $method = new ReflectionMethod($controller, 'buildChangeHistorySection');

    $changeHistory = [
        [
            'user_message' => 'add an entry',
            'design_changes' => [],
            'settings_changes' => [],
            'section_changes' => [],
            'entry_changes' => [
                ['operation' => 'create', 'section' => 'blog', 'entry_id' => '5', 'description' => '<p>Hello</p>'],
            ],
        ],
        [
            'user_message' => 'update entry description',
            'design_changes' => [],
            'settings_changes' => [],
            'section_changes' => [],
            'entry_changes' => [
                ['operation' => 'update', 'section' => 'blog', 'entry_id' => '5', 'value' => '<p>New</p>', 'previous_value' => '<p>Old</p>'],
            ],
        ],
    ];

    $result = $method->invoke($controller, $changeHistory);

    expect($result)
        ->toContain('add an entry')
        ->toContain('entry: create #5 in "blog"')
        ->toContain('undo: delete entry 5')
        ->toContain('update entry description')
        ->toContain('entry: update #5 in "blog"')
        ->toContain('Old')
        ->toContain('New');
})->skip(! $pluginInstalled, 'AiAssistant plugin not installed');

it('restricts change_history entry_changes operation to create and update', function () {
    $request = new AiChatRequest;
    $rules = $request->rules();

    expect($rules['change_history.*.entry_changes.*.operation'])
        ->toContain('in:create,update');
})->skip(! $pluginInstalled, 'AiAssistant plugin not installed');

it('includes entries section in system prompt', function () {
    $controller = new AiChatController;
    $method = new ReflectionMethod($controller, 'buildEntriesSection');

    $result = $method->invoke($controller);

    expect($result)
        ->toContain('Entries')
        ->toContain('list_section_entries')
        ->toContain('get_entry_content')
        ->toContain('description')
        ->toContain('delete')
        ->toContain('manually');
})->skip(! $pluginInstalled, 'AiAssistant plugin not installed');

it('includes help articles in system prompt', function () {
    $controller = new AiChatController;
    $method = new ReflectionMethod($controller, 'buildHelpArticlesSection');

    $result = $method->invoke($controller);

    expect($result)
        ->toContain('Help Articles')
        ->toContain('How to Add a Video')
        ->toContain('https://support.berta.me/en/frequently-asked-questions/how-to-add-a-video')
        ->toContain('support.berta.me')
        ->toContain('Domains')
        ->toContain('SSL Certificates and HTTPS');
})->skip(! $pluginInstalled, 'AiAssistant plugin not installed');

it('parses gallery_changes from ai response', function () {
    AssistantAgent::fake([
        '{"reply": "Updated gallery type.", "is_undo": false, "design_changes": [], "settings_changes": [], "section_changes": [], "entry_changes": [], "gallery_changes": [{"operation": "update_setting", "section": "portfolio", "entry_id": "3", "setting": "type", "value": "row"}]}',
    ]);

    $agent = new AssistantAgent('system prompt');
    $result = $agent->chat([['role' => 'user', 'content' => 'change gallery to row']]);

    expect($result['gallery_changes'])->toHaveCount(1)
        ->and($result['gallery_changes'][0]['operation'])->toBe('update_setting')
        ->and($result['gallery_changes'][0]['section'])->toBe('portfolio')
        ->and($result['gallery_changes'][0]['entry_id'])->toBe('3')
        ->and($result['gallery_changes'][0]['setting'])->toBe('type')
        ->and($result['gallery_changes'][0]['value'])->toBe('row');
})->skip(! $pluginInstalled, 'AiAssistant plugin not installed');

it('returns empty gallery_changes when not in ai response', function () {
    AssistantAgent::fake([
        '{"reply": "Done.", "design_changes": [], "settings_changes": [], "section_changes": []}',
    ]);

    $agent = new AssistantAgent('system prompt');
    $result = $agent->chat([['role' => 'user', 'content' => 'hello']]);

    expect($result['gallery_changes'])->toBeArray()->toBeEmpty();
})->skip(! $pluginInstalled, 'AiAssistant plugin not installed');

it('includes gallery changes in change history section', function () {
    $controller = new AiChatController;
    $method = new ReflectionMethod($controller, 'buildChangeHistorySection');

    $changeHistory = [
        [
            'user_message' => 'change gallery to row',
            'design_changes' => [],
            'settings_changes' => [],
            'section_changes' => [],
            'entry_changes' => [],
            'gallery_changes' => [
                ['operation' => 'update_setting', 'section' => 'portfolio', 'entry_id' => '3', 'setting' => 'type', 'value' => 'row', 'previous_value' => 'slideshow'],
            ],
        ],
        [
            'user_message' => 'update image caption',
            'design_changes' => [],
            'settings_changes' => [],
            'section_changes' => [],
            'entry_changes' => [],
            'gallery_changes' => [
                ['operation' => 'update_caption', 'section' => 'portfolio', 'entry_id' => '3', 'file_index' => 0, 'value' => '<p>New caption</p>', 'previous_value' => '<p>Old caption</p>'],
            ],
        ],
    ];

    $result = $method->invoke($controller, $changeHistory);

    expect($result)
        ->toContain('gallery: update_setting entry #3 in "portfolio"')
        ->toContain('"slideshow" → "row"')
        ->toContain('gallery: update_caption entry #3 in "portfolio" file[0]')
        ->toContain('"Old caption" → "New caption"');
})->skip(! $pluginInstalled, 'AiAssistant plugin not installed');

it('restricts change_history gallery_changes operation to update_setting and update_caption', function () {
    $request = new AiChatRequest;
    $rules = $request->rules();

    expect($rules['change_history.*.gallery_changes.*.operation'])
        ->toContain('in:update_setting,update_caption');
})->skip(! $pluginInstalled, 'AiAssistant plugin not installed');

it('includes galleries section in system prompt', function () {
    $controller = new AiChatController;
    $method = new ReflectionMethod($controller, 'buildGalleriesSection');

    $result = $method->invoke($controller);

    expect($result)
        ->toContain('Galleries')
        ->toContain('get_entry_gallery')
        ->toContain('update_setting')
        ->toContain('update_caption')
        ->toContain('slideshow')
        ->toContain('fullscreen')
        ->toContain('file_index')
        ->toContain('manual');
})->skip(! $pluginInstalled, 'AiAssistant plugin not installed');
