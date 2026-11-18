<?php

namespace App\User;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Throwable;

/**
 * The editor's session token: a JWT signed with the app key. Berta issues it at login with a password; a login from
 * berta.me hosting brings one hosting signed with the same key, with the hosting user's id as "uid". While the editor
 * is used, the token is renewed with the same claims, so the session ends LIFETIME_SECONDS after the last use rather
 * than after login, but no later than MAX_SESSION_DAYS after the login (the "auth_time" claim), so a leaked token
 * can't be kept alive for ever. Sessions that started before the account last changed (engine/config/inc.conf.php,
 * rewritten by a password change here and by berta.me hosting on a website transfer or email change) aren't renewed,
 * so e.g. a previous owner's session still ends within LIFETIME_SECONDS, as it did before renewals.
 */
class EditorToken
{
    public const LIFETIME_SECONDS = 86400;

    /**
     * How old a token gets before requests renew it, so an editor renews at most once in this time.
     */
    public const RENEW_AFTER_SECONDS = 3600;

    /**
     * Renewals stop this long after the login; the session then ends LIFETIME_SECONDS later at most.
     */
    public const MAX_SESSION_DAYS = 30;

    /**
     * @param  array<string, mixed>  $claims  claims to keep, besides the issue and expiry times
     */
    public function issue(array $claims = []): string
    {
        return JWT::encode([...$claims, 'iat' => time(), 'exp' => time() + self::LIFETIME_SECONDS], config('app.key'), 'HS256');
    }

    /**
     * A new token with the same claims when the given valid token is older than RENEW_AFTER_SECONDS, its login not
     * older than MAX_SESSION_DAYS and not earlier than the account's last change, else null. The login time is kept
     * as "auth_time"; tokens from a login carry none, so their issue time is the login time.
     */
    public function renewal(string $token): ?string
    {
        try {
            $claims = (array) JWT::decode($token, new Key(config('app.key'), 'HS256'));
        } catch (Throwable) {
            return null;
        }

        $authTime = (int) ($claims['auth_time'] ?? $claims['iat'] ?? 0);

        if (
            time() - (int) ($claims['iat'] ?? 0) < self::RENEW_AFTER_SECONDS
            || time() - $authTime > self::MAX_SESSION_DAYS * 86400
            || $authTime < $this->accountChangedAt()
        ) {
            return null;
        }

        return $this->issue([...$claims, 'auth_time' => $authTime]);
    }

    /**
     * When the account's login details last changed; PHP_INT_MAX when unknown, so nothing is renewed.
     */
    private function accountChangedAt(): int
    {
        $file = config('app.old_berta_root') . '/engine/config/inc.conf.php';
        // A password change rewrites the file earlier in the same request.
        clearstatcache(true, $file);
        $changedAt = @filemtime($file);

        return $changedAt === false ? PHP_INT_MAX : $changedAt;
    }

    /**
     * Sets the token cookie the editor's login sets, for requests that send no token header.
     */
    public static function setCookie(string $token): void
    {
        setcookie('token', $token, time() + self::LIFETIME_SECONDS, '/');
    }
}
