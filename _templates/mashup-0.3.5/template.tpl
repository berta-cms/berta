<!DOCTYPE html>
<!--[if lt IE 7 ]> <html class="ie6 ie-old"> <![endif]-->
<!--[if IE 7 ]>    <html class="ie7 ie-old"> <![endif]-->
<!--[if IE 8 ]>    <html class="ie8"> <![endif]-->
<!--[if IE 9 ]>    <html class="ie9"> <![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--> <html> <!--<![endif]-->
<head>
	<meta charset="UTF-8">
	{if $berta.settings.pageLayout.responsive=='yes'}<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">{/if}
	<title>{if $berta.section.seoTitle}{ $berta.section.seoTitle|strip_tags|escape }{else}{ $berta.pageTitle|strip_tags|escape }{/if}</title>
	<meta name="keywords" content="{if $berta.section.seoKeywords}{ $berta.section.seoKeywords|strip_tags|escape }{else}{ $berta.settings.texts.metaKeywords|strip_tags|escape }{/if}">
	<meta name="description" content="{if $berta.section.seoDescription}{ $berta.section.seoDescription|strip_tags|escape }{else}{ $berta.settings.texts.metaDescription|strip_tags|escape }{/if}">
	<meta name="author" content="{ $berta.settings.texts.ownerName }">
  {if $berta.options.NOINDEX || !$berta.section.published}<meta name="robots" content="noindex, nofollow">{/if}
	{$berta.settings.settings.googleSiteVerification|@html_entity_decode}

	{ if $berta.settings.pageLayout.favicon }
	<link rel="SHORTCUT ICON" href="{ $berta.options.MEDIA_ABS_ROOT }{ $berta.settings.pageLayout.favicon }">
	{ else }
	<link rel="SHORTCUT ICON" href="{ $berta.options.TEMPLATES_ABS_ROOT }{ $berta.templateName }/favicon.ico">
	{ /if }

	{ $berta.scripts }
	{ $berta.css }
    {if $berta.settings.css.customCSS}
        <style type="text/css">
        {$berta.settings.css.customCSS|@html_entity_decode|replace:'<br />':"\n"}
        </style>
    {/if}
	{ googleWebFontsAPI }
	<script type="text/javascript" src="{ $berta.options.TEMPLATES_ABS_ROOT }{ $berta.templateName }/mashup.js?{$berta.options.int_version}"></script>
</head>

<body class="xContent-{ $berta.section.name }{if $berta.tagName} xSubmenu-{$berta.tagName}{/if}{if $berta.environment == 'engine'} page-xMySite{/if}{if $berta.section.type} xSectionType-{ $berta.section.type }{/if}">

	{if $berta.settings.background.backgroundAttachment=='fill' AND $berta.settings.background.backgroundImageEnabled=='yes' AND $berta.settings.background.backgroundImage!=''}
		<div id="xFilledBackground" class="xPosition-{' '|str_replace:'_':$berta.settings.background.backgroundPosition}">
			<img src="{ $berta.options.MEDIA_ABS_ROOT }{ $berta.settings.background.backgroundImage }" />
		</div>
	{/if}

	{* all templates must include allContainer *}
	<div id="allContainer"{ if $berta.settings.pageLayout.centered == 'yes' }class="xCentered"{ /if }>

		{* engine panel lives in pageHeader - don't leave it out *}
		{ pageHeader }

		<div id="sideColumn" class="{ if $berta.settings.pageLayout.centered == 'yes' }xCentered{ /if }{if $berta.settings.pageLayout.responsive=='yes'} xResponsive{/if}">
			<div id="sideColumnTop">

	            {* multisites menu ********************************************************************* *}
	            {if $berta.options.MULTISITES|count > 1}
	                <ul id="multisites">
	                    {foreach $berta.options.MULTISITES AS $siteName => $site }
	                        {if $berta.environment == 'engine' || $berta.options.MULTISITE != $siteName || ($siteName=='0' && $berta.options.MULTISITE !='' ) }
	                            <li{if $berta.options.MULTISITE === $siteName || ($siteName=='0' && $berta.options.MULTISITE =='')} class="selected"{/if}><a href="{ bertaLink site=$siteName }">{if $site['title']['value']!=''}{$site['title']['value']}{else}{if $siteName=='0'}Main site{else}{$siteName}{/if}{/if}</a></li>
	                        {/if}
	                    {/foreach}
	                </ul>
	            {/if}

                { if ($berta.environment == 'site' && $berta.settings.navigation.landingSectionPageHeadingVisible=='yes') || $berta.environment == 'engine' || ($berta.environment == 'site' && $berta.settings.navigation.landingSectionPageHeadingVisible=='no' && $berta.sectionName != $berta.sections|@key) }
                    { if $berta.settings.sideBar.image }
                    <h1><a href="{ bertaLink }">{ responsiveImage image = $berta.settings.sideBar prefix=image path = $berta.options.MEDIA_ABS_ROOT alt=$berta.settings.texts.pageTitle }</a></h1>
                    { else }
                    <h1 class="xEditable xProperty-siteHeading">
                        { if $berta.environment == "engine" }
                            { $siteHeading }
                        { else }
                            <a href="{ bertaLink }">{ $siteHeading }</a>
                        { /if }
                    </h1>
                    { /if }
                { /if }

				{ if ($berta.environment == 'site' && $berta.settings.navigation.landingSectionMenuVisible=='yes') || $berta.environment == 'engine' || ($berta.environment == 'site' && $berta.settings.navigation.landingSectionMenuVisible=='no' && $berta.sectionName != $berta.sections|@key) }
					<div id="additionalText"{if $berta.settings.pageLayout.responsive!='yes'} class="xEditableDragXY xProperty-additionalTextXY" style="{ additionalTextPos xy=$additionalTextXY }"{/if}>
						<div class="xHandle"></div>
						{if $berta.settings.socialMediaButtons.socialMediaLocation == 'additionalText' && $berta.settings.socialMediaButtons.socialMediaHTML}
                            { $berta.settings.socialMediaButtons.socialMediaHTML|@html_entity_decode|replace:'<br />':"\n" }
                        {else}
							<div class="xEditableMCESimple xProperty-additionalText xCaption-additional-text">
							{ $additionalText }
							</div>
						{/if}
					</div>
				{/if}

				{ if count($berta.publishedSections) > 0 && (($berta.environment == 'site' && $berta.settings.navigation.landingSectionMenuVisible=='yes') || $berta.environment == 'engine' || ($berta.environment == 'site' && $berta.settings.navigation.landingSectionMenuVisible=='no' && $berta.sectionName != $berta.sections|@key)) }

					{if $berta.settings.pageLayout.responsive == 'yes'}
	                    <a href="#" id="menuToggle"><span></span></a>
	                {/if}
					<ul>
						{ assign var="currnetSectionName" value=$berta.sectionName }
						{ foreach from=$berta.publishedSections item="section" key="sName" name="sectionsMenuLoop" }
							{ if $currnetSectionName == $section.name }<li class="selected">{ else }<li>{ /if }
								<a href="{ bertaLink section=$sName }" target="{ bertaTarget section=$sName }">{ $section.title }</a>

								{ if !empty($berta.tags.$sName) }
									<ul class="subMenu xSection-{ $sName }{ if $berta.tags.$sName|@count > 1 && $berta.environment == 'engine' } xAllowOrdering{ /if }">
										{ foreach from=$berta.tags.$sName key="tName" item="tag" name="subSectionsMenuLoop" }
											{ if $berta.tagName == $tName and $currnetSectionName == $section.name }<li class="selected xTag-{ $tName }">{ else }<li class="xTag-{ $tName }">{ /if }
												<a class="handle" href="{ bertaLink section=$sName tag=$tName }" target="{ bertaTarget section=$sName tag=$tName }">{ $tag.title }</a>
											</li>
								 		{ /foreach }
									</ul>
								{ /if }

							</li>
						{ /foreach }
					</ul>
				{ /if }

			</div>
			<div id="sideColumnBottom">
                {if $berta.settings.socialMediaButtons.socialMediaLocation == 'footer' && $berta.settings.socialMediaButtons.socialMediaHTML}
                    { $berta.settings.socialMediaButtons.socialMediaHTML|@html_entity_decode|replace:'<br />':"\n" }
                {/if}
				<p id="userCopyright" class="xEditableTA xProperty-siteFooter">{ $siteFooter }</p>
				{ if !($berta.settings.settings.hideBertaCopyright=='yes' && $berta.hostingPlan>1) }
					<p id="bertaCopyright">{ bertaCopyright }</p>
				{ /if }
			</div>
		</div>


		{ if $berta.section.type == 'mash_up' }

			<div id="contentContainer" class="noEntries{if $berta.settings.pageLayout.responsive=='yes' } xResponsive{/if}">
				{if $berta.settings.pageLayout.responsive=='yes' }
					<div id="mainColumnContainer">
					<div id="mainColumn"{if $berta.settings.pageLayout.centered == 'yes' } class="xCentered"{ /if } data-paddingtop="{$berta.settings.pageLayout.paddingTop}">
				{/if}

				<div id="firstPageMarkedEntries" class="{ entriesListClasses } xNoEntryOrdering{if intval($berta.settings.pageLayout.mashUpColumns)>1} columns-{intval($berta.settings.pageLayout.mashUpColumns)}{ /if }">
					{ selectMarkedEntries assign="markedEntries" count=$berta.section.marked_items_count }
					{ foreach from=$markedEntries item="entry" name="markedEntriesLoop" }
						{ white_firstPageMarkedEntry entry=$entry imageselect=$berta.section.marked_items_imageselect }
					{ /foreach }
					<br class="clear" />
				</div>

				{if $berta.settings.pageLayout.responsive=='yes' }
					</div>
					</div>
				{/if}
			</div>

		{ else }

			<div id="contentContainer"{if $berta.settings.pageLayout.responsive=='yes' } class="xResponsive"{/if}>
				<div id="mainColumnContainer">
					<div id="mainColumn"{if $berta.settings.pageLayout.centered == 'yes' } class="xCentered"{ /if }{if $berta.settings.pageLayout.responsive=='yes' } data-paddingtop="{$berta.settings.pageLayout.paddingTop}"{/if}>
						<ol id="pageEntries" class="{ entriesListClasses }">

							{* now loop through all entries and print them out *}
							{ foreach from=$entries item="entry" name="entriesLoop" }
                                <li class="entry clearfix {if $berta.section.type == 'portfolio'}xHidden {/if}{ entryClasses entry=$entry }" id="{ entrySlug entry=$entry }">
									{* the entry settings and delete and move buttons live in the entryHeader - don't leave it out! *}
									{ entryHeader section=$berta.section.name entry=$entry }

									{* entryGallery prints the image gallery for the entry *}
                                    {if $berta.section.type != 'portfolio'}
									   { entryGallery entry=$entry }
                                    {/if}

                                    <div class="entryTextWrap galleryType-{ $entry.__raw.mediaCacheData['@attributes'].type }">
                                        { if $berta.section.type == 'portfolio' && ($berta.environment == 'engine' || !empty($entry.title)) }
                                            <h2><span class="xEditable xProperty-title xCaption-entry&nbsp;title"{if $berta.environment == 'engine'} data-path="{ $berta.options.MULTISITE }/entry/{ $berta.section.name }/{ $entry.id }/content/title"{ /if }>{ $entry.title }</span></h2>
                                        { /if }

                                        { if $berta.environment == 'engine' || !empty($entry.description) }
                                            <div class="entryText xEditableMCE xProperty-description"{if $berta.environment == 'engine'} data-path="{ $berta.options.MULTISITE }/entry/{ $berta.section.name }/{ $entry.id }/content/description"{ /if }>{ $entry.description }</div>
                                        { /if }
                                    </div>

                                    {* entryGallery prints the image gallery for the entry *}
                                    {if $berta.section.type == 'portfolio'}
                                       { entryGallery entry=$entry }
                                    {/if}

									{* entry footer wraps the entry including the header - don't leave it out! *}
									{ entryFooter entry=$entry }
								</li>

							{ foreachelse }
								{* the template can be modified in a way that here goes content the is displayed when there are no entries in the section *}

							{ /foreach }
						</ol>

						<br class="clear" />

                        {if $berta.section.type == 'portfolio'}
                            { include file="../_includes/inc.portfolio_thumbnails.tpl"  }
                        {/if}
					</div>
				</div>
			</div>

		{ /if }

		<div class="floating-banners">
		{section name=banners loop=10}
		    { assign var="setting_name_image" value="banner`$smarty.section.banners.iteration`_image" }
			{ assign var="setting_name_link" value="banner`$smarty.section.banners.iteration`_link" }
			{ assign var="setting_pos_name" value="banner`$smarty.section.banners.iteration`XY" }

			{ if $berta.settings.banners.$setting_name_image }
				<div class="floating-banner banner-{$smarty.section.banners.iteration}{if $berta.settings.pageLayout.responsive!='yes' } xEditableDragXY xProperty-{ $setting_pos_name }{/if}"{if $berta.settings.pageLayout.responsive!='yes' } style="{ bannerPos xy_name=$setting_pos_name }"{/if}>
					<div class="xHandle"></div>
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

	</div>

	{ if $berta.settings.settings.showTutorialVideos == 'yes' && !$smarty.cookies._berta_videos_hidden }{ videoTutorials }{ /if }

	{ intercomScript }

    { include file="../_includes/inc.js_include.tpl" }

	{ include file="../_includes/inc.counter.tpl"  }
</body>
</html>
