<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Application Name
    |--------------------------------------------------------------------------
    |
    | This value is the name of your application. This value is used when the
    | framework needs to place the application's name in a notification or
    | any other location as required by the application or its packages.
    |
    */

    'name' => env('APP_NAME', 'Berta'),

    /*
    |--------------------------------------------------------------------------
    | Application Environment
    |--------------------------------------------------------------------------
    |
    | This value determines the "environment" your application is currently
    | running in. This may determine how you prefer to configure various
    | services the application utilizes. Set this in your ".env" file.
    |
    */

    'env' => env('APP_ENV', 'production'),

    /*
    |--------------------------------------------------------------------------
    | Application Debug Mode
    |--------------------------------------------------------------------------
    |
    | When your application is in debug mode, detailed error messages with
    | stack traces will be shown on every error that occurs within your
    | application. If disabled, a simple generic error page is shown.
    |
    */

    'debug' => (bool) env('APP_DEBUG', false),

    /*
    |--------------------------------------------------------------------------
    | Application URL
    |--------------------------------------------------------------------------
    |
    | This URL is used by the console to properly generate URLs when using
    | the Artisan command line tool. You should set this to the root of
    | your application so that it is used when running Artisan tasks.
    |
    */

    'url' => env('APP_URL', 'http://localhost'),

    /*
    |--------------------------------------------------------------------------
    | Application Timezone
    |--------------------------------------------------------------------------
    |
    | Here you may specify the default timezone for your application, which
    | will be used by the PHP date and date-time functions. We have gone
    | ahead and set this to a sensible default for you out of the box.
    |
    */

    'timezone' => 'UTC',

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

    // App specific configuration
    'old_berta_root' => realpath(__DIR__ . '/../../'),
    'berta_storage_path' => realpath(__DIR__ . '/../../storage'),
    'api_prefix' => env('API_PREFIX', '_api'),
    'image_max_file_size' => 1024 * 3, // 3MB in kilobytes
    'video_max_file_size' => 1024 * 256, // 256MB in kilobytes
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
        'mp4'
    ],
    'small_thumb_prefix' => '_smallthumb_',
    'small_thumb_width' => false, // false means "auto"
    'small_thumb_height' => 80,
    'bg_image_prefix' => '_bg_',
    'grid_image_prefix' => '_grid_',
    'grid_thumb_width' => 140,
    'grid_thumb_height' => false, // false means "auto"

    // Row gallery image limit returned from server
    // Remaining images will be rendered in frontend
    'row_gallery_image_limit' => [
        'large' => 3,
        'medium' => 5,
        'small' => 7
    ],
];
