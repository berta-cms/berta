<?php

$IS_CSS_FILE = true;
define('SETTINGS_INSTALLREQUIRED', false);
define('SETTINGS_INSTALLCHECKREQUIRED', false);
define('BERTA_ENVIRONMENT', 'engine');
include('../inc.page.php');

$expires= 60 * 60 * 24 * 14; // 14 days
header('Pragma: public');
header('Cache-Control: max-age=' . $expires);
header('Expires: ' . gmdate('D, d M Y H:i:s', time() + $expires) . ' GMT');
header('Last-Modified: ' . gmdate('D, d M Y H:i:s', time() - $expires * 2) . ' GMT');
header("Content-Type: text/css");

$settings =& $berta->template->settings;

if(!1) { ?><style type="text/css"><?php } ?>

.warning {
    color: #BB0000;
}

.button,
button,
input[type="submit"] {
    background-color: #999;
    border: 0;
    padding: 5px 10px;
    -moz-border-radius: 8px;
    -webkit-border-radius: 8px;
    border-radius: 8px;
    cursor: pointer;
}

.button:hover,
button:hover,
input[type="submit"]:hover {
    background-color: #353535;
    color: #fff;
}

#xGridBackground {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}


/* middle-align containers ------------------------------------------------------------------------------------------- */

.xMAlign-container {
    display: table;
}
    .xMAlign-outer {
        display: table-cell;
        vertical-align: middle;
        text-align: center;
        top: 50%;
    }
        .xMAlign-inner {
            display: block;
            top: -50%;
            text-align: center;
        }

    .xMAlign-outer-gallery {
        display: inline-block;
        width: 100%;
        height: 100%;
        text-align: center;
        top: 50%;
    }
        .xMAlign-inner-gallery {
            display: block;
            top: 45%;
            text-align: center;
            position: relative;
        }

.ie6 .xMAlign-container {
    display: block !important;
    top: 0 !important;
}
    .ie6 .xMAlign-outer {
        display: block !important;
        top: 0 !important;
        position: static;
    }


/* visuals ---------------------------------------------------------------------------------------------- */

.xSaving, .xSavingAtLarge {	/* classs is added to the element, when the contents are being saved */
    background-image: url(<?php echo $ENGINE_ROOT_URL ?>layout/saving.gif) !important;
    background-repeat: repeat !important;
}
    .xSavingAtLarge * {
        opacity: 0.5;
        -moz-opacity: 0.5;
    }

.xEditing {	/* class is added to the element when it is being edited by user */
    /*background-color:#FFFFFF !important;
    color: #000000 !important;*/
    background-image: none !important;
    z-index: 1;
}

.xEmpty {	/* class of the span that is placed inside empty editable elements */
    display: inline-block;
    background-color: rgba(255, 255, 153, .79);
    font-style: italic;
    -moz-border-radius: 5px;
    -webkit-border-radius: 5px;
    border-radius: 5px;
    cursor: default !important;
    color: #333 !important;
    /*padding: 2px 2px;
    margin: -2px 0 0;*/
    /*cursor: cell;*/
}

.xHidden {
    display: none !important;
}

.xSysCaption {
    /* anu caption that has to produce system-like feeling  */
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 13px;
    font-weight: bold;
}

