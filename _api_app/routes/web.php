<?php

use App\Dev\TestController;
use Illuminate\Support\Facades\Route;

// Route::get('/', function () {
//     return view('welcome');
// });

//  This includes test controller for easier development
//  @todo: replace this with automated tests
if (app()->environment('local', 'stage')) {
    Route::prefix('v1')->group(function () {
        Route::get('test', [TestController::class, 'get']);
        Route::get('render-entry', [TestController::class, 'renderEntry']);
    });
}
