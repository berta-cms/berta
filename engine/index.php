<?php
if (empty($INDEX_INCLUDED)) { $INDEX_INCLUDED = false; }

if (!$INDEX_INCLUDED) {
    define('AUTH_AUTHREQUIRED', true); // require authentification if inside engine folder
    define('BERTA_ENVIRONMENT', 'engine');
} else {
    define('SETTINGS_INSTALLREQUIRED', true);	// don't require INSTALL if just watching the site
}

include __dir__ . '/inc.page.php';

if (!$berta->security->userLoggedIn) {
    if ($INDEX_INCLUDED) {
        include_once $ENGINE_ROOT_PATH . 'editor/inc.editor.php';
        exit;
    }
    else {
        header('Location: /');
        exit;
    }
}
include_once $ENGINE_ROOT_PATH . '_classes/class.bertaeditor.php';

$int_version = BertaEditor::$options['int_version'];
$site = !empty($_REQUEST['site']) ? $_REQUEST['site'] : false;

?><!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title><?php echo $berta->settings->get('texts', 'pageTitle') ?></title>
    <link rel="SHORTCUT ICON" href="<?php echo $SITE_ROOT_URL ?>favicon.ico"/>
    <link rel="stylesheet" href="<?php echo $ENGINE_ROOT_URL ?>css/backend.min.css?<?php echo $int_version ?>" type="text/css" charset="utf-8" />
    <link rel="stylesheet" href="<?php echo $ENGINE_ROOT_URL ?>css/editor.css.php?<?php echo $int_version ?>" type="text/css" charset="utf-8" />
    <link rel="stylesheet" href="<?php echo $ENGINE_ROOT_URL ?>_lib/introjs/introjs.min.css?<?php echo $int_version ?>" type="text/css" charset="utf-8" />
    <script src="<?php echo $ENGINE_ROOT_URL ?>_lib/mootools/mootools-core-1.4.5-full-compat-yc.js"></script>
    <script src="<?php echo $ENGINE_ROOT_URL ?>_lib/mootools/mootools-1.2.5.1-more.js"></script>
    <script src="<?php echo $ENGINE_ROOT_URL ?>_lib/introjs/intro.min.js"></script>

    <script type="text/javascript">
    var bertaGlobalOptions = {
        "paths": {
            "engineRoot": "<?php echo BertaEditor::$options['ENGINE_ROOT_URL'] ?>",
            "engineABSRoot": "<?php echo BertaEditor::$options['ENGINE_ROOT_URL'] ?>",
            "siteABSRoot": "<?php echo BertaEditor::$options['SITE_ROOT_URL'] ?>",
            "template": "<?php echo BertaEditor::$options['SITE_ROOT_URL'] . '_templates/' . $berta->template->name . '/' ?>",
            "updateUrl": "<?php echo BertaEditor::$options['ENGINE_ROOT_URL'] ?>/update.php"
        },
        "skipTour": <?php echo (isset($sections) && count($sections)) || $berta->settings->get('siteTexts', 'tourComplete') ? 'true' : 'false' ?>,
        "session_id": "<?php echo session_id() ?>"
    };
    </script>
    <?php echo BertaTemplate::sentryScripts(); ?>
    <script src="<?php echo $ENGINE_ROOT_URL ?>js/berta.helpers.js"></script>
    <script src="<?php echo $ENGINE_ROOT_URL ?>js/berta.engine.js"></script>
    <style>
        html,body {
            width: 100%;
            height: 100%;
            margin: 0;
        }
        body {
            overflow-y: hidden;
        }
    </style>
</head>
<body class="bt-content-editor page-xMySite">
    <?php echo BertaEditor::getTopPanelHTML('site') ?>
    <iframe sandbox="allow-same-origin allow-scripts allow-modals" src="<?php echo $ENGINE_ROOT_URL ?>editor<?php echo $site ? "?site=$site" : '' ?>" frameborder="0" style="width:100%;height:100%;"></iframe>
    <script>
        (function(){
            var topPanelContainer = document.getElementById('xTopPanelContainer');
            var topMenu = window.Berta.Engine.initTopMenu(topPanelContainer);
            window.Berta.Engine.initNewsTicker($('xNewsTickerContainer'));
            window.BertaHelpers.initTour(topPanelContainer, bertaGlobalOptions.updateUrl);

            window.addEventListener('message', function (event) {
                var eventData = (event.data && event.data.split('=')) || [];

                switch (eventData[0]) {
                    case 'menu:show':

                        if (topMenu) {
                            topMenu.show();
                        }
                        break;

                    case 'menu:hide':
                        if (topMenu) {
                            topMenu.hide();
                        }
                        break;

                    case 'menu:set_site':
                        topMenu.setSiteInURLs(eventData[1]);
                        break;

                    case 'user:logout':
                        window.location.reload();
                        break;
                }
            });
        })();
    </script>
</body>
</html>
