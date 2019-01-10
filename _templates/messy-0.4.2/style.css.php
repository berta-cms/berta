<?php

$IS_CSS_FILE = true;
include('../../engine/inc.page.php');
$s =& $berta->template->settings;
$isResponsive = $s->get('pageLayout', 'responsive')=='yes' || isset($_GET['responsive']);

$expires= 60 * 60 * 24 * 1;	// 1 day
header('Pragma: public');
header('Cache-Control: max-age=' . $expires);
header('Expires: ' . gmdate('D, d M Y H:i:s', time() + $expires) . ' GMT');
if($lastMod = $berta->settings->get('berta', 'lastUpdated')) {
    header('Last-Modified: ' . $lastMod);
}
header("Content-Type: text/css");

if(!1) { ?><style type="text/css"><?php } ?>

body {
    color: <?php echo $s->get('generalFontSettings', 'color') ?>;
    font-family: <?php echo $s->getFont('generalFontSettings') ?>;
    font-size: <?php echo $s->get('generalFontSettings', 'fontSize') ?>;
    font-weight: <?php echo $s->get('generalFontSettings', 'fontWeight') ?>;
    font-style: <?php echo $s->get('generalFontSettings', 'fontStyle') ?>;
    font-variant: <?php echo $s->get('generalFontSettings', 'fontVariant') ?>;
    line-height: <?php echo $s->get('generalFontSettings', 'lineHeight') ?>;

    background-color: <?php echo $s->get('background', 'backgroundColor') ?>;
    <?php if($s->get('background', 'backgroundImageEnabled') == 'yes') { ?>
        <?php if($s->get('background', 'backgroundImage')) { ?>
            background-image:url(<?php echo Berta::$options['MEDIA_ABS_ROOT'] . $s->get('background', 'backgroundImage') ?>);
        <?php } ?>
        background-repeat: <?php echo $s->get('background', 'backgroundRepeat') ?>;
        background-position: <?php echo $s->get('background', 'backgroundPosition') ?>;
        background-attachment: <?php echo $s->get('background', 'backgroundAttachment') ?>;
    <?php } ?>
}

a:link {
    color: <?php echo $s->get('links', 'colorLink') ?>;
    text-decoration: <?php echo $s->get('links', 'textDecorationLink') ?>;
}
a:visited {
    color: <?php echo $s->get('links', 'colorVisited') ?>;
    text-decoration: <?php echo $s->get('links', 'textDecorationVisited') ?>;
}
a:hover {
    color: <?php echo $s->get('links', 'colorHover') ?>;
    text-decoration: <?php echo $s->get('links', 'textDecorationHover') ?>;
}
a:active {
    color: <?php echo $s->get('links', 'colorActive') ?>;
    text-decoration: <?php echo $s->get('links', 'textDecorationActive') ?>;
}

.xCenteringGuide {
    <?php if($s->get('pageLayout', 'centeringGuidesColor') == 'dark') { ?>
        background-color: rgba(0,0,0,0.5);
    <?php } else { ?>
        background-color: rgba(255,255,255,0.5);
    <?php } ?>
    width: <?php echo $s->get('pageLayout', 'centeredWidth') ?>;
    position: fixed;
    height: 100%;
}

#contentContainer.xCentered {
    width: <?php echo $s->get('pageLayout', 'centeredWidth') ?>;
}
#contentContainer.xResponsive {
    max-width: <?php echo $s->get('pageLayout', 'centeredWidth') ?>;
}

#contentContainer h1 {
    color: <?php echo $s->get('heading', 'color') ?>;
    font-family: <?php echo $s->getFont('heading') ?>;
    font-size: <?php echo $s->get('heading', 'fontSize') ?>;
    font-weight: <?php echo $s->get('heading', 'fontWeight') ?>;
    font-style: <?php echo $s->get('heading', 'fontStyle') ?>;
    font-variant: <?php echo $s->get('heading', 'fontVariant') ?>;
    line-height: <?php echo $s->get('heading', 'lineHeight') ?>;
    position: <?php echo $s->get('heading', 'position') ?> !important;§
}

h1 a,
h1 a:link,
h1 a:visited,
h1 a:hover,
h1 a:active {
    color: <?php echo $s->get('heading', 'color') ?> !important;
}

