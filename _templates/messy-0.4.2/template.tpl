<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    {if $berta.section.type == 'portfolio'}
        {assign var=isResponsive value='yes'}
    {else}
        {assign var=isResponsive value=$berta.settings.pageLayout.responsive}
    {/if}

    {if $isResponsive !== 'yes' && $berta.settings.pageLayout.autoResponsive == 'yes' && $berta.environment == 'site'}
        {assign var=isAutoResponsive value=true}
    {/if}

    {if $isResponsive=='yes' || $isAutoResponsive}<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">{/if}
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
    {* CSS for responsive layout *}
    {if $isResponsive == 'yes' || $isAutoResponsive}
        <style type="text/css">
            {if $isAutoResponsive}
              @media (max-width: 767px) {literal}{{/literal}
            {/if}

            #pageEntries .xEntry {literal}{{/literal}
                padding: {if $berta.section.entryPadding }{ $berta.section.entryPadding }{ else }{ $berta.sectionTypes.default.params.entryPadding.default }{/if};
                {if $berta.section.entryMaxWidth}
                    max-width: { $berta.section.entryMaxWidth };
                {/if}
            {literal}}{/literal}

            {if $isAutoResponsive}
              {literal}}{/literal}
            {/if}
        </style>
    {/if}
    { if $berta.shop_enabled == true }
        <link rel="stylesheet" href="{ $berta.options.SITE_ROOT_URL }_plugin_shop/css/shop.css.php?{$berta.options.version}{if $berta.options.MULTISITE}&amp;site={$berta.options.MULTISITE}{/if}" type="text/css">
    { /if }

    {if $berta.settings.css.customCSS}
        <style type="text/css">
        {$berta.settings.css.customCSS|@html_entity_decode|replace:'<br />':"\n"}
        </style>
    {/if}
    { googleWebFontsAPI }
    { /if }
    <script type="text/javascript" src="{ $berta.options.TEMPLATES_ABS_ROOT }{ $berta.templateName }/mess.js?{$berta.options.version}"></script>
    <script type="text/javascript" src="{ $berta.options.TEMPLATES_ABS_ROOT }{ $berta.templateName }/mooMasonry.js"></script>

    { if $berta.shop_enabled == true }
        <script type="text/javascript" src="{ $berta.options.SITE_ROOT_URL }_plugin_shop/js/shop.js?{$berta.options.version}"></script>
    { /if }
</head>

<body class="xContent-{ $berta.section.name }{if $berta.tagName} xSubmenu-{$berta.tagName}{/if}{if $berta.environment == 'engine'} page-xMySite{/if}{if $berta.section.type} xSectionType-{ $berta.section.type }{/if}{if $isResponsive=='yes'} bt-responsive{/if}{if $isAutoResponsive} bt-auto-responsive{/if}{if $berta.settings.pageLayout.centeredContents == 'yes'} bt-centered-content{/if}">
    { if ($berta.section.type == 'shopping_cart' &&  $berta.environment == 'engine') || $berta.section.type != 'shopping_cart'  }

        {* *** section background ************************************************* *}
        {$backgroundGallery}

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
                {$sitesMenu}

                { if $berta.environment == 'engine' && $berta.sections }
                <div id="xBgEditorPanelContainer"></div>
                <div id="xBgEditorPanelTrigContainer">
                    <a href="#" id="xBgEditorPanelTrig" title="edit background gallery"><span>background settings</span></a>
                </div>
                { /if }

                <!-- PAGE HEADING -->
                {$siteHeader}

                <!-- MENU -->
                {$sectionsMenu}

                {* If not grid view *}
                { if !($smarty.cookies._berta_grid_view && $berta.section.type == 'grid') }
                <div id="pageEntries" class="{ entriesListClasses }{ if $isResponsive != 'yes' } xNoEntryOrdering{else} {if intval($berta.section.columns)>1}columns-{intval($berta.section.columns)}{ /if }{ /if } clearfix">
                  {$entriesHTML}
                </div>
                { /if }

                {if $berta.section.type == 'portfolio'}
                    { include file="../_includes/inc.portfolio_thumbnails.tpl"  }
                {/if}

                { if ($berta.environment == 'site' && $berta.settings.navigation.landingSectionMenuVisible=='yes') || $berta.environment == 'engine' || ($berta.environment == 'site' && $berta.settings.navigation.landingSectionMenuVisible=='no' && $berta.sectionName != $berta.sections|@key) }
                    <div id="additionalText" class="{ messClasses property='additionalTextXY' isResponsive=$isResponsive }" style="{ messStyles xy=$additionalTextXY isResponsive=$isResponsive }"{if $berta.environment == 'engine' && $isResponsive != 'yes'} data-path="{ $berta.options.MULTISITE }/settings/siteTexts/additionalTextXY"{ /if }>
                        {if $berta.settings.socialMediaButtons.socialMediaLocation == 'additionalText' && $berta.settings.socialMediaButtons.socialMediaHTML}
                            { $berta.settings.socialMediaButtons.socialMediaHTML|@html_entity_decode|replace:'<br />':"\n" }
                        {elseif $berta.settings.socialMediaLinks.location == 'additionalText' && $socialMediaLinks}
                            { include file="../_includes/inc.social_media_links.tpl" }
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
            <div id="additionalFooterText" class="{if !($berta.settings.socialMediaButtons.socialMediaLocation == 'footer' && $berta.settings.socialMediaButtons.socialMediaHTML) && !($berta.settings.socialMediaLinks.location == 'footer' && $socialMediaLinks)}xEditableMCESimple {/if}xProperty-additionalFooterText xCaption-additional-footer-text clearfix"{if $berta.environment == 'engine' && !($berta.settings.socialMediaButtons.socialMediaLocation == 'footer' && $berta.settings.socialMediaButtons.socialMediaHTML) && !($berta.settings.socialMediaLinks.location == 'footer' && $socialMediaLinks)} data-path="{ $berta.options.MULTISITE }/settings/siteTexts/additionalFooterText"{/if}>
                {if $berta.settings.socialMediaButtons.socialMediaLocation == 'footer' && $berta.settings.socialMediaButtons.socialMediaHTML}
                    { $berta.settings.socialMediaButtons.socialMediaHTML|@html_entity_decode|replace:'<br />':"\n" }
                {elseif $berta.settings.socialMediaLinks.location == 'footer' && $socialMediaLinks}
                    { include file="../_includes/inc.social_media_links.tpl" }
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

        { include file="../_includes/inc.back_to_top.tpl" }

        { include file="../_includes/inc.photoswipe_html.tpl" }

        { intercomScript }

        { include file="../_includes/inc.js_include.tpl" }

        { include file="../_includes/inc.counter.tpl" }
    { /if }

    {if $berta.msg}
        <script type="text/javascript">alert('{$berta.msg}');</script>
    {/if}
</body>
</html>
