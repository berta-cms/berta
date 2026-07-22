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

        // Nothing to reconcile against. Without this guard an unreadable/missing
        // .env.example would produce an empty $env_new and wipe .env.
        if (empty($env_example)) {
            return;
        }

        // The whole read-decide-write cycle must be serialized, not just the write:
        // two workers both seeing a placeholder APP_KEY would each mint a different
        // uuid_v4() and the last write would silently discard the other's value.
        $lock = $this->acquireReconcileLock();
        if ($lock === false) {
            return;
        }

        try {
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
        } finally {
            if (is_resource($lock)) {
                flock($lock, LOCK_UN);
                fclose($lock);
            }
        }
    }

    /**
     * Acquire the exclusive, non-blocking lock guarding the whole reconcile transaction.
     *
     * Locks a dedicated file rather than .env itself: the atomic write replaces .env via
     * rename(), so its inode changes mid-transaction and a second worker would lock a
     * different inode — flock is per-inode, so that would not mutually exclude. The lock
     * is non-blocking because this runs on every request; serializing all API traffic is
     * not acceptable, and skipping is safe since the reconcile is idempotent.
     *
     * @return resource|null|false Resource when locked, null when no lock is available
     *                             (proceed unlocked, degraded), false when another worker
     *                             holds it (skip this cycle).
     */
    protected function acquireReconcileLock()
    {
        $path = storage_path('framework/.env.lock');
        $is_new = ! file_exists($path);

        $fp = @fopen($path, 'c');

        // No lock infrastructure (e.g. storage/ not writable) — degrade to an unlocked
        // reconcile rather than never syncing .env at all.
        if ($fp === false) {
            return null;
        }

        // Opening with 'c' needs write permission, so a lock file created by a different
        // user (deploy/CLI/root) would lock the web-server user out and silently disable
        // the lock for every later request. Same shared-write convention as Storage.
        if ($is_new) {
            @chmod($path, 0666);
        }

        if (! flock($fp, LOCK_EX | LOCK_NB)) {
            fclose($fp);

            return false;
        }

        return $fp;
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
