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
    mkdir($this->dir, 0777, true);
});

afterEach(function () {
    // Ensure the dir is writable so cleanup can remove its contents.
    @chmod($this->dir, 0777);
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
