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
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
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
        $env_example = $this->parseEnvFile(base_path() . '/.env.example');
        $env = $this->parseEnvFile(base_path() . '/.env');

        $env_new = [];
        foreach ($env_example as $key => $value) {
            if (isset($env[$key])) {
                $env_new[$key] = $env[$key];
            } elseif ($key == 'APP_KEY' || $key == 'APP_ID') {
                $env_new[$key] = Helpers::uuid_v4();
            } else {
                $env_new[$key] = $value;
            }
        }

        if ($env !== $env_new) {
            $content = '';

            foreach ($env_new as $key => $value) {
                $content .= $key . '=' . $value . "\n";
            }
            file_put_contents(base_path() . '/.env', $content);
        }
    }

    protected function parseEnvFile($file)
    {
        $res = [];

        if (! file_exists($file)) {
            return $res;
        }

        $content = trim(file_get_contents(realpath($file)));
        $rows = preg_split('/\s+/', $content);
        // Loop through given data
        foreach ((array) $rows as $key => $value) {
            [$key, $value] = explode('=', $value, 2);
            $res[$key] = $value;
        }

        return $res;
    }
}