.menuItem {
    font-family: <?php echo $s->getFont('menu') ?>;
    font-size: <?php echo $s->get('menu', 'fontSize') ?>;
    font-weight: <?php echo $s->get('menu', 'fontWeight') ?>;
    font-style: <?php echo $s->get('menu', 'fontStyle') ?>;
    font-variant: <?php echo $s->get('menu', 'fontVariant') ?>;
    line-height: <?php echo $s->get('menu', 'lineHeight') ?>;
    <?php if( !$isResponsive ){ ?>
        position: <?php echo $s->get('menu', 'position') ?> !important;
    <?php } ?>
}

.menuItem a:link,
.menuItem a:visited {
    color: <?php echo $s->get('menu', 'colorLink') ?>;
    text-decoration: <?php echo $s->get('menu', 'textDecorationLink') ?>;
}

.menuItem a:hover,
.menuItem a:active {
    color: <?php echo $s->get('menu', 'colorHover') ?>;
    text-decoration: <?php echo $s->get('menu', 'textDecorationHover') ?>;
}

.menuItemSelected > a,
.menuItemSelected > span {
    color: <?php echo $s->get('menu', 'colorActive') ?> !important;
    text-decoration: <?php echo $s->get('menu', 'textDecorationActive') ?> !important;
}

.menuItem ul {
    left: <?php echo $s->get('tagsMenu', 'x') ?>;
    top: <?php echo $s->get('tagsMenu', 'y') ?>;
}

.menuItem li {
    font-family: <?php echo $s->getFont('tagsMenu') ?>;
    font-size: <?php echo $s->get('tagsMenu', 'fontSize') ?>;
    font-weight: <?php echo $s->get('tagsMenu', 'fontWeight') ?>;
    font-style: <?php echo $s->get('tagsMenu', 'fontStyle') ?>;
    font-variant: <?php echo $s->get('tagsMenu', 'fontVariant') ?>;
    line-height: <?php echo $s->get('tagsMenu', 'lineHeight') ?>;
}

.menuItem li a:link,
.menuItem li a:visited {
    color: <?php echo $s->get('tagsMenu', 'colorLink') ?>;
    text-decoration: <?php echo $s->get('tagsMenu', 'textDecorationLink') ?>;
}

.menuItem li a:hover,
.menuItem li a:active {
    color: <?php echo $s->get('tagsMenu', 'colorHover') ?>;
    text-decoration: <?php echo $s->get('tagsMenu', 'textDecorationHover') ?>;
}

.menuItem li.selected > a {
    color: <?php echo $s->get('tagsMenu', 'colorActive') ?> !important;
    text-decoration: <?php echo $s->get('tagsMenu', 'textDecorationActive') ?> !important;
}

#pageEntries .xEntry {
    <?php if( $isResponsive ){ ?>
        min-height: 1px;
        -webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;
    <?php } else { ?>
        max-width: <?php echo $s->get('entryLayout', 'contentWidth') ?>;
        min-width: 150px;
        padding: 0;
        clear: both;
    <?php } ?>
}

#pageEntries .xEntry h2 {
    color: <?php echo $s->get('entryHeading', 'color') ?>;
    font-family: <?php echo $s->getFont('entryHeading') ?>;
    font-size: <?php echo $s->get('entryHeading', 'fontSize') ?>;
    font-weight: <?php echo $s->get('entryHeading', 'fontWeight') ?>;
    font-style: <?php echo $s->get('entryHeading', 'fontStyle') ?>;
    font-variant: <?php echo $s->get('entryHeading', 'fontVariant') ?>;
    line-height: <?php echo $s->get('entryHeading', 'lineHeight') ?>;
    margin: <?php echo $s->get('entryHeading', 'margin') ?>;
}

#pageEntries .xEntry .xGalleryContainer {
    margin-bottom: <?php echo $s->get('entryLayout', 'galleryMargin') ?>;
}

#pageEntries .xEntry .xGalleryType-slideshow .xGallery {
    margin-bottom: <?php echo $s->get('entryLayout', 'galleryNavMargin') ?>;
}

#pageEntries .xEntry .xGalleryType-column .xGalleryItem {
    padding-bottom: <?php echo $s->get('entryLayout', 'spaceBetweenImages') ?>;
}

#pageEntries .xEntry .xGalleryType-row .xGalleryItem {
    margin-right: <?php echo $s->get('entryLayout', 'spaceBetweenImages') ?>;
}

