<?php

namespace App\Providers;

use App\Shared\ImageHelpers;
use App\Shared\UndoFiles;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {

        /*
        |--------------------------------------------------------------------------
        | Load plugins config
        |--------------------------------------------------------------------------
        |
        | Load configuration from plugins. Put the db connections in to connections array.
        |
        */
        $app_path = app_path();
        foreach (scandir("{$app_path}/Plugins") as $fileOrDir) {
            if (in_array($fileOrDir, ['.', '..'])) {
                continue;
            }

            $dirPath = "{$app_path}/Plugins/{$fileOrDir}";

            if (is_dir($dirPath) && is_file("{$dirPath}/config.php")) {
                $this->mergeConfigFrom("{$dirPath}/config.php", "plugin-{$fileOrDir}");
            }
        }

        Validator::extend('not_corrupted_image', function ($attribute, $value, $parameters) {
            return ! ImageHelpers::isCorrupted($value);
        });

        // Public pages boot the app without terminating it, so a shutdown function is what runs on every web request.
        if (! $this->app->runningInConsole()) {
            register_shutdown_function(fn () => rescue(fn () => (new UndoFiles)->cleanUpIfDue()));
        }
    }
}
