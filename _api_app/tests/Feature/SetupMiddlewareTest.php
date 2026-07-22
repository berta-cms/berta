<?php

use App\Http\Middleware\SetupMiddleware;

/**
 * Invoke a protected method on a fresh SetupMiddleware instance.
 */
function invokeSetup(string $method, array $args = []): mixed
{
    $ref = new ReflectionMethod(SetupMiddleware::class, $method);
    $ref->setAccessible(true);

    return $ref->invokeArgs(new SetupMiddleware, $args);
}

/**
 * Parse a KEY=VALUE .env-style string into an array (test-side, order preserving).
 */
function parseEnv(string $content): array
{
    $res = [];
    foreach (preg_split('/\R/', trim($content)) as $line) {
        if ($line === '') {
            continue;
        }
        [$key, $value] = array_pad(explode('=', $line, 2), 2, '');
        $res[$key] = $value;
    }

    return $res;
}

beforeEach(function () {
    $this->dir = sys_get_temp_dir() . '/berta_setup_' . uniqid();
    // storage/framework must exist for storage_path() to resolve the reconcile lock file
    // once the base path is pointed at the temp dir.
    mkdir($this->dir . '/storage/framework', 0777, true);
});

afterEach(function () {
    // Ensure the dir is writable so cleanup can remove its contents.
    @chmod($this->dir, 0777);
    // Explicit rather than a GLOB_BRACE dotfile glob, which is not portable off glibc.
    @unlink($this->dir . '/storage/framework/.env.lock');
    foreach (glob($this->dir . '/storage/framework/*') ?: [] as $f) {
        if (! is_dir($f)) {
            @unlink($f);
        }
    }
    @rmdir($this->dir . '/storage/framework');
    @rmdir($this->dir . '/storage');
    foreach (glob($this->dir . '/*') ?: [] as $f) {
        @chmod($f, 0666);
        @unlink($f);
    }
    foreach (glob($this->dir . '/.*') ?: [] as $f) {
        if (! is_dir($f)) {
            @unlink($f);
        }
    }
    @rmdir($this->dir);
});

it('preserves existing APP_KEY and APP_ID instead of regenerating them', function () {
    file_put_contents($this->dir . '/.env.example', "APP_ENV=production\nAPP_KEY=[YOUR_APP_KEY]\nAPP_ID=[YOUR_APP_ID]\n");
    file_put_contents($this->dir . '/.env', "APP_ENV=production\nAPP_KEY=real-app-key\nAPP_ID=real-app-id\n");

    $this->app->setBasePath($this->dir);
    invokeSetup('updateEnvFile');

    $env = parseEnv(file_get_contents($this->dir . '/.env'));
    expect($env['APP_KEY'])->toBe('real-app-key');
    expect($env['APP_ID'])->toBe('real-app-id');
});

it('creates .env from .env.example and generates keys on first run', function () {
    file_put_contents($this->dir . '/.env.example', "APP_ENV=production\nAPP_KEY=[YOUR_APP_KEY]\nAPP_ID=[YOUR_APP_ID]\n");

    $this->app->setBasePath($this->dir);
    invokeSetup('updateEnvFile');

    expect(file_exists($this->dir . '/.env'))->toBeTrue();
    $env = parseEnv(file_get_contents($this->dir . '/.env'));
    expect($env['APP_ENV'])->toBe('production');
    expect($env['APP_KEY'])->not->toBeIn(['[YOUR_APP_KEY]', '']);
    expect($env['APP_ID'])->not->toBeIn(['[YOUR_APP_ID]', '']);
});

it('regenerates keys that still hold the example placeholder', function () {
    file_put_contents($this->dir . '/.env.example', "APP_KEY=[YOUR_APP_KEY]\nAPP_ID=[YOUR_APP_ID]\n");
    file_put_contents($this->dir . '/.env', "APP_KEY=[YOUR_APP_KEY]\nAPP_ID=\n");

    $this->app->setBasePath($this->dir);
    invokeSetup('updateEnvFile');

    $env = parseEnv(file_get_contents($this->dir . '/.env'));
    expect($env['APP_KEY'])->not->toBeIn(['[YOUR_APP_KEY]', '']);
    expect($env['APP_ID'])->not->toBe('');
});

it('drops keys not in .env.example and does not rewrite on a second run', function () {
    file_put_contents($this->dir . '/.env.example', "APP_ENV=production\nAPP_KEY=[YOUR_APP_KEY]\nAPP_ID=[YOUR_APP_ID]\n");
    file_put_contents($this->dir . '/.env', "APP_KEY=real-app-key\nAPP_ID=real-app-id\nDB_HOST=localhost\n");

    $this->app->setBasePath($this->dir);
    invokeSetup('updateEnvFile');

    $afterFirst = file_get_contents($this->dir . '/.env');
    $env = parseEnv($afterFirst);
    expect($env)->not->toHaveKey('DB_HOST');      // key absent from .env.example is dropped
    expect($env['APP_ENV'])->toBe('production');  // example key added
    expect($env['APP_KEY'])->toBe('real-app-key'); // existing value kept

    invokeSetup('updateEnvFile');
    // Idempotent: once .env matches the example key set, no further rewrite happens.
    expect(file_get_contents($this->dir . '/.env'))->toBe($afterFirst);
});

