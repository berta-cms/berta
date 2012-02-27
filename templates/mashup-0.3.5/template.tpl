<!DOCTYPE html>
<!--[if lt IE 7 ]> <html class="ie6 ie-old"> <![endif]-->
<!--[if IE 7 ]>    <html class="ie7 ie-old"> <![endif]-->
<!--[if IE 8 ]>    <html class="ie8"> <![endif]-->
<!--[if IE 9 ]>    <html class="ie9"> <![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--> <html> <!--<![endif]-->
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
	
	{ $berta.scripts }
	{ $berta.css }
	{ googleWebFontsAPI }		
	<script type="text/javascript" src="{ $berta.options.TEMPLATES_ABS_ROOT }{ $berta.templateName }/superwhite.js"></script>
</head>

<body>
	
	{if $berta.settings.background.backgroundAttachment=='fill' AND $berta.settings.background.backgroundImageEnabled=='yes' AND $berta.settings.background.backgroundImage!=''}
		<div id="xFilledBackground" class="xPosition-{' '|str_replace:'_':$berta.settings.background.backgroundPosition}">
			<img src="{ $berta.options.MEDIA_ABS_ROOT }{ $berta.settings.background.backgroundImage }" />
		</div>
	{/if}
	
	{* all templates must include allContainer *}
	<div id="allContainer">
		
		{* engine panel lives in pageHeader - don't leave it out *}
		{ pageHeader }
		
		<div id="sideColumn">
			<div id="sideColumnTop">

                { if ($berta.environment == 'site' && $berta.settings.navigation.landingSectionMenuVisible=='yes') || $berta.environment == 'engine' || ($berta.environment == 'site' && $berta.settings.navigation.landingSectionMenuVisible=='no' && $berta.sectionName != $berta.sections|@key) }
                    { if $berta.settings.sideBar.image }
                    <h1><a href="{ bertaLink }"><img src="{ $berta.options.MEDIA_ABS_ROOT }{ $berta.settings.sideBar.image }" /></a></h1>
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

				{ if count($berta.publishedSections) > 0 && (($berta.environment == 'site' && $berta.settings.navigation.landingSectionMenuVisible=='yes') || $berta.environment == 'engine' || ($berta.environment == 'site' && $berta.settings.navigation.landingSectionMenuVisible=='no' && $berta.sectionName != $berta.sections|@key)) }
					<ul>
						{ assign var="currnetSectionName" value=$berta.sectionName }
						{ foreach from=$berta.publishedSections item="section" key="sName" name="sectionsMenuLoop" }
							{ if $currnetSectionName == $section.name }<li class="selected">{ else }<li>{ /if }
								<a href="{ bertaLink section=$sName }" target="{ bertaTarget section=$sName }">{ $section.title }</a>
						
								{ if !empty($berta.tags.$sName) }
									<ul>
										{ foreach from=$berta.tags.$sName key="tName" item="tag" name="subSectionsMenuLoop" }
											{ if $berta.tagName == $tName and $currnetSectionName == $section.name }<li class="selected">{ else }<li>{ /if }
												<a href="{ bertaLink section=$sName tag=$tName }" target="{ bertaTarget section=$sName tag=$tName }">{ $tag.title }</a>
											</li>
								 		{ /foreach }	
									</ul>
								{ /if }
						
							</li>
						{ /foreach }
					</ul>
				{ /if }
				
				<div id="additionalText" class="xEditableDragXY xProperty-additionalTextXY" style="{ additionalTextPos xy=$additionalTextXY }"> 
					<div class="xHandle"></div>
					<div class="xEditableMCESimple xProperty-additionalText xCaption-additional-text">
					{ $additionalText }
					</div>
				</div>
				
			</div>
			<div id="sideColumnBottom">
				<p id="userCopyright" class="xEditableTA xProperty-siteFooter">{ $siteFooter }</p>
				<p id="bertaCopyright">{ bertaCopyright }</p>
			</div>
		</div>

	
		{ if $berta.section.type == 'mash_up' }
	
			<div id="contentContainer" class="noEntries">
				<div id="firstPageMarkedEntries" class="{ entriesListClasses } xNoEntryOrdering">
				{ selectMarkedEntries assign="markedEntries" count=$berta.section.marked_items_count }
				{ foreach from=$markedEntries item="entry" name="markedEntriesLoop" }
					{ white_firstPageMarkedEntry entry=$entry imageselect=$berta.section.marked_items_imageselect }
				{ /foreach }
				<br class="clear" />
				</div>
			</div>
	
		{ else }

			<div id="contentContainer">
				<div id="mainColumnContainer">
					<div id="mainColumn">
						<ol id="pageEntries" class="{ entriesListClasses }">

							{* now loop through all entries and print them out *}
							{ foreach from=$entries item="entry" name="entriesLoop" }
								<li class="entry { entryClasses entry=$entry }">
					
									{* the entry settings and delete and move buttons live in the entryHeader - don't leave it out! *}
									{ entryHeader entry=$entry }
		
									{* entryGallery prints the image gallery for the entry *}
									{ entryGallery entry=$entry }
		
									{ if $berta.environment == 'engine' || !empty($entry.description) }
									<div class="entryText xEditableMCE xProperty-description">{ $entry.description }</div>
									{ /if }
														
									{* entry footer wraps the entry including the header - don't leave it out! *}
									{ entryFooter entry=$entry }
								</li>
			
							{ foreachelse }
								{* the template can be modified in a way that here goes content the is displayed when there are no entries in the section *}
	
							{ /foreach }
						</ol>
	
						<br class="clear" />
					</div>
				</div>
			</div>
	
		{ /if }
		
		
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
	
	{ include file="../_includes/inc.js_include.tpl" }

	{ include file="../_includes/inc.counter.tpl"  }
</body>
</html>
