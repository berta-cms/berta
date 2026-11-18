<?php

use App\Http\Middleware\SetupMiddleware;
use App\User\EditorToken;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Support\Facades\File;

use function Pest\Laravel\getJson;
use function Pest\Laravel\withoutMiddleware;

beforeEach(function () {
    $this->bertaRoot = sys_get_temp_dir() . '/berta_editor_token_' . uniqid();
    File::ensureDirectoryExists($this->bertaRoot . '/storage');
    config(['app.old_berta_root' => $this->bertaRoot]);
    linkBertaEngine($this->bertaRoot);
    givePlanFeatures($this->bertaRoot, []);
    // The account's login details last changed long before the tokens here were issued.
    touch($this->bertaRoot . '/engine/config/inc.conf.php', time() - 40 * 86400);

    // SetupMiddleware reconciles the real .env file on every request.
    withoutMiddleware(SetupMiddleware::class);
});

afterEach(function () {
    File::deleteDirectory($this->bertaRoot);
});

/**
 * An editor token as Berta or berta.me hosting issues it, the given number of seconds ago.
 *
 * @param  array<string, mixed>  $claims
 */
function editorTokenIssuedAgo(int $seconds, array $claims = []): string
{
    return JWT::encode([...$claims, 'iat' => time() - $seconds, 'exp' => time() - $seconds + EditorToken::LIFETIME_SECONDS], config('app.key'), 'HS256');
}

it('renews a token older than an hour, keeping its claims', function () {
    $response = getJson(route('change_marker'), ['X-Authorization' => 'Bearer ' . editorTokenIssuedAgo(2 * 3600, ['uid' => 42])])
        ->assertOk()
        ->assertHeader('X-Berta-Token');

    // No proxy or CDN may store a response carrying a session token.
    expect($response->headers->get('Cache-Control'))->toContain('no-store');

    $renewed = (array) JWT::decode($response->headers->get('X-Berta-Token'), new Key(config('app.key'), 'HS256'));

    // The hosting user's id, used by the support chat.
    expect($renewed['uid'])->toBe(42)
        ->and($renewed['exp'])->toBeGreaterThanOrEqual(time() + EditorToken::LIFETIME_SECONDS - 5);
});

it('leaves a recent token as it is', function () {
    getJson(route('change_marker'), ['X-Authorization' => 'Bearer ' . editorTokenIssuedAgo(600)])
        ->assertOk()
        ->assertHeaderMissing('X-Berta-Token');
});

it('does not renew an expired token', function () {
    getJson(route('change_marker'), ['X-Authorization' => 'Bearer ' . editorTokenIssuedAgo(EditorToken::LIFETIME_SECONDS + 3600)])
        ->assertUnauthorized()
        ->assertHeaderMissing('X-Berta-Token');
});

it('keeps the login time through renewals', function () {
    $response = getJson(route('change_marker'), ['X-Authorization' => 'Bearer ' . editorTokenIssuedAgo(2 * 3600, ['auth_time' => time() - 5 * 86400])])
        ->assertOk();

    $renewed = (array) JWT::decode($response->headers->get('X-Berta-Token'), new Key(config('app.key'), 'HS256'));

    expect($renewed['auth_time'])->toBeLessThanOrEqual(time() - 5 * 86400);
});

it('stops renewing a month after the login, so a leaked token ends', function () {
    getJson(route('change_marker'), ['X-Authorization' => 'Bearer ' . editorTokenIssuedAgo(2 * 3600, ['auth_time' => time() - (EditorToken::MAX_SESSION_DAYS + 1) * 86400])])
        ->assertOk()
        ->assertHeaderMissing('X-Berta-Token');
});

it('stops renewing sessions that started before the account changed, e.g. a password change or website transfer', function () {
    touch($this->bertaRoot . '/engine/config/inc.conf.php', time() - 3600);

    getJson(route('change_marker'), ['X-Authorization' => 'Bearer ' . editorTokenIssuedAgo(2 * 3600)])
        ->assertOk()
        ->assertHeaderMissing('X-Berta-Token');
});
