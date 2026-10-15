<?php

/**
 * The fonts the site, template and shop settings offer, as [CSS font-family => title], and the same
 * list with the choice to inherit the general font settings
 *
 * @return array{fonts: array<string, string>, withInherit: array<string, string>}
 */
return (static function (): array {
    $fonts = [
        'Arial, sans-serif' => 'Arial, sans-serif',
        'Helvetica, Arial, sans-serif' => 'Helvetica, Arial, sans-serif',
        '"Helvetica Neue", Helvetica, Arial, sans-serif' => 'Helvetica Neue, Helvetica, Arial, sans-serif',
        '"Arial Black", Gadget, sans-serif' => 'Arial Black, Gadget',
        '"Comic Sans MS", cursive' => 'Comic Sans MS',
        '"Courier New", Courier, monospace' => 'Courier New, Courier',
        'Georgia, "Times New Roman", Times, serif' => 'Georgia, Times New Roman, Times',
        'Impact, Charcoal, sans-serif' => 'Impact, Charcoal',
        '"Lucida Console", Monaco, monospace' => 'Lucida Console, Monaco',
        '"Lucida Sans Unicode", "Lucida Grande", sans-serif' => 'Lucida Sans Unicode, Lucida Grande',
        '"Palatino Linotype", "Book Antiqua", Palatino, serif' => 'Palatino Linotype, Book Antiqua, Palatino',
        'Tahoma, Geneva, sans-serif' => 'Tahoma, Geneva',
        '"Times New Roman", Times, serif' => 'Times New Roman, Times',
        '"Trebuchet MS", Helvetica, sans-serif' => 'Trebuchet MS, Helvetica',
        'Verdana, Geneva, sans-serif' => 'Verdana, Geneva',
    ];

    return [
        'fonts' => $fonts,
        'withInherit' => ['inherit' => '(inherit from general-font-settings)'] + $fonts,
    ];
})();
