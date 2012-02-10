<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>{ $berta.pageTitle }</title>
    <meta name="keywords" content="{ $berta.settings.texts.metaKeywords }" />
    <meta name="description" content="{ $berta.settings.texts.metaDescription }" />
    <meta name="author" content="{ $berta.settings.texts.ownerName }" />
    
    { if $berta.settings.pageLayout.favicon }
    <link rel="SHORTCUT ICON" href="{ $berta.options.MEDIA_ABS_ROOT }{ $berta.settings.pageLayout.favicon }" />
    { else }
    <link rel="SHORTCUT ICON" href="{ $berta.options.TEMPLATES_ABS_ROOT }{ $berta.templateName }/favicon.ico" />
    { /if }
    { if ($berta.section.type == 'shopping_cart' &&  $berta.environment == 'engine') || $berta.section.type != 'shopping_cart'  }
    { $berta.scripts }
    
    { $berta.css }
    { googleWebFontsAPI }   
    { /if }
    <script type="text/javascript" src="{ $berta.options.TEMPLATES_ABS_ROOT }{ $berta.templateName }/mess.js"></script>
    <script type="text/javascript" src="{ $berta.options.TEMPLATES_ABS_ROOT }{ $berta.templateName }/mooMasonry.js"></script>

    { if $berta.shop_enabled == true }
    <script type="text/javascript" src="{ $berta.options.SITE_ABS_ROOT }_plugin_shop/js/shop.js"></script>  
    <link rel="stylesheet" href="{ $berta.options.SITE_ABS_ROOT }_plugin_shop/css/shop.css.php?{$smarty.now}" type="text/css" />
    { /if }
</head>

