<?php

use App\Events\SectionUpdated;
use App\Http\Middleware\Authenticate;
use App\Http\Middleware\SetupMiddleware;
use App\Models\User;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\patchJson;
use function Pest\Laravel\withoutMiddleware;

beforeEach(function () {
    $this->bertaRoot = sys_get_temp_dir() . '/berta_positions_' . uniqid();
    File::ensureDirectoryExists($this->bertaRoot . '/storage');
    config(['app.old_berta_root' => $this->bertaRoot]);

    file_put_contents(
        $this->bertaRoot . '/storage/blog.works.xml',
        '<?xml version="1.0" encoding="utf-8"?><blog section="works">'
        . '<entry><id><![CDATA[1]]></id><content><title><![CDATA[First]]></title><positionXY><![CDATA[10,20]]></positionXY></content></entry>'
        . '<entry><id><![CDATA[2]]></id><content><positionXY><![CDATA[30,40]]></positionXY><fixed><![CDATA[1]]></fixed></content></entry>'
        . '<entry><id><![CDATA[3]]></id></entry>'
        . '</blog>',
    );

    // SetupMiddleware reconciles the real .env file on every request.
    withoutMiddleware(SetupMiddleware::class);
    Event::fake([SectionUpdated::class]);
});

afterEach(function () {
    File::deleteDirectory($this->bertaRoot);
});

function readSectionXml(string $bertaRoot): SimpleXMLElement
{
    return simplexml_load_file($bertaRoot . '/storage/blog.works.xml', 'SimpleXMLElement', LIBXML_NOCDATA);
}

// A real unauthenticated request can't run here: the guard's failure path
// logs out through the legacy engine, which isn't present in the temp root.
it('requires authentication', function () {
    $middleware = Route::getRoutes()->getByName('section_entries_positions')->gatherMiddleware();

    expect($middleware)->toContain(Authenticate::class);
});

it('saves positions of several entries in one request', function () {
    actingAs(new User);

    patchJson(route('section_entries_positions'), [
        'site' => '',
        'section' => 'works',
        'positions' => [
            ['id' => '1', 'value' => '100,200'],
            ['id' => '2', 'value' => '5,60'],
            ['id' => '3', 'value' => '0,20'],
        ],
    ])
        ->assertOk()
        ->assertExactJson([
            'site' => '',
            'section' => 'works',
            'positions' => [
                ['id' => '1', 'value' => '100,200'],
                ['id' => '2', 'value' => '5,60'],
                ['id' => '3', 'value' => '0,20'],
            ],
        ]);

    $xml = readSectionXml($this->bertaRoot);

    expect((string) $xml->entry[0]->content->positionXY)->toBe('100,200')
        ->and((string) $xml->entry[0]->content->title)->toBe('First')
        ->and((string) $xml->entry[1]->content->positionXY)->toBe('5,60')
        ->and((string) $xml->entry[2]->content->positionXY)->toBe('0,20');

    Event::assertDispatchedTimes(SectionUpdated::class, 1);
});

it('skips unknown entry ids', function () {
    actingAs(new User);

    patchJson(route('section_entries_positions'), [
        'site' => '',
        'section' => 'works',
        'positions' => [
            ['id' => '99', 'value' => '1,30'],
            ['id' => '2', 'value' => '50,50'],
        ],
    ])
        ->assertOk()
        ->assertJsonPath('positions', [['id' => '2', 'value' => '50,50']]);

    expect((string) readSectionXml($this->bertaRoot)->entry[1]->content->positionXY)->toBe('50,50');
});

it('rejects invalid position values', function (mixed $value) {
    actingAs(new User);

    patchJson(route('section_entries_positions'), [
        'site' => '',
        'section' => 'works',
        'positions' => [['id' => '1', 'value' => $value]],
    ])->assertUnprocessable()->assertJsonValidationErrors('positions.0.value');

    expect((string) readSectionXml($this->bertaRoot)->entry[0]->content->positionXY)->toBe('10,20');
})->with(['100', '10,abc', '1.5,2', '']);

it('rejects invalid entry ids', function (mixed $id) {
    actingAs(new User);

    patchJson(route('section_entries_positions'), [
        'site' => '',
        'section' => 'works',
        'positions' => [['id' => $id, 'value' => '100,200']],
    ])->assertUnprocessable()->assertJsonValidationErrors('positions.0.id');
})->with([
    'array' => [['x']],
    'non-numeric' => 'abc',
]);

it('rejects positions that put an entry off screen', function (string $value) {
    actingAs(new User);

    patchJson(route('section_entries_positions'), [
        'site' => '',
        'section' => 'works',
        'positions' => [['id' => '1', 'value' => $value]],
    ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['positions.0.value' => 'The position of entry 1 is off screen.']);

    expect((string) readSectionXml($this->bertaRoot)->entry[0]->content->positionXY)->toBe('10,20');
})->with([
    'above the entry toolbar room' => '100,19',
    'left of the page' => '-1,100',
]);

it('allows a negative left on a fixed entry', function () {
    actingAs(new User);

    patchJson(route('section_entries_positions'), [
        'site' => '',
        'section' => 'works',
        'positions' => [['id' => '2', 'value' => '-150,60']],
    ])->assertOk();

    expect((string) readSectionXml($this->bertaRoot)->entry[1]->content->positionXY)->toBe('-150,60');
});

it('saves nothing when any position in the batch is off screen', function () {
    actingAs(new User);

    patchJson(route('section_entries_positions'), [
        'site' => '',
        'section' => 'works',
        'positions' => [
            ['id' => '1', 'value' => '100,200'],
            ['id' => '3', 'value' => '-20,200'],
        ],
    ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('positions.1.value')
        ->assertJsonMissingValidationErrors('positions.0.value');

    $xml = readSectionXml($this->bertaRoot);

    expect((string) $xml->entry[0]->content->positionXY)->toBe('10,20')
        ->and((string) $xml->entry[2]->content->positionXY)->toBe('');

    Event::assertNotDispatched(SectionUpdated::class);
});

it('requires a non-empty positions list', function () {
    actingAs(new User);

    patchJson(route('section_entries_positions'), [
        'site' => '',
        'section' => 'works',
        'positions' => [],
    ])->assertUnprocessable()->assertJsonValidationErrors('positions');
});
