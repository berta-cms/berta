<?php

namespace App\Sites\Sections\Entries\Galleries;

/**
 * The settings of an entry gallery and its files, as the editor's gallery editor offers them
 * (editor/src/app/sites/media/entry-gallery-editor.component.ts), with its formats, allowed values and input rules,
 * so the server can read and check them the way SettingValueValidator checks site and design settings.
 * Gallery settings are stored as attributes of the entry's mediaCacheData, file fields on each file.
 * "types" lists the gallery types the editor shows a setting for (none: every type), "templates" the templates.
 * Defaults are what the renderers use when a gallery has no value.
 */
class EntryGallerySettings
{
    public const DEFINITIONS = [
        'type' => [
            'title' => 'Gallery type',
            'format' => 'select',
            'values' => ['slideshow' => 'Slideshow', 'row' => 'Row', 'column' => 'Column', 'pile' => 'Pile', 'link' => 'Link', 'grid' => 'Grid'],
        ],
        'autoplay' => [
            'title' => 'Autoplay seconds',
            'format' => 'text',
            'validation' => 'zero_or_positive_integer',
            'default' => '0',
            'types' => ['slideshow'],
        ],
        'slide_numbers_visible' => [
            'title' => 'Show image numbers',
            'format' => 'toggle',
            'values' => ['yes', 'no'],
            'types' => ['slideshow'],
        ],
        'gallery_width_by_widest_slide' => [
            'title' => 'Width by widest slide',
            'format' => 'toggle',
            'values' => ['yes', 'no'],
            'default' => 'no',
            'types' => ['slideshow'],
            'templates' => ['messy'],
        ],
        'row_gallery_padding' => [
            'title' => 'Image padding',
            'format' => 'text',
            'types' => ['row'],
        ],
        'link_address' => [
            'title' => 'Link address',
            'format' => 'url',
            'types' => ['link'],
        ],
        'linkTarget' => [
            'title' => 'Open in',
            'format' => 'select',
            'values' => ['_self' => 'Same window', '_blank' => 'New window'],
            'default' => '_self',
            'types' => ['link'],
        ],
        'grid_columns_mobile' => [
            'title' => 'Columns (mobile)',
            'format' => 'text',
            'validation' => 'positive_integer',
            'default' => '1',
            'types' => ['grid'],
        ],
        'grid_columns_desktop' => [
            'title' => 'Columns (desktop)',
            'format' => 'text',
            'validation' => 'positive_integer',
            'default' => '2',
            'types' => ['grid'],
        ],
        'grid_columns_large_desktop' => [
            'title' => 'Columns (large desktop)',
            'format' => 'text',
            'validation' => 'positive_integer',
            'default' => '3',
            'types' => ['grid'],
        ],
        'grid_show_captions' => [
            'title' => 'Show captions',
            'format' => 'toggle',
            'values' => ['yes', 'no'],
            'default' => 'yes',
            'types' => ['grid'],
        ],
        'grid_gap' => [
            'title' => 'Gap between images',
            'format' => 'text',
            'allow_blank' => true,
            'css_units' => true,
            'types' => ['grid'],
        ],
        'fullscreen' => [
            'title' => 'Fullscreen mode',
            'format' => 'toggle',
            'values' => ['yes', 'no'],
        ],
        'size' => [
            'title' => 'File size',
            'format' => 'select',
            'values' => ['large' => 'Large', 'medium' => 'Medium', 'small' => 'Small'],
            'default' => 'large',
        ],
    ];

    /**
     * Fields of each file: its caption, and for videos whether they play by themselves.
     */
    public const FILE_FIELDS = [
        'caption' => [
            'title' => 'Caption',
            'format' => 'richtext',
        ],
        'autoplay' => [
            'title' => 'Autoplay',
            'format' => 'toggle',
            'values' => ['0', '1'],
            'default' => '0',
            'file_types' => ['video'],
        ],
    ];

    /**
     * The settings the editor shows for a gallery of this type on this template (its name without version).
     *
     * @return array<string, array<string, mixed>>
     */
    public static function shownFor(string $type, string $template): array
    {
        return array_filter(self::DEFINITIONS, fn (array $definition): bool => in_array($type, $definition['types'] ?? [$type], true)
            && in_array($template, $definition['templates'] ?? [$template], true));
    }
}
