<?php

/**
 * Sends the visitor to the Angular editor, which shows the requirements check and
 * the setup wizard. Redirects only the top window: the editor's preview iframe also
 * loads the site while showing the login form, and waits for the `xLoginPageBody`
 * body class.
 *
 * Keep this file parsable by old PHP versions, it runs before the PHP version check
 * can stop the request (see loader.helper.php).
 *
 * @param string $editorUrl
 */
function bertaRenderEditorRedirect($editorUrl)
{
    echo '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Berta</title>'
        . '<script>if (window.top === window.self) { window.location.replace(' . json_encode($editorUrl) . '); }</script>'
        . '</head><body class="xLoginPageBody"><noscript><a href="' . htmlspecialchars($editorUrl) . '">Log in to set up your site</a></noscript></body></html>';
}
