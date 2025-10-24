<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\StateController;
use App\Http\Middleware\Authenticate;
use App\Http\Middleware\SetupMiddleware;
use App\Sites\Sections\Entries\SectionEntriesController;
use App\Sites\Sections\SiteSectionsController;
use App\Sites\Sections\Tags\SectionTagsController;
use App\Sites\Settings\SiteSettingsController;
use App\Sites\SitesController;
use App\Sites\TemplateSettings\SiteTemplateSettingsController;
use Illuminate\Support\Facades\Route;

Route::middleware(SetupMiddleware::class)->group(function () {
    Route::post('auth/login', [AuthController::class, 'authenticate']);
    Route::get('auth/login', [AuthController::class, 'authenticate'])->name('authenticate');
    Route::post('v1/login', [AuthController::class, 'apiLogin'])->name('login');
    Route::put('v1/logout', [AuthController::class, 'apiLogout']);

    Route::get('v1/meta', [StateController::class, 'getMeta'])->name('meta');
    Route::get('v1/sentry-dsn', [StateController::class, 'getSentryDSN'])->name('sentry');
});

Route::middleware([SetupMiddleware::class, Authenticate::class])->prefix('v1')->group(function () {
    Route::patch('user/changepassword', [AuthController::class, 'changePassword']);
    Route::get('state/{site?}', [StateController::class, 'get']);
    Route::get('locale-settings', [StateController::class, 'getLocaleSettings'])->name('locale_settings');

    // Sites
    Route::post('sites', [SitesController::class, 'create'])->name('sites');
    Route::patch('sites', [SitesController::class, 'update']);
    Route::put('sites', [SitesController::class, 'order']);
    Route::delete('sites', [SitesController::class, 'delete']);
    Route::post('sites/theme-preview', [SitesController::class, 'themePreview'])->name('site_theme_preview');
    Route::put('sites/theme-apply', [SitesController::class, 'themeApply'])->name('site_theme_apply');
    Route::put('sites/swap-contents-between-sites', [SitesController::class, 'swapContentsBetweenSites'])->name('site_swap_contents_between_sites');
    Route::get('sites/render-menu/{site?}', [SitesController::class, 'renderMenu']);
    Route::get('sites/render-header/{site?}', [SitesController::class, 'renderHeader']);
    Route::get('sites/render-banners/{site?}', [SitesController::class, 'renderBanners']);
    Route::get('sites/render-social-media-links/{site?}', [SitesController::class, 'renderSocialMediaLinks']);
    Route::patch('sites/settings', [SiteSettingsController::class, 'update'])->name('site_settings');
    Route::post('sites/settings/upload', [SiteSettingsController::class, 'upload'])->name('site_settings_upload');
    Route::post('sites/settings', [SiteSettingsController::class, 'createChildren']);
    Route::delete('sites/settings', [SiteSettingsController::class, 'deleteChildren']);
    Route::patch('sites/template-settings', [
        SiteTemplateSettingsController::class,
        'update',
    ])->name('site_template_settings');
    Route::post('sites/template-settings/upload', [
        SiteTemplateSettingsController::class,
        'upload',
    ])->name('site_template_settings_upload');
    Route::put('sites/template-settings', [
        SiteTemplateSettingsController::class,
        'resetToDefaults',
    ])->name('site_template_settings_reset_to_defaults');
});

Route::middleware([SetupMiddleware::class, Authenticate::class])->prefix('v1/sites')->group(function () {
    Route::post('sections', [SiteSectionsController::class, 'create'])->name('site_sections');
    Route::patch('sections', [SiteSectionsController::class, 'update']);
    Route::patch('sections/reset', [SiteSectionsController::class, 'reset'])->name('site_sections_reset');
    Route::put('sections', [SiteSectionsController::class, 'order']);
    Route::delete('sections', [SiteSectionsController::class, 'delete']);
    Route::get('sections/render-head/{site?}', [SiteSectionsController::class, 'renderHead']);
    Route::get('sections/render-menu/{site?}', [SiteSectionsController::class, 'renderMenu']);
    Route::get('sections/render-sitemap/{siteSlug?}', [SiteSectionsController::class, 'renderSitemap']);
    Route::get('sections/render-background-gallery/{siteSlug?}', [
        SiteSectionsController::class,
        'renderBackgroundGallery',
    ]);
    Route::get('sections/render-grid-view/{siteSlug?}', [SiteSectionsController::class, 'renderGridView']);
    Route::get('sections/render-additional-text/{site?}', [SiteSectionsController::class, 'renderAdditionalText']);
    Route::get('sections/render-additional-footer-text/{site?}', [
        SiteSectionsController::class,
        'renderAdditionalFooterText',
    ]);
    Route::get('sections/render-footer/{site?}', [SiteSectionsController::class, 'renderFooter']);
    Route::get('sections/render-template/{siteSlug?}', [SiteSectionsController::class, 'renderTemplate']);
    Route::put('sections/backgrounds', [
        SiteSectionsController::class,
        'backgroundGalleryOrder',
    ])->name('site_section_backgrounds');
    Route::post('sections/backgrounds', [SiteSectionsController::class, 'backgroundGalleryUpload']);
    Route::delete('sections/backgrounds', [SiteSectionsController::class, 'backgroundGalleryDelete']);
    Route::put('sections/tags', [SectionTagsController::class, 'order'])->name('section_tags');
});

Route::middleware([SetupMiddleware::class, Authenticate::class])->prefix('v1/sites/sections')->group(function () {
    Route::patch('entries', [SectionEntriesController::class, 'update'])->name('section_entries');
    Route::post('entries', [SectionEntriesController::class, 'create']);
    Route::put('entries', [SectionEntriesController::class, 'order']);
    Route::delete('entries', [SectionEntriesController::class, 'delete']);
    Route::patch('entries/move', [SectionEntriesController::class, 'move'])->name('section_entries_move');
    Route::put('entries/galleries', [SectionEntriesController::class, 'galleryOrder'])->name('entry_gallery');
    Route::post('entries/galleries', [SectionEntriesController::class, 'galleryUpload'])->name('entry_gallery_upload');
    Route::patch('entries/galleries', [SectionEntriesController::class, 'galleryCrop']);
    Route::delete('entries/galleries', [SectionEntriesController::class, 'galleryDelete']);
    Route::get('entries/render/{site}/{section}/{id?}', [SectionEntriesController::class, 'renderEntries']);
    Route::get('entries/render-mashup[/{site}]', [SectionEntriesController::class, 'renderMashupEntries']);
    Route::get('entries/render-portfolio-thumbnails/{site}/{section}', [
        SectionEntriesController::class,
        'renderPortfolioThumbnails',
    ]);
});

Route::middleware([SetupMiddleware::class, Authenticate::class])->prefix('v1/plugin')->group(function () {
    $app_path = app_path();
    foreach (scandir("{$app_path}/Plugins") as $fileOrDir) {
        if (in_array($fileOrDir, ['.', '..'])) {
            continue;
        }

        $dirPath = "{$app_path}/Plugins/{$fileOrDir}";

        if (is_dir($dirPath) && is_file("{$dirPath}/routes.php")) {
            require "{$dirPath}/routes.php";
        }
    }
});