.xVisualStatusOK { color: #00cc00; }
.xVisualStatusWarning { color: #cccc00; }
.xVisualStatusFail { color: #ee0000; font-weight: bold; }


/* editables ---------------------------------------------------------------------------------------------- */

.xEditableMCE {
    min-height: 1em;
}

.tox-tinymce {
    border-radius: 0 !important;
}

.tox-tinymce-aux {
    z-index: 100002 !important;
}

.tox:not(.tox-tinymce-inline) .tox-editor-header {
    padding: 0 !important;
}

.tox .tox-toolbar__group {
    padding: 0 4px 0 5px !important;
}

.xEditable,
.xEditableSelect,
.xEditableSelectRC,
.xEditableFontSelect,
.xEditableTA,
.xEditableMCE,
.xEditableRC {
    cursor: default;
}

.xEditableSelect:before,
.xEditableSelectRC:before,
.xEditableFontSelect:before {
    content: url('/engine/layout/drop-down.gif');
}
.xEditing.xEditableSelect:before,
.xEditing.xEditableSelectRC:before,
.xEditing.xEditableFontSelect:before {
    content: "";
}

.xAction {
    cursor:pointer;
}

.xEditable:hover,
.xEditableSelect:hover,
.xEditableSelectRC:hover,
.xEditableFontSelect:hover,
.xEditableTA:hover,
.xEditableMCE:hover,
.xEditableRC:hover,
.xEditableYesNo:hover,
.xAction:hover {
    background-color: rgba(255, 255, 153, .79);
    -moz-border-radius: 5px;
    -webkit-border-radius: 5px;
    border-radius: 5px;
}
.xEditableDragXY {
    cursor: move;
}

.xEditableRealCheck {

}
    .xEditableRealCheck input {
        width: 18px;
        height: 18px;
        border: none;
        padding: 0; margin: 0;
        background: url('/engine/layout/icon-checkbox.png') no-repeat 50% 50%;
        outline: none;
    }
    .xEditableRealCheck input.checked {
        background-image: url('/engine/layout/icon-checkbox-checked.png');
    }


/*a.xEditorLink, a.xEditorLink * {
    text-decoration: underline;
}*/
.xEditableImage {}
.xEditableICO {}
    .xEditableImage span.file, .xEditableICO span.file, .xEditableImage span.name, .xEditableICO span.name {
        display: block;
        float: left;
        margin-right: 10px;
    }
    .xEditableImage a, .xEditableICO a {
        display: block;
        float: left;
        margin-right: 10px;
    }
  .xEditableImage input[type="file"], .xEditableICO input[type="file"] {
    display: none;
  }

.xEditableYesNo {}
    .xEditableYesNo a {
        font-weight: normal;
        outline: none;
    }
    .xEditableYesNo a.active {
        font-weight: bold !important;
        text-transform: uppercase;
        text-decoration: none !important;
    }

.xEditOwerlay {
    position: absolute;
    top: 0;
    left: 0;
    cursor: pointer;
}


/* panel css ------------------------------------------------------------------------------------------- */

.xPanel {
    /* any block element that is an editor for something */
    background-color: #fff;
    color: #333;
}
    .xPanel * {
        font-family: Arial, sans-serif;
        font-size: 12px;
        line-height: 15px;
        text-transform: none;
        text-decoration: none;
        font-weight: normal;
    }
    .xPanel p { margin: 0 0 10px; padding: 0; }
    .xPanel a { color: #666; text-decoration: underline !important; }
    .xPanel a:hover { color: #999; }
    .xPanel b, .xPanel strong, .xPanel b *, .xPanel strong * { font-weight: bold; }
    .xPanel i, .xPanel em, .xPanel i *, .xPanel em * { font-style: italic; }

    .xPanel .xGreyBack a { color: #333; }
    .xPanel .xGreyBack a:hover { color: #666; }


/* background editor button ----------------------------------------------------------------------------------------------- */

#xBgEditorPanelTrigContainer {
    margin: 0;
    padding: 0;
    position: absolute;
    right: 0; top: 0;
}
    #xBgEditorPanelTrigContainer a {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(255, 255, 153, .79);
        width: 40px;
        height: 40px;
    }
      
    #xBgEditorPanelTrigContainer a:hover {
        color: #0c4dff;
    }


/* entries --------------------------------------------------------------------------------------------------- */

.xEntryEditWrap {
    position: relative;
}

.xEntryEditWrapButtons {
    visibility: hidden;
    height: 20px;
    margin: -26px 0 0 0;
    background-color: rgba(255, 102, 153, .57);
    padding: 2px 0 2px 5px;
    -moz-border-radius: 8px;
    -webkit-border-radius: 8px;
    border-radius: 8px;
}
.xEntryHover .xEntryEditWrapButtons {
    visibility: visible;
}

    .xEntryEditWrapButtons a {
        float: left;
        width: 18px;
        height: 18px;
        padding: 1px;
        margin-right: 5px;
        border: none;
        background-color: transparent !important;
        background-position: center center;
        background-repeat: no-repeat;
    }

    .xEntryEditWrapButtons a span { display: none; }
    .xEntryEditWrapButtons a:hover {
        border: 1px solid #ccc;
        background-color: #fff;
        padding: 0px;
    }

    .xEntryEditWrapButtons a.xEntryMove { background-image: url('/engine/layout/icon-move-vertical.png'); cursor: grab; }
    .xEntryEditWrapButtons a.xEntryMoveForbidden { background-image: url('/engine/layout/icon-move-vertical.png'); cursor: default; opacity: 0.4; -moz-opacity: 0.4; }
    .xNoEntryOrdering a.xEntryMove { display: none; }
    .xNoEntryOrdering a.xEntryMoveForbidden { display: none; }

    .xEntryEditWrapButtons .xEntryCheck {
        float: right;
        margin-top: 1px;
    }

    .xEntryEditWrapButtons .xEntryDropdown {
        float: right;
        background: url('/engine/layout/dropdown_sprite.png') no-repeat center 0;
        width: 28px;
        height: 100%;
        cursor: pointer;
    }

    .xEntryEditWrapButtons .xEntryDropdowHover {
        background-position: center -20px;
    }

    .xEntryDropdownBox {
        position: absolute;
        right: 0;
        border: 1px solid #666666;
        background-color: #fff;
        z-index: 56000;
        display: none;
        background: rgba(255, 255, 255, 0.96);
    }

    .xEntryDropdownBox ul {
        padding:0;
        margin:0;
        list-style: none;
        white-space: nowrap;
    }

    .xEntryDropdownBox ul li .customWidth,
    .xEntryDropdownBox ul li a {
        color: #000;
        text-decoration: none;
        display: block;
        padding: 0 18px;
        line-height: 22px;
    }

    .xEntryDropdownBox .customWidth {
        height: 22px;

    }

    .xEntryDropdownBox .customWidth input {
        display: block;
        width: 100%;
    }

    .xEntryDropdownBox ul li:hover {
        background-color: #666666;
        color: #fff;
    }

    .xEntryDropdownBox ul li:hover div,
    .xEntryDropdownBox ul li:hover a {
        color: #fff;
    }

    .xEntryDropdownBox ul li .xEntryCheck {
        position: relative;
        left: -18px;
    }

    .xEntryDropdownBox ul li .xEntryCheck label {
        vertical-align: top;
    }

    .xEntryDropdownBox .xEditableRealCheck input {
        background: none;
        width: 18px;
    }

    .xEntryDropdownBox .xEditableRealCheck input.checked {
        background: url('/engine/layout/check.png') no-repeat center 0;
    }

    .xEntryDropdownBox ul li:hover input.checked {
        background: url('/engine/layout/check.png') no-repeat center -22px;
    }

    .tagsList {
        float: left;
        padding-top: 3px;
        width: 50%;
        height: 18px;
        overflow: hidden;
        white-space: nowrap;

    }

    .tagsList .xEmpty{
        background: none;
    }

    .xPanel .tagsList {
        font-style: italic;
    }

    .bt-move-entry-to-section {
        display: none;
        text-align: right;
    }

.xGalleryContainer  {
    clear: left;
    min-height: 20px;
}
    .xGalleryContainer .entryGallery {
        position: relative;
    }
    .xGalleryContainer .imageEmpty {
        position: relative;
        width: 100%;
        height: 20px;
    }
        .xGalleryHasImages a.xGalleryEditButton {
            position: absolute;
            display: inline-block;
            min-width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            background-color: rgba(255, 255, 153, .79);
            -moz-opacity: 0; opacity: 0;
            z-index: 2;
        }
        .xGalleryHasImages a.xGalleryEditButton:hover {
            -moz-opacity: 1; opacity: 1;
        }

        .xGalleryContainer .entryGallery div.item {
            display: block;
            z-index: 1;
        }
        .xGalleryContainer.xSavingAtLarge div.item {
            visibility: hidden;
        }


a.xCreateNewEntry {
    display: block;
    height: 24px;
    background: transparent;
    margin: 0 0 28px;
    -moz-border-radius: 8px;
    -webkit-border-radius: 8px;
    border-radius: 8px;
}
    a.xCreateNewEntry span {
        display: block;
        width: 100%;
        height: 20px;
        padding: 3px 0 1px;
        background-color: rgba(153, 255, 179, .79);
        -moz-border-radius: 8px;
        -webkit-border-radius: 8px;
        border-radius: 8px;

        text-align: center;
        color: #333 !important;
        text-decoration: none !important;
    }
a.xCreateNewEntry:hover {
    background-color: rgba(153, 255, 179, .79);
}
a.xCreateNewEntry.xSaving {
    background-color: #B7FFCA;
}
    a.xCreateNewEntry.xSaving span {
        background-image: none;
        background-color: transparent;
    }


/* login page ------------------------------------------------------------------------------------------------------- */

body.xLoginPageBody {
    width: 100%;
    height: 100%;
}
    body.xLoginPageBody .xMAlign-container {
        width: 100%;
        height: 100%;
    }
        body.xLoginPageBody .xMAlign-inner {
            width: 400px;
            margin-left: auto;
            margin-right: auto;
            padding: 30px;
        }
            body.xLoginPageBody h2, body.xLoginPageBody h3 {
                margin: 0 0 20px;
            }
            body.xLoginPageBody h2, body.xLoginPageBody h2 * {
                font-size: 42px;
                line-height: 100%;
            }
            body.xLoginPageBody h3, body.xLoginPageBody h3 * {
                font-size: 24px;
                line-height: 120%;
            }

            body.xLoginPageBody .emphasis {
                font-weight: bold;
            }

            body.xLoginPageBody .justify { text-align: justify; }
            body.xLoginPageBody form {
                display: block;
                width: 220px;
                margin: 0 auto 0;
            }

            body.xLoginPageBody form p {
                clear: both;
                color: #000000;
                padding-top: 30px;
                text-align: left;
            }

            body.xLoginPageBody .xLogout {
                display: block;
                width: 220px;
                margin: 0 auto 0;
            }

            body.xLoginPageBody .xLoginLogo {
                text-align: left;
                margin-bottom: 30px;
            }

            body.xLoginPageBody .xMaintenanceInfo {
                clear: both;
                margin: 0 0 20px;
                text-align: left;
                color: red;
            }

            body.xLoginPageBody .xLoginError {
                clear: both;
                margin: 0 0 20px;
                text-align: right;
            }

            body.xLoginPageBody .error { }

            a.social_button {
                display: block;
                padding: .4em 1em;
                border-radius: 4px;
                color: #fff;
                text-align: center;
                text-decoration: none !important;
                letter-spacing: .05em;
                vertical-align: top;
                transition: .4s;
            }

            a.social_button:hover {
                color: #fff;
            }

            a.social_button span {
                font-size: 16px;
                font-weight: normal;
                display: inline-block;
                margin-right: 0.5em;
                vertical-align: middle;
            }

            .social_button_facebook {
                background-color: #4e69a2;
                margin-bottom: 5px;
            }

            .social_button_facebook:hover {
                background-color: #324877;
            }

            .social_button_google {
                background-color: #dd4b39;
            }

            .social_button_google:hover {
                background-color: #A63426;
            }

            body.xLoginPageBody p.social_or {
                text-align: center;
                margin: 10px 0;
                padding: 0;
            }

            body.xLoginPageBody input.xLoginField {
                display: block;
                clear: both;
                width: 214px;
                margin: 0 0 5px;
            }
            body.xLoginPageBody input.xLoginSubmit {
                display: block;
                clear: both;
                width: 110px;
                margin: 0 0 5px;
            }

            body.xLoginPageBody .xBottomNote {
                clear: both;
                padding-top: 20px;
                font-size: 90%;
                color: #999;
            }
                body.xLoginPageBody .xBottomNote code {
                    font-family: "Courier New", Courier, Monaco, mono;
                    font-size: 10px;
                }





/* all that is needed for first time infos ------------------------------------------------------------------------------------ */

#xFirstTimeCheckList {
    text-align: left;
    list-style: none;
    margin: 0 -10px 10px; padding: 10px;

    border: 1px solid #999;
    -moz-border-radius: 5px;
    -webkit-border-radius: 5px;
    border-radius: 5px;
}
    #xFirstTimeCheckList li {
        padding: 0;
        margin: 0 0 10px;
        clear: both;
    }
    #xFirstTimeCheckList li.indented {
        padding-left: 20px;
    }
        #xFirstTimeCheckList li .status {
            float: right;
            width: 50px;
            text-align: right;
        }

        #xFirstTimeCheckList li .infoFail {
            clear: both;
            color: #999;
            padding: 5px 50px 0 10px;
        }

