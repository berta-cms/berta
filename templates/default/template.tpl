<!DOCTYPE html>
<!--[if lt IE 7 ]> <html class="ie ie6 ie-old"> <![endif]-->
<!--[if IE 7 ]>    <html class="ie ie7 ie-old"> <![endif]-->
<!--[if IE 8 ]>    <html class="ie ie8"> <![endif]-->
<!--[if IE 9 ]>    <html class="ie ie9"> <![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--> <html> <!--<![endif]-->
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
	<title>{ $berta.settings.texts.pageTitle }</title>
	<meta name="keywords" content="{ $berta.settings.texts.metaKeywords }" />
	<meta name="description" content="{ $berta.settings.texts.metaDescription }" />
	<meta name="author" content="{ $berta.settings.texts.ownerName }" />
	{$berta.settings.settings.googleSiteVerification|@html_entity_decode}

	{ if $berta.settings.pageLayout.favicon }
	<link rel="SHORTCUT ICON" href="{ $berta.options.MEDIA_ABS_ROOT }{ $berta.settings.pageLayout.favicon }" />
	{ else }
	<link rel="SHORTCUT ICON" href="{ $berta.options.TEMPLATES_ABS_ROOT }{ $berta.templateName }/favicon.ico" />
	{ /if }
	{ $berta.scripts }
	{ $berta.css }
    {if $berta.settings.css.customCSS}
        <style type="text/css">
        {$berta.settings.css.customCSS|@html_entity_decode|replace:'<br />':"\n"}
        </style>
    {/if}
	{ googleWebFontsAPI }
</head>

<body>

	{if $berta.settings.background.backgroundAttachment=='fill' AND $berta.settings.background.backgroundImageEnabled=='yes' AND $berta.settings.background.backgroundImage!=''}
		<div id="xFilledBackground" class="xPosition-{' '|str_replace:'_':$berta.settings.background.backgroundPosition}">
			<img src="{ $berta.options.MEDIA_ABS_ROOT }{ $berta.settings.background.backgroundImage }" />
		</div>
	{/if}

	{* all templates must include div with id=allContainer *}
	<div id="allContainer">

		{* engine panel lives in pageHeader - don't leave it out *}
		{ pageHeader }

		<div id="contentContainer">

			{ if ($berta.environment == 'site' && $berta.settings.navigation.landingSectionMenuVisible=='yes') || $berta.environment == 'engine' || ($berta.environment == 'site' && $berta.settings.navigation.landingSectionMenuVisible=='no' && $berta.sectionName != $berta.sections|@key) }
				<div id="additionalText" class="xEditableDragXY xProperty-additionalTextXY" style="{ additionalTextPos xy=$additionalTextXY }">
					<div class="xHandle"></div>
					<div class="xEditableMCESimple xProperty-additionalText xCaption-additional-text">
					{ $additionalText }
					</div>
				</div>
			{/if}

            { if ($berta.environment == 'site' && $berta.settings.navigation.landingSectionMenuVisible=='yes') || $berta.environment == 'engine' || ($berta.environment == 'site' && $berta.settings.navigation.landingSectionMenuVisible=='no' && $berta.sectionName != $berta.sections|@key) }
                { if $berta.settings.pageHeading.image }
                <h1><a href="{ bertaLink }"><img src="{ $berta.options.MEDIA_ABS_ROOT }{ $berta.settings.pageHeading.image }" /></a></h1>
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


			<div id="siteTopMenu">

				{* *** sections menu ***************************************************************** *}
				{ assign var="sName" value=$berta.sectionName }
				{ if count($berta.publishedSections) > 0 && (($berta.environment == 'site' && $berta.settings.navigation.landingSectionMenuVisible=='yes') || $berta.environment == 'engine' || ($berta.environment == 'site' && $berta.settings.navigation.landingSectionMenuVisible=='no' && $berta.sectionName != $berta.sections|@key))  }
					<ul id="mainMenu">
						{ assign var="firstSection" value="1" }
						{ foreach from=$berta.publishedSections item="section" name="sectionsMenuLoop" }
							{ if $berta.sectionName == $section.name }<li class="selected">{ else }<li>{ /if }
								{ if !$firstSection }
									<span class="separator">{ $berta.settings.menu.separator }</span>
								{ /if }
								{ if $berta.sectionName == $section.name && $berta.settings.navigation.alwaysSelectTag == 'yes' && !empty($berta.tags.$sName) }
									<span>{ $section.title }</span>
								{ else }
									<a href="{ bertaLink section=$section.name }" target="{ bertaTarget section=$section.name }">{ $section.title }</a>
								{ /if }
							</li>
							{ assign var="firstSection" value="0" }
						{ /foreach }
					</ul>
				{ /if }

				{* *** sub menu ********************************************************************* *}
				{ if !empty($berta.tags.$sName) }
						<ul id="subMenu" class="subMenu xSection-{ $sName }{ if $berta.tags.$sName|@count > 1 && $berta.environment == 'engine' } xAllowOrdering{ /if }">
							{ assign var="firstSection" value="1" }
							{ foreach from=$berta.tags.$sName key="tName" item="tag" name="subMenuLoop" }
								{ if $berta.tagName == $tName }<li class="selected xTag-{ $tName }">{ else }<li class="xTag-{ $tName }">{ /if }
									{ if $berta.environment == 'engine' || !$firstSection }
										<span class="separator">{ $berta.settings.subMenu.separator }</span>
									{ /if }
									<a class="handle" href="{ bertaLink section=$berta.sectionName tag=$tName }" target="{ bertaTarget section=$berta.sectionName tag=$tName }">{ $tag.title }</a>
								</li>
								{ assign var="firstSection" value="0" }
							{ /foreach }
						</ul>
				{ /if }

				<br class="clear" />
			</div>



			<ol id="pageEntries" class="{ entriesListClasses }">

				{* now loop through all entries and print them out *}
				{ foreach from=$entries key="entryId" item="entry" name="entriesLoop" }
 					<li class="entry { entryClasses entry=$entry }">

						{* the entry settings and delete and move buttons live in the entryHeader - don't leave it out! *}
						{ entryHeader entry=$entry }

						{ if $berta.settings.entryLayout.galleryPosition == 'above title' }
							{* entryGallery prints the image gallery for the entry *}
							{ entryGallery entry=$entry }
						{ /if }

						{ if $berta.environment == 'engine' || !empty($entry.title) }
						<h2><span class="xEditable xProperty-title xCaption-entry&nbsp;title">{ $entry.title }</span></h2>
						{ /if }

						{ if $berta.settings.entryLayout.galleryPosition == 'between title/description' }
							{* entryGallery prints the image gallery for the entry *}
							{ entryGallery entry=$entry }
						{ /if }

						{ if $berta.environment == 'engine' || !empty($entry.description) }
						<div class="entryText xEditableMCE xProperty-description">{ $entry.description }</div>
						{ /if }

						{ if $berta.settings.entryLayout.galleryPosition == 'below description' }
							{* entryGallery prints the image gallery for the entry *}
							{ entryGallery entry=$entry }
						{ /if }

						{ assign var=hasTags value= $berta.environment == 'engine' or $berta.settings.entryLayout.displayTags == 'yes' and count($entry.tags) > 0 }
						{ assign var=hasDate value= ($berta.environment == 'engine' || !empty($entry.date)) and $berta.settings.entryLayout.dateFormat != 'hidden' }
						{ assign var=hasURL value= $berta.environment == 'engine' || !empty($entry.url) }
						{ if $hasTags || $hasDate || $hasURL }
						<div class="entryContent">
							<div class="xEditable xProperty-url">{ $entry.url }</div>
						</div>
						{ /if }

						{* entry footer wraps the entry including the header - don't leave it out! *}
						{ entryFooter entry=$entry }
						<br class="clear" />
					</li>
				{ foreachelse }
					{* the template can be modified in a way that here goes content the is displayed when there are no entries in the section *}

				{ /foreach }

			</ol>

            <div id="additionalFooterText" class="xEditableMCESimple xProperty-additionalFooterText xCaption-additional-footer-text clearfix">
                { $additionalFooterText }
            </div>

			<div class="footer xEditableTA xProperty-siteFooter">{ $siteFooter }</div>
			{ if !($berta.settings.settings.hideBertaCopyright=='yes' && $berta.hostingPlan>1) }
				<div class="bertaCopyright">{ bertaCopyright }</div>
			{ /if }
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

	</div>

    { if $berta.settings.settings.showTutorialVideos == 'yes' && !$smarty.cookies._berta_videos_hidden }{ videoTutorials }{ /if }


	{ include file="../_includes/inc.js_include.tpl" }

	{ include file="../_includes/inc.counter.tpl"  }
</body>
</html>
