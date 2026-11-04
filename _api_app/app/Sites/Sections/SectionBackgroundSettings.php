<?php

namespace App\Sites\Sections;

/**
 * The settings of a section's background gallery, as the editor's background gallery editor offers them
 * (editor/src/app/sites/sections/background-gallery-editor.component.ts), with its formats, allowed values and input
 * rules, so the server can read and check them the way SettingValueValidator checks site and design settings.
 * They are stored as attributes of the section's mediaCacheData, except those marked "on_section", which the editor
 * saves on the section itself. Defaults are what the editor and renderer use when a section has no value.
 */
class SectionBackgroundSettings
{
    /**
     * The templates that show background galleries (their names without version).
     */
    public const TEMPLATES = ['messy'];

    public const DEFINITIONS = [
        'image_size' => [
            'title' => 'Image size',
            'format' => 'select',
            'values' => ['large' => 'Large', 'medium' => 'Medium', 'small' => 'Small'],
            'default' => 'medium',
        ],
        'autoplay' => [
            'title' => 'Autoplay seconds',
            'format' => 'text',
            'validation' => 'zero_or_positive_integer',
            'default' => '0',
        ],
        'sectionBgColor' => [
            'title' => 'Background color',
            'format' => 'color',
            'allow_blank' => true,
            'on_section' => true,
        ],
        'caption_color' => [
            'title' => 'Caption text color',
            'format' => 'color',
            'allow_blank' => true,
        ],
        'caption_bg_color' => [
            'title' => 'Caption background color',
            'format' => 'color',
            'allow_blank' => true,
        ],
        'hide_navigation' => [
            'title' => 'Hide navigation arrows',
            'format' => 'toggle',
            'values' => ['yes', 'no'],
            'default' => 'no',
        ],
        'animation' => [
            'title' => 'Animation',
            'format' => 'toggle',
            'values' => ['enabled', 'disabled'],
            'default' => 'enabled',
        ],
        'fade_content' => [
            'title' => 'Fade content',
            'format' => 'toggle',
            'values' => ['enabled', 'disabled'],
            'default' => 'disabled',
        ],
    ];

    /**
     * Fields of each file: its caption. Background galleries hold images only.
     */
    public const FILE_FIELDS = [
        'caption' => [
            'title' => 'Caption',
            'format' => 'richtext',
        ],
    ];

    /**
     * Whether the template (its name, with or without version) shows background galleries.
     */
    public static function shownOn(string $template): bool
    {
        return in_array(explode('-', $template)[0], self::TEMPLATES, true);
    }
}