#xFirstTimeCheckResult {
    padding: 40px 0 20px;
}

input#xFirstTimeCheckContinue {
    display: block;
    float: right;
    clear: both;
    width: 210px;
    margin: 10px 0 25px;
}

#xFirstTimeWizzard {

}
    #xFirstTimeWizzard p.subInfo { color: #999; margin-top: -6px; font-size: 90%; }
    #xFirstTimeWizzard p.xEditable {
        padding: 5px !important;
        margin-bottom: 20px !important;
    }
    #xFirstTimeWizzard p.xEditable:before {
        content: "› ";
    }
    #xFirstTimeWizzard p.xEditable, #xFirstTimeWizzard p.xEditable * { font-size: 16px !important;	}


    #multisites li.selected {
        font-weight: bold;
    }


.xGuideLine {
    position: absolute;
    background-color: #4affff;
}

#xGuideLineX {
    height: 1px;
}

#xGuideLineY {
    width: 1px;
    top: 0px;
}


/*------------------------- shop cart --------------------------------*/

.xProperty-cartManualTransfer {
    display: inline-block;
}

#shoppingCartOuter {
    width: 655px;
}

#shoppingCartOuter .fr {
    float: none;
}


/*------------------------- portfolio page --------------------------------*/

.xSectionType-portfolio .xEntry .xCreateNewEntry,
.xSectionType-portfolio .xEntry .xEntryMove {
    display: none;
}

.portfolioThumbnail .xHandle {
    position: absolute;
    left: 50%;
    top: 50%;
    border: 1px solid transparent;
    margin: -9px 0 0 -13px;

    width: 25px;
    height: 25px;
    background: url('/engine/layout/grab.gif') no-repeat center center;
    visibility: hidden;
}
.portfolioThumbnail:hover .xHandle  {
    visibility: visible;
}

.portfolioThumbnail:hover .xHandle:hover {
    border: 1px solid #666;
    background-color: rgba(0, 0, 0, .7);
    cursor: move;
    border-radius: 5px;
}

/* some helpers */

.xVisible {
    display: block;
}

.xFloatLeft {
    float: left;
}


<?php if(!1) { ?></style><?php } ?>
