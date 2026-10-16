<?php

use App\Shared\Helpers;

it('slugifies the text string', function () {
    $string = 'Hello World';
    $result = Helpers::slugify($string);
    expect($result)->toBe('hello-world');
});

it('gives a page its address ending in a slash', function (array $urlParts, bool $isPreviewMode, string $path) {
    expect(Helpers::sitePath($urlParts, $isPreviewMode))->toBe($path);
})->with([
    'the front page' => [[], false, '/'],
    'a section' => [['section' => 'about'], false, '/about/'],
    'a tag of a multisite section' => [['site' => 'second', 'section' => 'blog', 'tag' => 'news'], false, '/second/blog/news/'],
    'a preview' => [['section' => 'about'], true, '/about/?preview=1'],
    'the front page preview' => [[], true, '/?preview=1'],
]);

it('converts an array to html attributes string', function () {
    $array = [
        'class' => 'btn btn-primary',
        'id' => 'submit',
    ];
    $result = Helpers::arrayToHtmlAttributes($array);
    expect($result)->toBe(' class="btn btn-primary" id="submit"');
});

it('converts an array to html attributes string and skipping empty records', function () {
    $array = [
        'data' => '',
        'class' => 'btn btn-primary',
        'id' => 'submit',
        'test' => null,
    ];
    $result = Helpers::arrayToHtmlAttributes($array);
    expect($result)->toBe(' class="btn btn-primary" id="submit"');
});

it('converts an array to html attributes string and return empty string if no attributes', function () {
    $array = [
        'data' => '',
        'test' => null,
    ];
    $result = Helpers::arrayToHtmlAttributes($array);
    expect($result)->toBe('');
});
