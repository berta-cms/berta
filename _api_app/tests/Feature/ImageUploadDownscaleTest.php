<?php

use App\Http\Middleware\SetupMiddleware;
use App\Models\User;
use App\Sites\Settings\SiteSettingsDataService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\post;
use function Pest\Laravel\withoutMiddleware;

beforeEach(function () {
    $this->bertaRoot = sys_get_temp_dir() . '/berta_image_downscale_' . uniqid();
    File::ensureDirectoryExists($this->bertaRoot . '/storage');
    config(['app.old_berta_root' => $this->bertaRoot]);
    linkBertaEngine($this->bertaRoot);
    writeTemplate($this->bertaRoot, 'messy');

    // SetupMiddleware reconciles the real .env file on every request.
    withoutMiddleware(SetupMiddleware::class);
    actingAs(new User);
});

afterEach(function () {
    File::deleteDirectory($this->bertaRoot);
});

/**
 * Uploads the file as the main site's first banner and returns the stored image's width and height.
 *
 * @return array{0: int, 1: int}
 */
function uploadBanner(UploadedFile $file): array
{
    post(route('site_settings_upload'), ['path' => '/settings/banners/banner1_image', 'value' => $file])->assertOk();

    $fileName = (new SiteSettingsDataService(''))->get()['banners']['banner1_image'];
    [$width, $height] = getimagesize((new SiteSettingsDataService(''))->getOrCreateMediaDir() . '/' . $fileName);

    return [$width, $height];
}

/**
 * Makes a GIF of the given size with two frames, built from a single frame GD draws.
 */
function animatedGif(int $width, int $height): UploadedFile
{
    $image = imagecreate($width, $height);
    imagecolorallocate($image, 255, 255, 255);
    ob_start();
    imagegif($image);
    $gif = ob_get_clean();

    // The header and global color table, then the frame's image descriptor up to the trailer
    $colorTableSize = (ord($gif[10]) & 0x80) ? 3 * (2 << (ord($gif[10]) & 0x07)) : 0;
    $header = 'GIF89a' . substr($gif, 6, 7 + $colorTableSize);
    $imageBlock = substr($gif, strpos($gif, "\x2C", 13 + $colorTableSize), -1);

    $loop = "\x21\xFF\x0BNETSCAPE2.0\x03\x01\x00\x00\x00";
    $frame = "\x21\xF9\x04\x00\x0A\x00\x00\x00" . $imageBlock;
    $path = tempnam(sys_get_temp_dir(), 'gif');
    file_put_contents($path, $header . $loop . $frame . $frame . "\x3B");

    return new UploadedFile($path, 'animation.gif', 'image/gif', null, true);
}

it('scales a larger image down to fit the maximum size, keeping its aspect ratio', function () {
    config(['app.image_max_width' => 400, 'app.image_max_height' => 400]);

    expect(uploadBanner(UploadedFile::fake()->image('wide.jpg', 800, 200)))->toBe([400, 100]);
});

it('keeps an image within the maximum size at its own size', function () {
    config(['app.image_max_width' => 400, 'app.image_max_height' => 400]);

    expect(uploadBanner(UploadedFile::fake()->image('small.jpg', 300, 120)))->toBe([300, 120]);
});

it('keeps an animated GIF at its own size', function () {
    config(['app.image_max_width' => 400, 'app.image_max_height' => 400]);

    expect(uploadBanner(animatedGif(800, 200)))->toBe([800, 200]);
});