<body>
    { if ($berta.section.type == 'shopping_cart' &&  $berta.environment == 'engine') || $berta.section.type != 'shopping_cart'  }
        
        {* *** section background ************************************************* *}
        <div id="xBackgroundContainer">
            <div id="xBackground" class="xBgDataAutoplay-{$berta.section.mediaCacheData['@attributes'].autoplay} xBgDataImageSize-{$berta.section.mediaCacheData['@attributes'].image_size} xBgDataFading-{ if $berta.environment == 'site' }{$berta.section.mediaCacheData['@attributes'].fade_content}{ /if }" style="background-color: { $berta.section.sectionBgColor }">
                {* if only one image *}
                { if $berta.section.mediaCacheData.file['@attributes'] && $berta.section.mediaCacheData.file['@attributes'].type == 'image' && !($smarty.cookies._berta_grid_view && $berta.section.type == 'grid') }
                   
                    <div class="visual-list">
                    { if  $berta.section.mediaCacheData.file['@attributes'].type == 'image' }
                        { if $berta.section.mediaCacheData.file.value }
                            <textarea {if $smarty.cookies._berta_grid_img_link && $smarty.cookies._berta_grid_img_link == $berta.section.mediaCacheData.file['@attributes'].src }class="sel"{ elseif !$smarty.cookies._berta_grid_img_link }class="sel"{ /if }>{ $berta.section.mediaCacheData.file.value }</textarea>
                            <input type="hidden" width="{ $berta.section.mediaCacheData.file['@attributes'].width }" height="{ $berta.section.mediaCacheData.file['@attributes'].height }" src="{ $berta.options.MEDIA_ABS_ROOT }{ $berta.section.mediafolder }/_bg_{ $berta.section.mediaCacheData.file['@attributes'].src }" />
                        { else }
                            <input type="hidden" width="{ $berta.section.mediaCacheData.file['@attributes'].width }" height="{ $berta.section.mediaCacheData.file['@attributes'].height }" src="{ $berta.options.MEDIA_ABS_ROOT }{ $berta.section.mediafolder }/_bg_{ $berta.section.mediaCacheData.file['@attributes'].src }" {if $smarty.cookies._berta_grid_img_link && $smarty.cookies._berta_grid_img_link == $berta.section.mediaCacheData.file['@attributes'].src }class="sel"{ elseif !$smarty.cookies._berta_grid_img_link }class="sel"{ /if } />
                        { /if }
                    { /if }
                    </div>
                    
                    { if $berta.section.mediaCacheData.file.value }
                        <div class="visual-image">
                            <img width="" height="" src="" class="bg-element visualContent" />
                        </div>
                        <div class="visual-caption" style="background: rgb({ $berta.section.mediaCacheData['@attributes'].caption_bg_color }); background: rgba({ $berta.section.mediaCacheData['@attributes'].caption_bg_color },0.5); color: { $berta.section.mediaCacheData['@attributes'].caption_color }">
                            { $berta.section.mediaCacheData.file.value }
                        </div>
                    { else }
                        <div class="visual-image">
                            <img width="{ $berta.section.mediaCacheData.file['@attributes'].width }" height="{ $berta.section.mediaCacheData.file['@attributes'].height }" src="{ $berta.options.MEDIA_ROOT }{ $berta.section.mediafolder }/_bg_{ $berta.section.mediaCacheData.file['@attributes'].src }" class="bg-element visualContent" />
                        </div>
                        <div class="visual-caption" style="background: rgb({ $berta.section.mediaCacheData['@attributes'].caption_bg_color }); background: rgba({ $berta.section.mediaCacheData['@attributes'].caption_bg_color },0.5); color: { $berta.section.mediaCacheData['@attributes'].caption_color }">
                        </div>
                    { /if }
                
                {* if two or more images *}
                { elseif $berta.section.mediaCacheData.file && !$berta.section.mediaCacheData.file['@attributes'] && !($smarty.cookies._berta_grid_view && $berta.section.type == 'grid') }
                    
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
                                { if $fVal['value'] }
                                    <div class="visual-image">
                                        <img width="{ $fVal['@attributes'].width }" height="{ $fVal['@attributes'].height }" src="{ $berta.options.MEDIA_ABS_ROOT }{ $berta.section.mediafolder }/_bg_{ $fVal['@attributes'].src }" class="bg-element visualContent" />
                                    </div>
                                    <div class="visual-caption" style="background: rgb({ $berta.section.mediaCacheData['@attributes'].caption_bg_color }); background: rgba({ $berta.section.mediaCacheData['@attributes'].caption_bg_color },0.5); color: { $berta.section.mediaCacheData['@attributes'].caption_color }">
                                    </div>
                                { else }
                                    <div class="visual-image">
                                        <img width="{ $fVal['@attributes'].width }" height="{ $fVal['@attributes'].height }" src="{ $berta.options.MEDIA_ABS_ROOT }{ $berta.section.mediafolder }/_bg_{ $fVal['@attributes'].src }" class="bg-element visualContent" />
                                    </div>
                                    <div class="visual-caption" style="background: rgb({ $berta.section.mediaCacheData['@attributes'].caption_bg_color }); background: rgba({ $berta.section.mediaCacheData['@attributes'].caption_bg_color },0.5); color: { $berta.section.mediaCacheData['@attributes'].caption_color }">
                                    </div>
                                { /if }
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
                                        <img width="" height="" src="" class="bg-element visualContent" />
                                    </div>
                                    <div class="visual-caption" style="background: rgb({ $berta.section.mediaCacheData['@attributes'].caption_bg_color }); background: rgba({ $berta.section.mediaCacheData['@attributes'].caption_bg_color },0.5); color: { $berta.section.mediaCacheData['@attributes'].caption_color }">
                                        { $fVal['value'] }
                                    </div>
                                { else }
                                    <div class="visual-image">
                                        <img width="{ $fVal['@attributes'].width }" height="{ $fVal['@attributes'].height }" src="{ $berta.options.MEDIA_ABS_ROOT }{ $berta.section.mediafolder }/_bg_{ $fVal['@attributes'].src }" class="bg-element visualContent" />
                                    </div>
                                    <div class="visual-caption" style="background: rgb({ $berta.section.mediaCacheData['@attributes'].caption_bg_color }); background: rgba({ $berta.section.mediaCacheData['@attributes'].caption_bg_color },0.5); color: { $berta.section.mediaCacheData['@attributes'].caption_color }">
                                    </div>
                                { /if }
                            { /if }
                        { /foreach }
                    { /if }
                    
                { /if }
            </div>
            
            {* don't show arrows if one or less images or is in grid view *}
            { if ($berta.section.mediaCacheData.file['@attributes'] && !$berta.section.mediaCacheData.file.value) || !$berta.section.mediaCacheData.file || ($berta.section.type == 'grid' && $smarty.cookies._berta_grid_view)  }
                <div id="xBackgroundPrevious" class="bgHidden"><a href="#"><span>previous</span></a></div>
                <div id="xBackgroundNext" class="bgHidden"><a href="#"><span>next</span></a></div>
            { else }
                <div id="xBackgroundPrevious"><a href="#"><span>previous</span></a></div>
                <div id="xBackgroundNext"><a href="#"><span>next</span></a></div>
            { /if }
        </div>

        
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
        { pageHeader }
    { /if }
    
    {* F awesome hack. Dont do it in future *}
    { if $berta.section.type == 'shopping_cart' }
        { if $berta.environment == 'engine' }
        <div style="height: 50px"></div>
        { /if }
        { include file="../../_plugin_shop/_includes/inc.shopping_cart.tpl"  }
        </div> {* allContainer *}
    { else }
        
        
            {* *** shopping ********************************************************************* *}
            { if $berta.shop_enabled == true }
                
                { if $shoppingCartSection }
                <div id="shoppingCart" { if $berta.environment == 'engine' } style="margin-top: 40px;" { /if } > {* class="hidden" *}
                {if $berta.environment == 'engine' }
                    <a href="{ bertaLink section=$shoppingCartSection.name }" id="xShoppingCart"><span class="title">{ $shoppingCartSection.title }</span><span class="numItemsContainer hidden"> (<span class="numItems">0</span>)</span></a>
                {else}
                    <a href="javascript:openShoppingCart('{ bertaLink section=$shoppingCartSection.name }');"><span class="title">{ $shoppingCartSection.title }</span><span class="numItemsContainer hidden"> (<span class="numItems">0</span>)</span></a>
                {/if}
                    {*
                    { if $berta.environment == "engine" && $checkoutCompleteSection }
                    | <a href="{ bertaLink section=$checkoutCompleteSection.name }">{ $checkoutCompleteSection.title }</a>
                    { /if }
                    *}
                </div>
                { /if }
            { /if }

            <div id="contentContainer">
            
                { if $berta.environment == 'engine' && $berta.sections }
                <div id="xBgEditorPanelContainer"></div>
                <div id="xBgEditorPanelTrigContainer">
                    <a href="#" id="xBgEditorPanelTrig" title="edit background gallery"><span>background settings</span></a>
                </div>
                { /if }
                
                <!-- PAGE HEADING -->
                { if ($berta.environment == 'site' && $berta.settings.navigation.landingSectionMenuVisible=='yes') || $berta.environment == 'engine' || ($berta.environment == 'site' && $berta.settings.navigation.landingSectionMenuVisible=='no' && $berta.sectionName != $berta.sections|@key) }
                { if $berta.settings.heading.image }
                <h1 class="{ messClasses property='siteHeadingXY' }" style="{ messStyles xy=$siteHeadingXY }"><a href="{ bertaLink }"><img src="{ $berta.options.MEDIA_ABS_ROOT }{ $berta.settings.heading.image }" /></a></h1>
                { else }
                <h1 class="{ messClasses property='siteHeadingXY' }" style="{ messStyles xy=$siteHeadingXY }">
                    <span class="xEditable xProperty-siteHeading">
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
                    { assign var="currentSectionName" value=$berta.sectionName }
                    { foreach $berta.publishedSections as $sName => $section }
                        { if $section.type != 'shopping_cart' }
                        
                        <div class="menuItem xSection-{ $sName } { messClasses property='positionXY' } { if $currentSectionName == $section.name }menuItemSelected{ /if }" style="{ messStyles xy=$section.positionXY }">
                            <a href="{ bertaLink section=$sName }" target="{ bertaTarget section=$sName }">{ $section.title }</a>
                
                            { if $berta.settings.tagsMenu.hidden=='no' && (!empty($berta.tags.$sName) && ($berta.settings.tagsMenu.alwaysOpen=='yes' || $berta.sectionName==$sName)) }
                                <ul>
                                    { foreach $berta.tags.$sName as $tName => $tag }
                                        <li { if $berta.tagName == $tName and $currentSectionName == $section.name }class="selected"{ /if }>
                                            <a href="{ bertaLink section=$sName tag=$tName }" target="{ bertaTarget section=$sName tag=$tName }">{ $tag.title }</a>
                                        </li>
                                    { /foreach }    
                                </ul>
                            { /if }
                        </div>
                        { /if }
                    { /foreach }
                { /if }
                
                
                {* If not grid view *}
                { if !($smarty.cookies._berta_grid_view && $berta.section.type == 'grid') }
                <div id="pageEntries" class="{ entriesListClasses } xNoEntryOrdering">

                    {* now loop through all entries and print them out *}
                    { foreach $entries as $entry }

                        <div class="{ entryClasses entry=$entry } { messClasses property='positionXY' } xShopMessyEntry" style="{ messStyles xy=$entry.positionXY entry=$entry } {if $entry.width} width:{$entry.width};{elseif strlen(trim($berta.settings.shop.entryWidth)) > 0  && $berta.section.type == 'shop'} width: { $berta.settings.shop.entryWidth }px{ /if }">

        
                            {* the entry settings and delete and move buttons live in the entryHeader - don't leave it out! *}
                            { $isshopentry=0 }
                            { if $berta.section.type == 'shop' and $berta.shop_enabled == true }
                                { $isshopentry=1 }
                            { /if }
                            { customEntryHeader entry=$entry ishopentry=$isshopentry }

                            {* entryGallery prints the image gallery for the entry *}
                            { entryGallery entry=$entry }


                            { if ($berta.environment == 'engine' || !empty($entry.cartTitle)) and $berta.section.type == 'shop' and $berta.shop_enabled == true }
                                <h2><span class="xEditable xProperty-cartTitle xCaption-item-name cCartTitle">{ $entry.cartTitle }</span></h2>
                            { /if }


                            { if $berta.environment == 'engine' || !empty($entry.description) }
                                <div class="entryText xEditableMCE xProperty-description">{ $entry.description }</div>
                            { /if }
        
                            

                            { if $berta.section.type == 'shop' and $berta.shop_enabled == true }
                                <div class="addToCart">
                                
                                { if $berta.environment == 'engine' }
                                    <div class="cartPrice xEditableRC xProperty-cartPrice xCaption-price xFormatModifier-toPrice" title="{ $entry.cartPrice }">{ $entry.cartPrice|@toPrice }</div>
                                    {* <br class="clear" /> *}
                                { elseif !empty($entry.cartPrice)}
                                    <div class="cartPrice" title="{ $entry.cartPrice }">{ $entry.cartPrice|@toPrice }</div>
                                    <br class="clear">
                                    {if $entry.cartAttributes}
                                    <div class="cartAttributes">{ $entry.cartAttributes|@toCartAttributes }</div>
                                    {/if}
                                    <span class="aele"><span>{ $berta.settings.shop.addToBasket }</span></span>
                                    <span class="addedToCart hidden"></span>    
                                { /if }
                                </div>
                                

                            { /if }


                            {* entry footer wraps the entry including the header - don't leave it out! *}
                            { entryFooter entry=$entry }
                        </div>

                    { foreachelse }
                        {* the template can be modified in a way that here goes content the is displayed when there are no entries in the section *}

                    { /foreach }
                </div>
                { /if }
                
                
                <div id="additionalText" class="{ messClasses property='additionalTextXY' }" style="{ messStyles xy=$additionalTextXY }"> 
                    <div class="xEditableMCESimple xProperty-additionalText xCaption-additional-text">
                    { $additionalText }
                    </div>
                </div>

            </div>
            
            {section name=foo loop=10} 
                { assign var="setting_name_image" value="banner`$smarty.section.foo.iteration`_image" }
                { assign var="setting_name_link" value="banner`$smarty.section.foo.iteration`_link" }
                { assign var="setting_pos_name" value="banner`$smarty.section.foo.iteration`XY" }
                
                { if $berta.settings.banners.$setting_name_image }
                    <div class="floating-banner xEditableDragXY xProperty-{ $setting_pos_name }" style="{ bannerPos xy_name=$setting_pos_name }"> 
                        <div class="xHandle"></div>
                        { if $berta.settings.banners.$setting_name_link }
                            <a href="{ $berta.settings.banners.$setting_name_link }" target="_blank">
                                <img src="{ $berta.options.MEDIA_ABS_ROOT }{ $berta.settings.banners.$setting_name_image }" />
                            </a>
                        { else }
                        <img src="{ $berta.options.MEDIA_ABS_ROOT }{ $berta.settings.banners.$setting_name_image }" />
                        { /if }
                    </div>
                
                { /if }
            {/section}
            
            {* grid trigger *}
            { if $berta.section.type == 'grid' && $berta.section.mediaCacheData.file && !$berta.section.mediaCacheData.file['@attributes'] && !$smarty.cookies._berta_grid_view }
            <div id="xGridViewTriggerContainer" { if $berta.environment == 'engine' }style="right: 44px"{ else if $berta.environment == 'site' && $shoppingCartSection } style="top: 24px;" { /if }>
                <a id="xGridViewTrigger" href="{ bertaLink section=$berta.sectionName }"><span>thumbnails</span></a>
            </div>
            { /if }
                
        </div>
        
        {* *** grid view ********************************************************** *}
        { if ($berta.section.type == 'grid' && $smarty.cookies._berta_grid_view) }
        <div id="xGridView">
            { gridView section=$berta.section }
        </div>
        { /if }
        
        
        <div id="bottom">
            <p id="userCopyright" class="xEditableTA xProperty-siteFooter">{ $siteFooter }</p>
            <p id="bertaCopyright">{ bertaCopyright }</p>
        </div>
                
        { include file="../_includes/inc.js_include.tpl" }
        
        { include file="../_includes/inc.counter.tpl"  }
    { /if }

    {if $berta.msg}
        <script type="text/javascript">alert('{$berta.msg}');</script>
    {/if}
</body>
</html>