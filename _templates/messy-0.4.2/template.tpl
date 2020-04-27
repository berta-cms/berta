<!DOCTYPE html>
<html>
{$sectionHead}

{if $berta.section.type == 'portfolio'}
  {assign var=isResponsive value='yes'}
{else}
  {assign var=isResponsive value=$berta.settings.pageLayout.responsive}
{/if}
{if $isResponsive !== 'yes' && $berta.settings.pageLayout.autoResponsive == 'yes' && $berta.environment == 'site'}
  {assign var=isAutoResponsive value=true}
{/if}
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

                {$portfolioThumbnails}

                {$additionalTextBlock}

                { $siteBanners }
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
            {$additionalFooterTextBlock}

            { if !($berta.settings.settings.hideBertaCopyright=='yes' && $berta.hostingPlan>1) }
                <p id="bertaCopyright">{ bertaCopyright }</p>
            { /if }
            <p id="userCopyright" class="xEditableTA xProperty-siteFooter"{if $berta.environment == 'engine'} data-path="{ $berta.options.MULTISITE }/settings/siteTexts/siteFooter"{ /if }>
              { $siteFooter }
            </p>
        </div>

        { $sectionFooter }
    { /if }

    {if $berta.msg}
        <script type="text/javascript">alert('{$berta.msg}');</script>
    {/if}
</body>
</html>
