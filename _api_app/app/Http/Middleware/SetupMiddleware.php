<?php

namespace App\Http\Middleware;

use App\Shared\Helpers;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetupMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $this->updateEnvFile();

        return $next($request);
    }

    // @todo currently env file diff checking happens on every api request,
    // figure out more effective way for comparison
    protected function updateEnvFile()
    {
        $env_path = base_path() . '/.env';
        $env_example = $this->parseEnvFile(base_path() . '/.env.example');
        $env = $this->parseEnvFile($env_path);

        $placeholders = ['[YOUR_APP_KEY]', '[YOUR_APP_ID]', ''];

        // .env.example is the authoritative key list: only its keys end up in .env, any
        // others are dropped. Keep the existing value when set (and not a placeholder),
        // regenerate APP_KEY/APP_ID only when absent/empty/placeholder, else fall back to
        // the example value. Once rewritten, .env matches the example key set so
        // $env === $env_new on the next run — no perpetual per-request rewrite.
        $env_new = [];
        foreach ($env_example as $key => $value) {
            if (array_key_exists($key, $env) && ! in_array($env[$key], $placeholders, true)) {
                $env_new[$key] = $env[$key];
            } elseif (($key == 'APP_KEY' || $key == 'APP_ID') && in_array($env[$key] ?? '', $placeholders, true)) {
                $env_new[$key] = Helpers::uuid_v4();
            } else {
                $env_new[$key] = $env[$key] ?? $value;
            }
        }

        if ($env !== $env_new) {
            $content = '';

            foreach ($env_new as $key => $value) {
                $content .= $key . '=' . $value . "\n";
            }
            $this->writeEnvFile($env_path, $content);
        }
    }

    /**
     * Write the .env file without exposing a truncated/partial file to concurrent
     * readers (including Laravel's own env loader, which takes no lock).
     *
     * When the directory is writable we do an atomic temp-file + rename() swap — the
     * strongest guarantee, protecting every reader without cooperation. The temp file
     * must live in the same directory: rename() is only atomic on the same filesystem,
     * so a system-temp path would degrade to a non-atomic copy+delete. When only the
     * file itself is writable (hardened deployment: read-only app root), we fall back to
     * a locked in-place write. Storage.php uses advisory flock for its XML files, but
     * those are only ever accessed through its own locked methods; .env has readers
     * outside our control, hence the preference for rename() here.
     */
    protected function writeEnvFile(string $path, string $content): void
    {
        $mode = file_exists($path) ? (fileperms($path) & 0777) : 0644;

        if (is_writable(dirname($path))) {
            $tmp = $path . '.' . getmypid() . '.' . uniqid() . '.tmp';
            if (file_put_contents($tmp, $content) !== false) {
                @chmod($tmp, $mode);
                if (@rename($tmp, $path)) {
                    return;
                }
                @unlink($tmp);
            }
        }

        // Read-only app root, .env writable: locked in-place write. 'c' creates if
        // missing and does not truncate before we hold the lock. Returns false (no-op)
        // when .env is missing and the dir is read-only — creation is an install step.
        $fp = @fopen($path, 'c');
        if ($fp !== false) {
            if (flock($fp, LOCK_EX)) {
                ftruncate($fp, 0);
                fwrite($fp, $content);
                fflush($fp);
                flock($fp, LOCK_UN);
            }
            fclose($fp);
        }
    }

    protected function parseEnvFile($file)
    {
        $res = [];

        if (! file_exists($file)) {
            return $res;
        }

        $content = trim(file_get_contents(realpath($file)));

        if (empty($content)) {
            return $res;
        }

        $rows = preg_split('/\s+/', $content);
        // Loop through given data
        foreach ((array) $rows as $key => $value) {
            [$key, $value] = explode('=', $value, 2);
            $res[$key] = $value;
        }

        return $res;
    }
}
