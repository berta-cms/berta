<?php

use App\Shared\Helpers;

it('slugifies the text string', function () {
    $string = 'Hello World';
    $result = Helpers::slugify($string);
    expect($result)->toBe('hello-world');
});

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