it('skips the reconcile while another worker holds the lock', function () {
    file_put_contents($this->dir . '/.env.example', "APP_KEY=[YOUR_APP_KEY]\nAPP_ID=[YOUR_APP_ID]\n");
    file_put_contents($this->dir . '/.env', "APP_KEY=[YOUR_APP_KEY]\nAPP_ID=[YOUR_APP_ID]\n");
    $before = file_get_contents($this->dir . '/.env');

    $this->app->setBasePath($this->dir);

    // Simulate a concurrent worker mid-transaction.
    $holder = fopen($this->dir . '/storage/framework/.env.lock', 'c');
    expect(flock($holder, LOCK_EX | LOCK_NB))->toBeTrue();

    invokeSetup('updateEnvFile');
    expect(file_get_contents($this->dir . '/.env'))->toBe($before); // no write happened

    // Once the other worker is done, the reconcile proceeds.
    flock($holder, LOCK_UN);
    fclose($holder);

    invokeSetup('updateEnvFile');
    $env = parseEnv(file_get_contents($this->dir . '/.env'));
    expect($env['APP_KEY'])->not->toBe('[YOUR_APP_KEY]');
});

it('creates the lock file group- and other-writable', function () {
    file_put_contents($this->dir . '/.env.example', "APP_KEY=[YOUR_APP_KEY]\n");

    $this->app->setBasePath($this->dir);
    invokeSetup('updateEnvFile');

    $lock = $this->dir . '/storage/framework/.env.lock';
    expect(file_exists($lock))->toBeTrue();
    // Otherwise a lock file created by another user would silently lock the web-server
    // user out of the lock, degrading every later reconcile to unlocked.
    expect(fileperms($lock) & 0666)->toBe(0666);
});

it('mints APP_KEY only once across repeated reconciles', function () {
    file_put_contents($this->dir . '/.env.example', "APP_KEY=[YOUR_APP_KEY]\nAPP_ID=[YOUR_APP_ID]\n");
    file_put_contents($this->dir . '/.env', "APP_KEY=[YOUR_APP_KEY]\nAPP_ID=[YOUR_APP_ID]\n");

    $this->app->setBasePath($this->dir);

    invokeSetup('updateEnvFile');
    $first = parseEnv(file_get_contents($this->dir . '/.env'));

    invokeSetup('updateEnvFile');
    $second = parseEnv(file_get_contents($this->dir . '/.env'));

    expect($second['APP_KEY'])->toBe($first['APP_KEY']);
    expect($second['APP_ID'])->toBe($first['APP_ID']);
});

it('does not wipe .env when .env.example is missing', function () {
    $original = "APP_KEY=real-app-key\nAPP_ID=real-app-id\n";
    file_put_contents($this->dir . '/.env', $original); // no .env.example present

    $this->app->setBasePath($this->dir);
    invokeSetup('updateEnvFile');

    expect(file_get_contents($this->dir . '/.env'))->toBe($original);
});

it('still reconciles when the lock file cannot be created', function () {
    // No storage/ directory: storage_path() is unresolvable, so the lock degrades.
    // The dotfile must go too, otherwise rmdir() fails and the lock would still work,
    // making this test pass without exercising the degraded path.
    @unlink($this->dir . '/storage/framework/.env.lock');
    array_map('unlink', glob($this->dir . '/storage/framework/*') ?: []);
    rmdir($this->dir . '/storage/framework');
    rmdir($this->dir . '/storage');
    expect(is_dir($this->dir . '/storage'))->toBeFalse();

    file_put_contents($this->dir . '/.env.example', "APP_ENV=production\nAPP_KEY=[YOUR_APP_KEY]\n");

    $this->app->setBasePath($this->dir);
    invokeSetup('updateEnvFile');

    $env = parseEnv(file_get_contents($this->dir . '/.env'));
    expect($env['APP_ENV'])->toBe('production');
    expect($env['APP_KEY'])->not->toBeIn(['[YOUR_APP_KEY]', '']);
});

it('writes atomically and preserves file permissions when the directory is writable', function () {
    $path = $this->dir . '/.env';
    file_put_contents($path, "APP_KEY=old\n");
    chmod($path, 0640);

    invokeSetup('writeEnvFile', [$path, "APP_KEY=new\n"]);

    expect(file_get_contents($path))->toBe("APP_KEY=new\n");
    expect(fileperms($path) & 0777)->toBe(0640);
});

it('falls back to a locked in-place write when only the file is writable', function () {
    $path = $this->dir . '/.env';
    file_put_contents($path, "APP_KEY=old\n");
    chmod($path, 0644);
    chmod($this->dir, 0555); // read-only directory
    if (is_writable($this->dir)) {
        $this->markTestSkipped('Directory permissions are not enforced (running as root?).');
    }

    invokeSetup('writeEnvFile', [$path, "APP_KEY=new\n"]);

    expect(file_get_contents($path))->toBe("APP_KEY=new\n");
});

it('no-ops without error when .env is missing and the directory is read-only', function () {
    $path = $this->dir . '/.env';
    chmod($this->dir, 0555); // read-only directory, no .env present
    if (is_writable($this->dir)) {
        $this->markTestSkipped('Directory permissions are not enforced (running as root?).');
    }

    invokeSetup('writeEnvFile', [$path, "APP_KEY=new\n"]);

    expect(file_exists($path))->toBeFalse();
});