#pageEntries .xEntry .xGalleryContainer ul.xGalleryNav a {
    color: <?php echo $s->get('menu', 'colorLink') ?>;
    text-decoration: <?php echo $s->get('menu', 'textDecorationLink') ?>;
}

#pageEntries .xGalleryContainer ul.xGalleryNav li a:hover {
    color: <?php echo $s->get('menu', 'colorHover') ?>;
    text-decoration: <?php echo $s->get('menu', 'textDecorationHover') ?>;
}

#pageEntries .xGalleryContainer ul.xGalleryNav li.selected a {
    color: <?php echo $s->get('menu', 'colorActive') ?>;
    text-decoration: <?php echo $s->get('menu', 'textDecorationActive') ?>;
}

#xBackground #xBackgroundLoader {
    background: url(layout/loader_<?php echo $s->get('pageLayout', 'bgButtonType') ?>.gif) no-repeat;
}

#xBackground .visual-caption {
    width: <?php echo $s->get('entryLayout', 'contentWidth') ?>;
    margin-left: -<?php echo $s->get('entryLayout', 'contentWidth')/2 ?>px;
}

#xBackground #xBackgroundRight {
    <?php if (preg_match('/msie/i',$DEVICE_USER_AGENT)) { ?>
        cursor: url(layout/arrow_right_<?php echo $s->get('pageLayout', 'bgButtonType') ?>.cur), pointer;
    <?php } else { ?>
        cursor: url(layout/arrow_right_<?php echo $s->get('pageLayout', 'bgButtonType') ?>.gif), pointer;
    <?php } ?>
}

#xBackground #xBackgroundLeft {
    <?php if (preg_match('/msie/i',$DEVICE_USER_AGENT)) { ?>
        cursor: url(layout/arrow_left_<?php echo $s->get('pageLayout', 'bgButtonType') ?>.cur), pointer;
    <?php } else { ?>
        cursor: url(layout/arrow_left_<?php echo $s->get('pageLayout', 'bgButtonType') ?>.gif), pointer;
    <?php } ?>
}

#xBackground #xBackgroundRightCounter,
#xBackground #xBackgroundLeftCounter {
    color: <?php echo $s->get('heading', 'color') ?>;
    font-family: <?php echo $s->getFont('heading') ?>;
    font-size: <?php echo $s->get('heading', 'fontSize') ?>;
    font-weight: <?php echo $s->get('heading', 'fontWeight') ?>;
    font-style: <?php echo $s->get('heading', 'fontStyle') ?>;
    font-variant: <?php echo $s->get('heading', 'fontVariant') ?>;
    line-height: <?php echo $s->get('heading', 'lineHeight') ?>;
}

#xBackground #xBackgroundRightCounter .counterContent {
    <?php if (preg_match('/msie/i',$DEVICE_USER_AGENT)) { ?>
        cursor: url(layout/arrow_right_<?php echo $s->get('pageLayout', 'bgButtonType') ?>.cur), pointer;
    <?php } else { ?>
        cursor: url(layout/arrow_right_<?php echo $s->get('pageLayout', 'bgButtonType') ?>.gif), pointer;
    <?php } ?>
}

#xBackground #xBackgroundLeftCounter .counterContent {
    <?php if (preg_match('/msie/i',$DEVICE_USER_AGENT)) { ?>
        cursor: url(layout/arrow_left_<?php echo $s->get('pageLayout', 'bgButtonType') ?>.cur), pointer;
    <?php } else { ?>
        cursor: url(layout/arrow_left_<?php echo $s->get('pageLayout', 'bgButtonType') ?>.gif), pointer;
    <?php } ?>
}

#xBackgroundNext a,
#xBackgroundPrevious a {
    background: url(layout/bg_nav_buttons_<?php echo $s->get('pageLayout', 'bgButtonType') ?>.png);
}

#xGridView {
    left: <?php echo (100 - $s->get('grid', 'contentWidth'))/2 ?>%;
    right: <?php echo (100 - $s->get('grid', 'contentWidth'))/2 ?>%;
    width: <?php echo $s->get('grid', 'contentWidth') ?>;
}

#xGridViewTriggerContainer a {
    background: url('layout/bg_nav_buttons_<?php echo $s->get('pageLayout', 'bgButtonType') ?>.png');
}

.portfolioThumbnailsWrap {
    margin: <?php echo $s->get('pageLayout', 'menuMargin') ?>;
}

