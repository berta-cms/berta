<?php

require_once __DIR__.'/../vendor/autoload.php';

try {
    (new Dotenv\Dotenv(__DIR__.'/../'))->load();
} catch (Dotenv\Exception\InvalidPathException $e) {
    //
}

/*
|--------------------------------------------------------------------------
| Create The Application
|--------------------------------------------------------------------------
|
| Here we will load the environment and create the application instance
| that serves as the central piece of this framework. We'll use this
| application as an "IoC" container and router for this framework.
|
*/

$app = new Laravel\Lumen\Application(
    realpath(__DIR__.'/../')
);

$app->withFacades();
// Initialize `app` configuration file stored in `config/app.php`
$app->configure('app');

if (!class_exists('Twig')) {
    class_alias(TwigBridge\Facade\Twig::class, 'Twig');
    $app->configure('twigbridge');
}

$app->withEloquent();

/*
|--------------------------------------------------------------------------
| Load plugins
|--------------------------------------------------------------------------
|
| Load configuration from plugins. Put the db connections in to connections array.
|
*/

foreach (scandir("{$app->path()}/Plugins") as $fileOrDir) {
    if (in_array($fileOrDir, ['.', '..'])) { continue; }

    $dirPath = "{$app->path()}/Plugins/{$fileOrDir}";

    if (is_dir($dirPath) && is_file("{$dirPath}/config.php")) {
        $app->make('config')->set("plugin-{$fileOrDir}", require "{$dirPath}/config.php");
        $newConfig = config("plugin-{$fileOrDir}");
    }
}



/*
|--------------------------------------------------------------------------
| Register Container Bindings
|--------------------------------------------------------------------------
|
| Now we will register a few bindings in the service container. We will
| register the exception handler and the console kernel. You may add
| your own bindings here if you like or you can make another file.
|
*/

$app->singleton(
    Illuminate\Contracts\Debug\ExceptionHandler::class,
    App\Exceptions\Handler::class
);

$app->singleton(
    Illuminate\Contracts\Console\Kernel::class,
    App\Console\Kernel::class
);

/*
|--------------------------------------------------------------------------
| Register Middleware
|--------------------------------------------------------------------------
|
| Next, we will register the middleware with the application. These can
| be global middleware that run before and after each request into a
| route or middleware that'll be assigned to some specific routes.
|
*/

// $app->middleware([
//    App\Http\Middleware\ExampleMiddleware::class
// ]);

$app->routeMiddleware([
    'auth' => App\Http\Middleware\Authenticate::class,
    'setup' => App\Http\Middleware\SetupMiddleware::class
]);

/*
|--------------------------------------------------------------------------
| Register Service Providers
|--------------------------------------------------------------------------
|
| Here we will register all of the application's service providers which
| are used to bind services into the container. Service providers are
| totally optional, so you are not required to uncomment this line.
|
*/

$app->register(Sentry\SentryLaravel\SentryLumenServiceProvider::class);
$app->register(App\Providers\AppServiceProvider::class);
$app->register(App\User\UserAuthServiceProvider::class);
$app->register(App\Providers\EventServiceProvider::class);
$app->register(TwigBridge\ServiceProvider::class);

/*
|--------------------------------------------------------------------------
| Load The Application Routes
|--------------------------------------------------------------------------
|
| Next we will include the routes file so that they can all be added to
| the application. This will provide all of the URLs the application
| can respond to, as well as the controllers that may handle them.
|
| * Sentry must be registered before routes are included
*/

require __DIR__.'/../app/Http/routes.php';


return $app;
