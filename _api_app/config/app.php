<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Encryption Key
    |--------------------------------------------------------------------------
    |
    | This key is used by the Illuminate encrypter service and should be set
    | to a random, 32 character string, otherwise these encrypted strings
    | will not be safe. Please do this before deploying an application!
    |
    */

    'key' => env('APP_KEY', '[YOUR_APP_KEY]') . env('APP_ID', '[YOUR_APP_ID]'),
    'id' => env('APP_ID', '[YOUR_APP_ID]'),
    'cipher' => 'AES-256-CBC',

    /*
    |--------------------------------------------------------------------------
    | Application Locale Configuration
    |--------------------------------------------------------------------------
    |
    | The application locale determines the default locale that will be used
    | by the translation service provider. You are free to set this value
    | to any of the locales which will be supported by the application.
    |
    */
    'locale' => env('APP_LOCALE', 'en'),
    /*
    |--------------------------------------------------------------------------
    | Application Fallback Locale
    |--------------------------------------------------------------------------
    |
    | The fallback locale determines the locale to use when the current one
    | is not available. You may change the value to correspond to any of
    | the language folders that are provided through your application.
    |
    */
    'fallback_locale' => env('APP_FALLBACK_LOCALE', 'en'),
    'old_berta_root' => realpath(__DIR__ . '/../../'),
    'berta_storage_path' => realpath(__DIR__ . '/../../storage'),
    'api_prefix' => env('API_PREFIX', '_api'),
    'image_max_file_size' => 1024 * 3, // 3MB in kilobytes
    'video_max_file_size' => 1024 * 256, // 256MB in kilobytes
    'image_mimetypes' => [
        'image/png',
        'image/jpeg',
        'image/gif'
    ],
    'ico_mimetypes' => [
        'image/vnd.microsoft.icon',
        'image/x-icon'
    ],
    'video_mimetypes' => [
        'video/mp4',
        'video/x-flv'
    ],
    'image_mimes' => [
        'png',
        'jpeg',
        'jpg',
        'gif'
    ],
    'ico_mimes' => [
        'ico'
    ],
    'video_mimes' => [
        'mp4',
        'flv'
    ],
    'small_thumb_prefix' => '_smallthumb_',
    'small_thumb_width' => false, // false means "auto"
    'small_thumb_height' => 80,
    'bg_image_prefix' => '_bg_',
    'grid_image_prefix' => '_grid_',
    'grid_thumb_width' => 140,
    'grid_thumb_height' => false, // false means "auto"
];
