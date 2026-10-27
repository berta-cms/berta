<?php

use App\Configuration\SettingValueValidator;

it('accepts values the editor accepts', function (string $value, array $definition) {
    expect((new SettingValueValidator([]))->error($value, $definition))->toBeNull();
})->with([
    'select value' => ['bold', ['format' => 'select', 'values' => ['normal', 'bold']]],
    'font by its CSS value' => ['"Comic Sans MS", cursive', ['format' => 'fontselect', 'values' => ['"Comic Sans MS", cursive' => 'Comic Sans MS']]],
    'hex color' => ['#00ff00', ['format' => 'color']],
    'short hex color' => ['#0f0', ['format' => 'color']],
    'rgb color' => ['rgb(0, 44, 255)', ['format' => 'color']],
    'color picker rgba' => ['rgba(0,0,0,0.5)', ['format' => 'color']],
    'css units' => ['12px', ['format' => 'text', 'css_units' => true]],
    'percent' => ['50%', ['format' => 'text', 'css_units' => true]],
    'blank when allowed' => ['', ['format' => 'text', 'allow_blank' => true]],
    'positive integer' => ['3', ['format' => 'text', 'validation' => 'positive_integer']],
    'zero' => ['0', ['format' => 'text', 'validation' => 'zero_or_positive_integer']],
    'positive number' => ['1.5', ['format' => 'text', 'validation' => 'positive_number']],
    'email' => ['me@example.com', ['format' => 'text', 'validation' => 'email']],
    // The editor doesn't validate these inputs either.
    'blank long text' => ['', ['format' => 'longtext']],
    'any url' => ['example.com', ['format' => 'url']],
    'image file name' => ['photo.jpg', ['format' => 'image']],
]);

it('refuses values the editor refuses', function (string $value, array $definition, string $error) {
    expect((new SettingValueValidator([]))->error($value, $definition))->toContain($error);
})->with([
    'value not allowed' => ['heavy', ['format' => 'select', 'values' => ['normal', 'bold']], 'normal | bold'],
    'font by its name' => ['Comic Sans MS', ['format' => 'fontselect', 'values' => ['"Comic Sans MS", cursive' => 'Comic Sans MS']], 'allowed values'],
    'not a color' => ['red', ['format' => 'color'], 'color'],
    'missing css unit' => ['12', ['format' => 'text', 'css_units' => true], 'CSS unit'],
    'blank' => ['', ['format' => 'text'], 'can\'t be empty'],
    'not a positive integer' => ['0', ['format' => 'text', 'validation' => 'positive_integer'], 'positive whole number'],
    'not an email' => ['me@', ['format' => 'text', 'validation' => 'email'], 'email'],
]);

it('allows settings that need a plan feature only when the plan includes it', function () {
    $definition = ['format' => 'longtext', 'requires_feature' => 'custom_javascript'];

    expect((new SettingValueValidator(['custom_javascript']))->error('<script></script>', $definition))->toBeNull()
        ->and((new SettingValueValidator(['multisite']))->error('<script></script>', $definition))->toContain('custom_javascript feature');
});

it('leaves paths without a definition and non-text values to the data service', function (mixed $value, mixed $definition) {
    expect((new SettingValueValidator([]))->errorFor($value, $definition))->toBeNull();
})->with([
    'no definition' => ['anything', null],
    'list value' => [['url' => 'x'], ['format' => 'text']],
]);