.bt-responsive #contentContainer h1 {
    margin: <?php echo $s->get('pageLayout', 'headingMargin') ?>;
}

.bt-responsive nav {
    margin: <?php echo $s->get('pageLayout', 'menuMargin') ?>;
}

<?php if ($isResponsive) { ?>

    <?php if($s->get('pageLayout', 'centeredContents') == 'yes') { ?>

        #allContainer {
            text-align: center;
        }

        #multisites {
            margin-top: 20px;
        }

        #contentContainer h1 {
            clear: both;
        }

        nav {
            text-align: center;
        }

        nav ul li {
            margin-left: 5px;
            margin-right: 5px;
        }

        #menuToggle span, #menuToggle span:before, #menuToggle span:after {
            text-align: left;
        }

        .menuItem li {
            text-align: left;
        }

        #pageEntries .xEntry,
        #pageEntries .xEntry .xGalleryContainer .xGallery,
        #pageEntries .xEntry .xGalleryType-slideshow .xGallery,
        #pageEntries .xEntry .xGalleryContainer .xGallery .xGalleryItem {
            margin: 0 auto;
        }

        #pageEntries .xEntry .xGalleryContainer ul.xGalleryNav li {
            float: none;
            display: inline-block;
        }

    <?php } ?>

    /* small tablet */
    @media (max-width: 767px) {

        #pageEntries .xEntry .xGalleryType-row .xGallery .xGalleryItem {
            padding-bottom: <?php echo $s->get('entryLayout', 'spaceBetweenImages') ?>;
        }

        <?php if($s->get('pageLayout', 'centeredContents') == 'yes') { ?>
            .menuItem li {
                text-align: center;
            }
        <?php } ?>
    }

<?php } ?>

@media (max-width: 767px) {
    .bt-auto-responsive .menuItem,
    .bt-auto-responsive .floating-banner {
        left: auto !important;
        position: static !important;
        top: auto !important;
    }

    .bt-auto-responsive #contentContainer {
        width: auto;
        max-width: <?php echo $s->get('pageLayout', 'centeredWidth') ?>;
    }

    .bt-auto-responsive #pageEntries .xEntry {
        min-height: 1px;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        width: auto !important;  /* @TODO remove this if auto responsive will use columns for entries */
    }

    .bt-auto-responsive #contentContainer h1 {
        margin: <?php echo $s->get('pageLayout', 'headingMargin') ?>;
    }

    .bt-auto-responsive nav {
        margin: <?php echo $s->get('pageLayout', 'menuMargin') ?>;
    }

    <?php if($s->get('pageLayout', 'centeredContents') == 'yes') { ?>

        .bt-auto-responsive #allContainer {
            text-align: center;
        }

        .bt-auto-responsive #multisites {
            margin-top: 20px;
        }

        .bt-auto-responsive #contentContainer h1 {
            clear: both;
        }

        .bt-auto-responsive nav {
            text-align: center;
        }

        .bt-auto-responsive nav ul li {
            margin-left: 5px;
            margin-right: 5px;
        }

        .bt-auto-responsive #menuToggle span,
        .bt-auto-responsive #menuToggle span:before,
        .bt-auto-responsive #menuToggle span:after {
            text-align: left;
        }

        .bt-auto-responsive .menuItem li {
            text-align: left;
        }

        .bt-auto-responsive #pageEntries .xEntry,
        .bt-auto-responsive #pageEntries .xEntry .xGalleryContainer .xGallery,
        .bt-auto-responsive #pageEntries .xEntry .xGalleryType-slideshow .xGallery,
        .bt-auto-responsive #pageEntries .xEntry .xGalleryContainer .xGallery .xGalleryItem {
            margin: 0 auto;
        }

        .bt-auto-responsive #pageEntries .xEntry .xGalleryContainer ul.xGalleryNav li {
            float: none;
            display: inline-block;
        }

    <?php } ?>

    /* helpers */

    .bt-auto-responsive #pageEntries .xEntry .xGalleryType-row .xGallery .xGalleryItem {
        padding-bottom: <?php echo $s->get('entryLayout', 'spaceBetweenImages') ?>;
    }

    <?php if($s->get('pageLayout', 'centeredContents') == 'yes') { ?>
        .bt-auto-responsive .menuItem li {
            text-align: center;
        }
    <?php } ?>
}

<?php if(!1) { ?></style><?php } ?>
