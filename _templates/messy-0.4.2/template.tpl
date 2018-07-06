<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    {if $berta.section.type == 'portfolio'}
        {assign var=isResponsive value='yes'}
    {else}
        {assign var=isResponsive value=$berta.settings.pageLayout.responsive}
    {/if}
    {if $isResponsive=='yes'}<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">{/if}
    <meta name="keywords" content="{if $berta.section.seoKeywords}{ $berta.section.seoKeywords|strip_tags|escape }{else}{ $berta.settings.texts.metaKeywords|strip_tags|escape }{/if}">
    <meta name="description" content="{if $berta.section.seoDescription}{ $berta.section.seoDescription|strip_tags|escape }{else}{ $berta.settings.texts.metaDescription|strip_tags|escape }{/if}">
    <meta name="author" content="{ $berta.settings.texts.ownerName }">
    {if $berta.options.NOINDEX || !$berta.section.published}<meta name="robots" content="noindex, nofollow">{/if}
    {$berta.settings.settings.googleSiteVerification|@html_entity_decode}
    <title>{if $berta.section.seoTitle}{ $berta.section.seoTitle|strip_tags|escape }{else}{ $berta.pageTitle|strip_tags|escape }{/if}</title>

    { if $berta.settings.pageLayout.favicon }
    <link rel="SHORTCUT ICON" href="{ $berta.options.MEDIA_ABS_ROOT }{ $berta.settings.pageLayout.favicon }">
    { else }
    <link rel="SHORTCUT ICON" href="{ $berta.options.TEMPLATES_ABS_ROOT }{ $berta.templateName }/favicon.ico">
    { /if }
    { if ($berta.section.type == 'shopping_cart' &&  $berta.environment == 'engine') || $berta.section.type != 'shopping_cart'  }
    { $berta.scripts }
    { $berta.css }
    {* section related CSS for responsive layout *}
    {if $isResponsive=='yes'}
        <style type="text/css">
            #pageEntries .xEntry {literal}{{/literal}
                padding: {if $berta.section.entryPadding }{ $berta.section.entryPadding }{ else }{ $berta.sectionTypes.default.params.entryPadding.default }{/if};
                {if $berta.section.entryMaxWidth}
                    max-width: { $berta.section.entryMaxWidth };
                {/if}
            {literal}}{/literal}
        </style>
    {/if}
    { if $berta.shop_enabled == true }
        <link rel="stylesheet" href="{ $berta.options.SITE_ROOT_URL }_plugin_shop/css/shop.css.php?{$berta.options.int_version}{if $berta.options.MULTISITE}&amp;site={$berta.options.MULTISITE}{/if}" type="text/css">
    { /if }

    {if $berta.settings.css.customCSS}
        <style type="text/css">
        {$berta.settings.css.customCSS|@html_entity_decode|replace:'<br />':"\n"}
        </style>
    {/if}
    { googleWebFontsAPI }
    { /if }
    <script type="text/javascript" src="{ $berta.options.TEMPLATES_ABS_ROOT }{ $berta.templateName }/mess.js?{$berta.options.int_version}"></script>
    <script type="text/javascript" src="{ $berta.options.TEMPLATES_ABS_ROOT }{ $berta.templateName }/mooMasonry.js"></script>

    { if $berta.shop_enabled == true }
        <script type="text/javascript" src="{ $berta.options.SITE_ROOT_URL }_plugin_shop/js/shop.js?{$berta.options.int_version}"></script>
    { /if }
</head>

<body class="xContent-{ $berta.section.name }{if $berta.tagName} xSubmenu-{$berta.tagName}{/if}{if $berta.environment == 'engine'} page-xMySite{/if}{if $berta.section.type} xSectionType-{ $berta.section.type }{/if}">
    { if ($berta.section.type == 'shopping_cart' &&  $berta.environment == 'engine') || $berta.section.type != 'shopping_cart'  }

        {* *** section background ************************************************* *}
        { $bgAttr = $berta.section.mediaCacheData['@attributes'] }
        { $bgFileAttr = $berta.section.mediaCacheData.file['@attributes'] }
        <div id="xBackgroundContainer">
            <div id="xBackground" class="xBgDataAutoplay-{ $bgAttr.autoplay } xBgDataImageSize-{ $bgAttr.image_size } xBgDataFading-{ if $berta.environment == 'site' }{ $bgAttr.fade_content }{ /if } xBgDataAnimation-{ $bgAttr.animation }" { if $berta.section.sectionBgColor }style="background-color: { $berta.section.sectionBgColor }"{ /if }>
                <div id="xBackgroundLoader"></div>
                {* if only one image *}
                { if $bgFileAttr && $bgFileAttr.type == 'image' && !($smarty.cookies._berta_grid_view && $berta.section.type == 'grid') }

                    <div class="visual-list">
                    { if  $bgFileAttr.type == 'image' }
                        { if $berta.section.mediaCacheData.file.value }
                            <textarea {if $smarty.cookies._berta_grid_img_link && $smarty.cookies._berta_grid_img_link == $bgFileAttr.src }class="sel"{ elseif !$smarty.cookies._berta_grid_img_link }class="sel"{ /if }>{ $berta.section.mediaCacheData.file.value }</textarea>
                            <input type="hidden" width="{ $bgFileAttr.width }" height="{ $bgFileAttr.height }" src="{ $berta.options.MEDIA_ABS_ROOT }{ $berta.section.mediafolder }/_bg_{ $bgFileAttr.src }" />
                        { else }
                            <input type="hidden" width="{ $bgFileAttr.width }" height="{ $bgFileAttr.height }" src="{ $berta.options.MEDIA_ABS_ROOT }{ $berta.section.mediafolder }/_bg_{ $bgFileAttr.src }" { if $smarty.cookies._berta_grid_img_link && $smarty.cookies._berta_grid_img_link == $bgFileAttr.src }class="sel"{ elseif !$smarty.cookies._berta_grid_img_link }class="sel"{ /if } />
                        { /if }
                    { /if }
                    </div>

                    { if $berta.section.mediaCacheData.file.value }
                        <div class="visual-image">
                        </div>
                        <div class="visual-caption" style="{ if $bgAttr.caption_bg_color }background: rgb({ $bgAttr.caption_bg_color }); background: rgba({ $bgAttr.caption_bg_color },0.5);{ /if }{ if $bgAttr.caption_color } color: { $bgAttr.caption_color }{ /if }">
                            <div class="caption-content">{ $berta.section.mediaCacheData.file.value }</div>
                        </div>
                    { else }
                        <div class="visual-image">
                            <img width="{ $bgFileAttr.width }" height="{ $bgFileAttr.height }" src="{ $berta.options.MEDIA_ABS_ROOT }{ $berta.section.mediafolder }/_bg_{ $bgFileAttr.src }" class="bg-element" />
                        </div>
                        <div class="visual-caption" style="{ if $bgAttr.caption_bg_color }background: rgb({ $bgAttr.caption_bg_color }); background: rgba({ $bgAttr.caption_bg_color },0.5);{ /if }{ if $bgAttr.caption_color } color: { $bgAttr.caption_color }{ /if }">
                        </div>
                    { /if }

                {* if two or more images *}
                { elseif $berta.section.mediaCacheData.file && !$bgFileAttr && !($smarty.cookies._berta_grid_view && $berta.section.type == 'grid') }

                    {* if thumbnail cookie has been created *}
                    { if $smarty.cookies._berta_grid_img_link }
                        <div class="visual-list">
                        { foreach $berta.section.mediaCacheData.file as $fKey => $fVal }
                            { if  $fVal['@attributes'].type == 'image' }
                                { if $fVal['value'] }
                                    <textarea>{ $fVal['value'] }</textarea>
                                    <input type="hidden" width="{ $fVal['@attributes'].width }" height="{ $fVal['@attributes'].height }" src="{ $berta.options.MEDIA_ABS_ROOT }{ $berta.section.mediafolder }/_bg_{ $fVal['@attributes'].src }" {if $smarty.cookies._berta_grid_img_link && $smarty.cookies._berta_grid_img_link == $fVal['@attributes'].src }class="sel"{ elseif !$smarty.cookies._berta_grid_img_link && $fVal@first }class="sel"{ /if } />
                                { else }
                                    <input type="hidden" width="{ $fVal['@attributes'].width }" height="{ $fVal['@attributes'].height }" src="{ $berta.options.MEDIA_ABS_ROOT }{ $berta.section.mediafolder }/_bg_{ $fVal['@attributes'].src }" {if $smarty.cookies._berta_grid_img_link && $smarty.cookies._berta_grid_img_link == $fVal['@attributes'].src }class="sel"{ elseif !$smarty.cookies._berta_grid_img_link && $fVal@first }class="sel"{ /if } />
                                { /if }
                            { /if }
                        { /foreach }
                        </div>

                        { foreach $berta.section.mediaCacheData.file as $fKey => $fVal }
                            { if $smarty.cookies._berta_grid_img_link == $fVal['@attributes'].src }
                                <div class="visual-image">
                                    <img width="{ $fVal['@attributes'].width }" height="{ $fVal['@attributes'].height }" src="{ $berta.options.MEDIA_ABS_ROOT }{ $berta.section.mediafolder }/_bg_{ $fVal['@attributes'].src }" class="bg-element" />
                                </div>
                                <div class="visual-caption" style="{ if $bgAttr.caption_bg_color }background: rgb({ $bgAttr.caption_bg_color }); background: rgba({ $bgAttr.caption_bg_color },0.5);{ /if }{ if $bgAttr.caption_color } color: { $bgAttr.caption_color }{ /if }">
                                </div>
                            { /if }
                        { /foreach }

                    {* if no thumbnail cookie *}
                    { else }
                        <div class="visual-list">
                        { foreach $berta.section.mediaCacheData.file as $fKey => $fVal }
                        { if  $fVal['@attributes'].type == 'image' }
                            { if $fVal['value'] }
                                <textarea {if $smarty.cookies._berta_grid_img_link && $smarty.cookies._berta_grid_img_link == $fVal['@attributes'].src }class="sel"{ elseif !$smarty.cookies._berta_grid_img_link && $fVal@first }class="sel"{ /if }>{ $fVal['value'] }</textarea>
                                <input type="hidden" width="{ $fVal['@attributes'].width }" height="{ $fVal['@attributes'].height }" src="{ $berta.options.MEDIA_ABS_ROOT }{ $berta.section.mediafolder }/_bg_{ $fVal['@attributes'].src }" />
                            { else }
                                <input type="hidden" width="{ $fVal['@attributes'].width }" height="{ $fVal['@attributes'].height }" src="{ $berta.options.MEDIA_ABS_ROOT }{ $berta.section.mediafolder }/_bg_{ $fVal['@attributes'].src }" {if $smarty.cookies._berta_grid_img_link && $smarty.cookies._berta_grid_img_link == $fVal['@attributes'].src }class="sel"{ elseif !$smarty.cookies._berta_grid_img_link && $fVal@first }class="sel"{ /if } />
                            { /if }
                        { /if }
                        { /foreach }
                        </div>

                        { foreach $berta.section.mediaCacheData.file as $fKey => $fVal }
                            { if $fVal@first && $fVal['@attributes'].type == 'image' }
                                { if $fVal['value'] }
                                    <div class="visual-image">
                                    </div>
                                    <div class="visual-caption" style="{ if $bgAttr.caption_bg_color }background: rgb({ $bgAttr.caption_bg_color }); background: rgba({ $bgAttr.caption_bg_color },0.5);{ /if }{ if $bgAttr.caption_color } color: { $bgAttr.caption_color }{ /if }">
                                        <div class="caption-content">{ $fVal['value'] }</div>
                                    </div>
                                { else }
                                    <div class="visual-image">
                                        <img width="{ $fVal['@attributes'].width }" height="{ $fVal['@attributes'].height }" src="{ $berta.options.MEDIA_ABS_ROOT }{ $berta.section.mediafolder }/_bg_{ $fVal['@attributes'].src }" class="bg-element" />
                                    </div>
                                    <div class="visual-caption" style="{ if $bgAttr.caption_bg_color }background: rgb({ $bgAttr.caption_bg_color }); background: rgba({ $bgAttr.caption_bg_color },0.5);{ /if }{ if $bgAttr.caption_color } color: { $bgAttr.caption_color }{ /if }">
                                    </div>
                                { /if }
                            { /if }
                        { /foreach }
                    { /if }

                { /if }

                {* activate click on background & background content counter if not on mobile device & background has more than one element & grid view is not active  *}
                { if !$berta.options.MOBILE_DEVICE && ($berta.section.mediaCacheData.file|@count > 1 || $berta.section.mediaCacheData.file.value) && !($berta.section.type == 'grid' && $smarty.cookies._berta_grid_view) }
                    <div id="xBackgroundLeft"></div>
                    <div id="xBackgroundRight"></div>
                    <div id="xBackgroundLeftCounter"{if $bgAttr.hide_navigation=='yes' || $isResponsive=='yes'} class="xHidden"{/if}><div class="counterContent"></div></div>
                    <div id="xBackgroundRightCounter"{if $bgAttr.hide_navigation=='yes' || $isResponsive=='yes'} class="xHidden"{/if}><div class="counterContent"></div></div>
                { /if }
            </div>

            {* show arrows if on mobile device & background has more than one element & grid view is not active *}
            { if $berta.options.MOBILE_DEVICE && ($berta.section.mediaCacheData.file|@count > 1 || $berta.section.mediaCacheData.file.value) && !($berta.section.type == 'grid' && $smarty.cookies._berta_grid_view) }
                <div id="xBackgroundPrevious"{if $bgAttr.hide_navigation=='yes'} class="xHidden"{/if}><a href="#"><span>previous</span></a></div>
                <div id="xBackgroundNext"{if $bgAttr.hide_navigation=='yes'} class="xHidden"{/if}><a href="#"><span>next</span></a></div>
            { /if }
        </div>

        {if $berta.section.backgroundVideoEmbed && strlen(trim($berta.section.backgroundVideoEmbed))>0}
            <div id="xBackgroundVideoEmbed" class="{if $berta.section.backgroundVideoRatio}{$berta.section.backgroundVideoRatio}{else}fillWindow{/if}">{$berta.section.backgroundVideoEmbed|htmlspecialchars_decode}</div>
        {/if}

        {* background grid *}
        {if $berta.environment == 'engine' && $berta.settings.pageLayout.showGrid == 'yes' && $berta.settings.pageLayout.gridStep > 1 }
            <div id="xGridBackground" style="background-size: {$berta.settings.pageLayout.gridStep*5}px {$berta.settings.pageLayout.gridStep*5}px, {$berta.settings.pageLayout.gridStep*5}px {$berta.settings.pageLayout.gridStep*5}px, {$berta.settings.pageLayout.gridStep}px {$berta.settings.pageLayout.gridStep}px, {$berta.settings.pageLayout.gridStep}px {$berta.settings.pageLayout.gridStep}px; background-image: linear-gradient(rgba({if $berta.settings.pageLayout.gridColor=='white'}255, 255, 255{else}0, 0, 0{/if}, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba({if $berta.settings.pageLayout.gridColor=='white'}255, 255, 255{else}0, 0, 0{/if}, 0.5) 1px, transparent 0px), linear-gradient(rgba({if $berta.settings.pageLayout.gridColor=='white'}255, 255, 255{else}0, 0, 0{/if}, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba({if $berta.settings.pageLayout.gridColor=='white'}255, 255, 255{else}0, 0, 0{/if}, 0.2) 1px, transparent 0px);"></div>
        {/if}

        {if $berta.settings.background.backgroundAttachment=='fill' AND $berta.settings.background.backgroundImageEnabled=='yes' AND $berta.settings.background.backgroundImage!=''}
            <div id="xFilledBackground" class="xPosition-{' '|str_replace:'_':$berta.settings.background.backgroundPosition}">
                <img src="{ $berta.options.MEDIA_ABS_ROOT }{ $berta.settings.background.backgroundImage }" />
            </div>
        {/if}

        {* check for shop *}
        { if $berta.shop_enabled == true }
        	{ assign var="shoppingCartSection" value="" }
            { foreach $berta.publishedSections as $sName => $section }
                { if $section.type == 'shopping_cart' }
                        { assign var="shoppingCartSection" value=$berta.publishedSections.$sName }
                { /if }
            { /foreach }
        { /if }

        {* all templates must include allContainer *}
        <div id="allContainer">

        {* engine panel lives in pageHeader - don't leave it out *}
        {* { pageHeader } *}
    { /if }

    {* F awesome hack. Dont do it in future *}
    { if $berta.section.type == 'shopping_cart' }
        { if $berta.environment == 'engine' }
        <div style="height: 50px"></div>
        { /if }
        { include file="../../_plugin_shop/_includes/inc.shopping_cart.tpl"  }
        </div> {* allContainer *}
    { else }

            <div id="contentContainer" class="{ if $berta.settings.pageLayout.centered=='yes' }xCentered { /if }{ if $isResponsive=='yes' }xResponsive{ /if }">

                {* *** shopping cart link ********************************************************************* *}
                { if $berta.shop_enabled == true }

                    { if $shoppingCartSection }
                        <div id="shoppingCart" class="{ messClasses property='shoppingCartXY' isResponsive=$isResponsive }"{if $shoppingCartXY} style="{ messStyles xy=$shoppingCartXY isResponsive=$isResponsive }"{/if}{if $berta.environment == 'engine' && $isResponsive != 'yes'} data-path="{ $berta.options.MULTISITE }/settings/siteTexts/shoppingCartXY"{ /if }>
                            {if $berta.environment == 'engine' }
                                <a href="{ bertaLink section=$shoppingCartSection.name }" id="xShoppingCart"><span class="title">{ if $berta.settings.shop.cartImage }<img src="{ $berta.options.MEDIA_ABS_ROOT }{ $berta.settings.shop.cartImage }" alt="{ $shoppingCartSection.title }" title="{ $shoppingCartSection.title }" />{else}{ $shoppingCartSection.title }{/if}</span><span class="numItemsContainer hidden"> (<span class="numItems">0</span>)</span></a>
                            {else}
                                <a href="javascript:openShoppingCart('{ bertaLink section=$shoppingCartSection.name }');"><span class="title">{ if $berta.settings.shop.cartImage }<img src="{ $berta.options.MEDIA_ABS_ROOT }{ $berta.settings.shop.cartImage }" alt="{ $shoppingCartSection.title }" title="{ $shoppingCartSection.title }" />{else}{ $shoppingCartSection.title }{/if}</span><span class="numItemsContainer hidden"> (<span class="numItems">0</span>)</span></a>
                            {/if}
                        </div>
                    { /if }
                { /if }

                {* multisites menu ********************************************************************* *}
                {if $berta.options.MULTISITES|count > 1}
                    <ul id="multisites" class="{ messClasses property='multisitesXY' isResponsive=$isResponsive }" style="{ messStyles xy=$multisitesXY isResponsive=$isResponsive }"{if $berta.environment == 'engine' && $isResponsive != 'yes'} data-path="{ $berta.options.MULTISITE }/settings/siteTexts/multisitesXY"{ /if }>
                        {foreach $berta.options.MULTISITES AS $siteName => $site }
                            {if $berta.environment == 'engine' || $berta.options.MULTISITE != $siteName || ($siteName=='0' && $berta.options.MULTISITE !='' ) }
                                <li{if $berta.options.MULTISITE === $siteName || ($siteName=='0' && $berta.options.MULTISITE =='')} class="selected"{/if}><a href="{ bertaLink site=$siteName }">{if $site['title']['value']!=''}{$site['title']['value']}{else}{if $siteName=='0'}Main site{else}{$siteName}{/if}{/if}</a></li>
                            {/if}
                        {/foreach}
                    </ul>
                {/if}

                { if $berta.environment == 'engine' && $berta.sections }
                <div id="xBgEditorPanelContainer"></div>
                <div id="xBgEditorPanelTrigContainer">
                    <a href="#" id="xBgEditorPanelTrig" title="edit background gallery"><span>background settings</span></a>
                </div>
                { /if }

                <!-- PAGE HEADING -->
                { if ($berta.environment == 'site' && $berta.settings.navigation.landingSectionPageHeadingVisible=='yes') || $berta.environment == 'engine' || ($berta.environment == 'site' && $berta.settings.navigation.landingSectionPageHeadingVisible=='no' && $berta.sectionName != $berta.sections|@key) }
                    { if $berta.settings.heading.image }
                        <h1 class="{ messClasses property='siteHeadingXY' isResponsive=$isResponsive }{ if $berta.settings.heading.position == 'fixed' } xFixed{ /if }" style="{ messStyles xy=$siteHeadingXY isResponsive=$isResponsive }"{if $berta.environment == 'engine' && $isResponsive != 'yes'} data-path="{ $berta.options.MULTISITE }/settings/siteTexts/siteHeadingXY"{ /if }><a href="{ bertaLink }">{ responsiveImage image = $berta.settings.heading prefix=image path = $berta.options.MEDIA_ABS_ROOT alt=$berta.settings.texts.pageTitle }</a></h1>
                    { else }
                        <h1 class="{ messClasses property='siteHeadingXY' isResponsive=$isResponsive }{ if $berta.settings.heading.position == 'fixed' } xFixed{ /if }" style="{ messStyles xy=$siteHeadingXY isResponsive=$isResponsive }"{if $berta.environment == 'engine' && $isResponsive != 'yes'} data-path="{ $berta.options.MULTISITE }/settings/siteTexts/siteHeadingXY"{ /if }>
                            <span class="xEditable xProperty-siteHeading"{if $berta.environment == 'engine'} data-path="{ $berta.options.MULTISITE }/settings/siteTexts/siteHeading"{ /if }>
                            { if $berta.environment == "engine" }
                                { $siteHeading }
                            { else }
                                <a href="{ bertaLink }">{ $siteHeading }</a>
                            { /if }
                            </span>
                        </h1>
                    { /if }
                { /if }

                <!-- MENU -->
                { if count($berta.publishedSections) > 0 && (($berta.environment == 'site' && $berta.settings.navigation.landingSectionMenuVisible=='yes') || $berta.environment == 'engine' || ($berta.environment == 'site' && $berta.settings.navigation.landingSectionMenuVisible=='no' && $berta.sectionName != $berta.sections|@key)) }
                    <nav>
                        {if $isResponsive == 'yes'}
                            <a href="#" id="menuToggle"><span></span></a>
                        {/if}
                        <ul>
                            { assign var="currentSectionName" value=$berta.sectionName }
                            { foreach $berta.publishedSections as $sName => $section }
                                { if $section.type != 'shopping_cart' }
                                <li class="menuItem xSection-{ $sName } { messClasses property='positionXY' isResponsive=$isResponsive } { if $currentSectionName == $section.name }menuItemSelected{ /if }{ if $berta.settings.menu.position == 'fixed' } xFixed{ /if }" style="{ messStyles xy=$section.positionXY isResponsive=$isResponsive }"{if $berta.environment == 'engine' && $isResponsive != 'yes'} data-path="{ $berta.options.MULTISITE }/section/{ $section.order }/positionXY"{ /if }>
                                    <a href="{ bertaLink section=$sName }" target="{ bertaTarget section=$sName }">{ $section.title }</a>

                                    { if $berta.settings.tagsMenu.hidden=='no' && (!empty($berta.tags.$sName) && ($isResponsive == 'yes' || $berta.settings.tagsMenu.alwaysOpen=='yes' || $berta.sectionName==$sName)) }
                                        <ul class="subMenu xSection-{ $sName }{ if $berta.tags.$sName|@count > 1 && $berta.environment == 'engine' } xAllowOrdering{ /if }">
                                            { foreach $berta.tags.$sName as $tName => $tag }
                                                <li class="xTag-{ $tName }{ if $berta.tagName == $tName and $currentSectionName == $section.name } selected{ /if }">
                                                    <a class="handle" href="{ bertaLink section=$sName tag=$tName }" target="{ bertaTarget section=$sName tag=$tName }">{ $tag.title }</a>
                                                </li>
                                            { /foreach }
                                        </ul>
                                    { /if }
                                </li>
                                { /if }
                            { /foreach }
                        </ul>
                    </nav>
                { /if }


                {* If not grid view *}
                { if !($smarty.cookies._berta_grid_view && $berta.section.type == 'grid') }
                <div id="pageEntries" class="{ entriesListClasses }{ if $isResponsive != 'yes' } xNoEntryOrdering{else} {if intval($berta.section.columns)>1}columns-{intval($berta.section.columns)}{ /if }{ /if } clearfix">

                    {* now loop through all entries and print them out *}
                    { foreach $entries as $entry }

                        <div class="entry clearfix {if $berta.section.type == 'portfolio'}xHidden {/if}{ entryClasses entry=$entry } { messClasses property='positionXY' isResponsive=$isResponsive } xShopMessyEntry" style="{ messStyles xy=$entry.positionXY entry=$entry  isResponsive=$isResponsive }{ if $isResponsive != 'yes' }{if $entry.width} width:{$entry.width};{elseif strlen(trim($berta.settings.shop.entryWidth)) > 0  && $berta.section.type == 'shop'}width: { $berta.settings.shop.entryWidth }px;{ /if }{/if}" id="{ entrySlug entry=$entry }"{if $berta.environment == 'engine' && $isResponsive != 'yes'} data-path="{ $berta.options.MULTISITE }/entry/{ $berta.section.name }/{ $entry.id }/content/positionXY"{ /if }>

                            { $isshopentry=0 }
                            { if $berta.section.type == 'shop' and $berta.shop_enabled == true }
                                { $isshopentry=1 }
                            { /if }
                            {* the entry settings and delete and move buttons live in the entryHeader - don't leave it out! *}
                            { customEntryHeader entry=$entry section=$berta.section.name ishopentry=$isshopentry }

                            {* entryGallery prints the image gallery for the entry *}

                            {if $berta.section.type != 'portfolio'}
                                { entryGallery entry=$entry }
                            {/if}

                            <div class="entryTextWrap galleryType-{ $entry.__raw.mediaCacheData['@attributes'].type }">
                                { if ($berta.environment == 'engine' || !empty($entry.cartTitle)) and $berta.section.type == 'shop' and $berta.shop_enabled == true }
                                    <h2><span class="xEditable xProperty-cartTitle xCaption-item-name cCartTitle"{if $berta.environment == 'engine'} data-path="{ $berta.options.MULTISITE }/entry/{ $berta.section.name }/{ $entry.id }/content/cartTitle"{ /if }>{ $entry.cartTitle }</span></h2>
                                { elseif $berta.section.type == 'portfolio' && ($berta.environment == 'engine' || !empty($entry.title)) }
                                    <h2><span class="xEditable xProperty-title xCaption-entry&nbsp;title"{if $berta.environment == 'engine'} data-path="{ $berta.options.MULTISITE }/entry/{ $berta.section.name }/{ $entry.id }/content/title"{ /if }>{ $entry.title }</span></h2>
                                { /if }

                                { if $berta.environment == 'engine' || !empty($entry.description) }
                                    <div class="entryText xEditableMCE xProperty-description"{if $berta.environment == 'engine'} data-path="{ $berta.options.MULTISITE }/entry/{ $berta.section.name }/{ $entry.id }/content/description"{ /if }>{ $entry.description }</div>
                                { /if }

                                { if $berta.section.type == 'shop' and $berta.shop_enabled == true }
                                    <div class="addToCart" data-uniqid="{$entry.uniqid}">
                                        { if $berta.environment == 'engine' }
                                            <div class="cartPrice xEditableRC xProperty-cartPrice xCaption-price xFormatModifier-toPrice" title="{ $entry.cartPrice }"{if $berta.environment == 'engine'} data-path="{ $berta.options.MULTISITE }/entry/{ $berta.section.name }/{ $entry.id }/content/cartPrice"{ /if }>{ $entry.cartPrice|@toPrice }</div>
                                        {else}
                                            <div class="cartPrice" title="{ $entry.cartPrice }" data-weight="{ $entry.weight|intval }">{ $entry.cartPrice|@toPrice }</div>
                                        {/if}

                                        <br class="clear">

                                        <div class="cartAttributes{if !$entry.cartAttributes} hidden{/if}">{ $entry.cartAttributes|@toCartAttributes }</div>
                                        <span class="aele{ if empty($entry.cartPrice) || $berta.environment == 'site'} hidden{/if}"><span>{ $berta.settings.shop.addToBasket }</span></span>
                                        <span class="addedToCart hidden"><span></span> { $berta.settings.shop.addedToBasket }</span>
                                        <span class="outOfStock hidden">{ $berta.settings.shop.outOfStock }</span>
                                    </div>
                                { /if }
                            </div>

                            {if $berta.section.type == 'portfolio'}
                                { entryGallery entry=$entry }
                            {/if}

                            {* entry footer wraps the entry including the header - don't leave it out! *}
                            { entryFooter entry=$entry }
                        </div>

                    { foreachelse }
                        {* the template can be modified in a way that here goes content the is displayed when there are no entries in the section *}

                    { /foreach }
                </div>
                { /if }

                {if $berta.section.type == 'portfolio'}
                    { include file="../_includes/inc.portfolio_thumbnails.tpl"  }
                {/if}

                { if ($berta.environment == 'site' && $berta.settings.navigation.landingSectionMenuVisible=='yes') || $berta.environment == 'engine' || ($berta.environment == 'site' && $berta.settings.navigation.landingSectionMenuVisible=='no' && $berta.sectionName != $berta.sections|@key) }
                    <div id="additionalText" class="{ messClasses property='additionalTextXY' isResponsive=$isResponsive }" style="{ messStyles xy=$additionalTextXY isResponsive=$isResponsive }"{if $berta.environment == 'engine' && $isResponsive != 'yes'} data-path="{ $berta.options.MULTISITE }/settings/siteTexts/additionalTextXY"{ /if }>
                        {if $berta.settings.socialMediaButtons.socialMediaLocation == 'additionalText' && $berta.settings.socialMediaButtons.socialMediaHTML}
                            { $berta.settings.socialMediaButtons.socialMediaHTML|@html_entity_decode|replace:'<br />':"\n" }
                        {else}
                            <div class="xEditableMCESimple xProperty-additionalText xCaption-additional-text"{if $berta.environment == 'engine'} data-path="{ $berta.options.MULTISITE }/settings/siteTexts/additionalText"{ /if }>
                                { $additionalText }
                            </div>
                        {/if}
                    </div>
                {/if}

                {section name=banners loop=10}
                    { assign var="setting_name_image" value="banner`$smarty.section.banners.iteration`_image" }
                    { assign var="setting_name_link" value="banner`$smarty.section.banners.iteration`_link" }
                    { assign var="setting_pos_name" value="banner`$smarty.section.banners.iteration`XY" }

                    { if $berta.settings.banners.$setting_name_image }
                        <div class="floating-banner banner-{$smarty.section.banners.iteration}{ if $isResponsive!='yes' } xEditableDragXY xProperty-{ $setting_pos_name }{/if}"{ if $isResponsive!='yes' } style="{ bannerPos xy_name=$setting_pos_name }"{/if}{if $berta.environment == 'engine' && $isResponsive != 'yes'} data-path="{ $berta.options.MULTISITE }/settings/siteTexts/banner{$smarty.section.banners.iteration}XY"{ /if }>
                            { if $isResponsive!='yes' }
                                <div class="xHandle"></div>
                            {/if}
                            { if $berta.settings.banners.$setting_name_link }
                                <a href="{ $berta.settings.banners.$setting_name_link }" target="_blank">
                                    { responsiveImage image = $berta.settings.banners prefix=$setting_name_image path = $berta.options.MEDIA_ABS_ROOT }
                                </a>
                            { else }
                                { responsiveImage image = $berta.settings.banners prefix=$setting_name_image path = $berta.options.MEDIA_ABS_ROOT }
                            { /if }
                        </div>

                    { /if }
                {/section}

            </div>

            {* grid trigger *}
            { if $berta.section.type == 'grid' && $berta.section.mediaCacheData.file && !$berta.section.mediaCacheData.file['@attributes'] && !$smarty.cookies._berta_grid_view }
            <div id="xGridViewTriggerContainer" { if $berta.environment == 'engine' }style="right: 44px"{ else if $berta.environment == 'site' && $shoppingCartSection } style="top: 20px;"{ /if }>
                <a id="xGridViewTrigger" href="{ bertaLink section=$berta.sectionName tag=$berta.tagName }"><span>thumbnails</span></a>
            </div>
            { /if }

        </div>

        {* *** grid view ********************************************************** *}
        { if ($berta.section.type == 'grid' && $smarty.cookies._berta_grid_view) }
        <div id="xGridView">
            { gridView section=$berta.section tag=$berta.tagName }
        </div>
        { /if }

        <div id="bottom" class="clearfix">
            <div id="additionalFooterText" class="{if !($berta.settings.socialMediaButtons.socialMediaLocation == 'footer' && $berta.settings.socialMediaButtons.socialMediaHTML)}xEditableMCESimple {/if}xProperty-additionalFooterText xCaption-additional-footer-text clearfix"{if $berta.environment == 'engine' && !($berta.settings.socialMediaButtons.socialMediaLocation == 'footer' && $berta.settings.socialMediaButtons.socialMediaHTML)} data-path="{ $berta.options.MULTISITE }/settings/siteTexts/additionalFooterText"{/if}>
                {if $berta.settings.socialMediaButtons.socialMediaLocation == 'footer' && $berta.settings.socialMediaButtons.socialMediaHTML}
                    { $berta.settings.socialMediaButtons.socialMediaHTML|@html_entity_decode|replace:'<br />':"\n" }
                {else}
                    { $additionalFooterText }
                {/if}
            </div>

            { if !($berta.settings.settings.hideBertaCopyright=='yes' && $berta.hostingPlan>1) }
                <p id="bertaCopyright">{ bertaCopyright }</p>
            { /if }
            <p id="userCopyright" class="xEditableTA xProperty-siteFooter"{if $berta.environment == 'engine'} data-path="{ $berta.options.MULTISITE }/settings/siteTexts/siteFooter"{ /if }>
              { $siteFooter }
            </p>
        </div>

        { if $berta.settings.settings.showTutorialVideos == 'yes' && !$smarty.cookies._berta_videos_hidden }{ videoTutorials }{ /if }

        { intercomScript }

        { include file="../_includes/inc.js_include.tpl" }

        { include file="../_includes/inc.counter.tpl" }
    { /if }

    {if $berta.msg}
        <script type="text/javascript">alert('{$berta.msg}');</script>
    {/if}
</body>
</html>
