<!DOCTYPE html>
<!--[if lt IE 7 ]> <html class="ie6 ie-old"> <![endif]-->
<!--[if IE 7 ]>    <html class="ie7 ie-old"> <![endif]-->
<!--[if IE 8 ]>    <html class="ie8"> <![endif]-->
<!--[if IE 9 ]>    <html class="ie9"> <![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--> <html> <!--<![endif]-->
{$sectionHead}

<body class="xContent-{ $berta.section.name }{if $berta.tagName} xSubmenu-{$berta.tagName}{/if}{if $berta.environment == 'engine'} page-xMySite{/if}{if $berta.section.type} xSectionType-{ $berta.section.type }{/if}{if $berta.settings.pageLayout.responsive=='yes'} bt-responsive{/if}">

	{if $berta.settings.background.backgroundAttachment=='fill' AND $berta.settings.background.backgroundImageEnabled=='yes' AND $berta.settings.background.backgroundImage!=''}
		<div id="xFilledBackground" class="xPosition-{' '|str_replace:'_':$berta.settings.background.backgroundPosition}">
			<img src="{ $berta.options.MEDIA_ABS_ROOT }{ $berta.settings.background.backgroundImage }" />
		</div>
	{/if}

	{* all templates must include allContainer *}
	<div id="allContainer"{ if $berta.settings.pageLayout.centered == 'yes' }class="xCentered"{ /if }>

		<div id="sideColumn" class="{ if $berta.settings.pageLayout.centered == 'yes' }xCentered{ /if }{if $berta.settings.pageLayout.responsive=='yes'} xResponsive{/if}">
			<div id="sideColumnTop">

	              {* multisites menu ********************************************************************* *}
                {$sitesMenu}

                {$siteHeader}

				{$additionalTextBlock}

        {$sectionsMenu}
			</div>
			<div id="sideColumnBottom">
        {if $berta.settings.socialMediaButtons.socialMediaLocation == 'footer' && $berta.settings.socialMediaButtons.socialMediaHTML}
          { $berta.settings.socialMediaButtons.socialMediaHTML|@html_entity_decode|replace:'<br />':"\n" }
        {elseif $berta.settings.socialMediaLinks.location == 'footer' && $socialMediaLinks}
          {$socialMediaLinks}
        {/if}
				<p id="userCopyright" class="xEditableTA xProperty-siteFooter"{if $berta.environment == 'engine'} data-path="{ $berta.options.MULTISITE }/settings/siteTexts/siteFooter"{ /if }>
          { $siteFooter }
        </p>
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
          {*
            temporary workaround for firstPageMarkedEntry plugin function otherwise error about undefined function smarty_function_bertaLink is thrown
            TODO move firstPageMarkedEntry rendering to API
          *}
          <!-- { bertaLink } -->
					{ selectMarkedEntries assign="markedEntries" count=$berta.section.marked_items_count }
					{ foreach from=$markedEntries item="entry" name="markedEntriesLoop" }
						{ firstPageMarkedEntry entry=$entry imageselect=$berta.section.marked_items_imageselect }
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
							{*
                temporary workaround for firstPageMarkedEntry plugin function otherwise error about undefined class entryClasses is thrown
                TODO move firstPageMarkedEntry rendering to API app
              *}
							{ foreach from=$entries item="entry" name="entriesLoop" }
                <!-- { entryClasses entry=$entry } -->
							{ /foreach }

              {$entriesHTML}
						</ol>

						<br class="clear" />

            {$portfolioThumbnails}
					</div>
				</div>
			</div>

		{ /if }

		<div class="floating-banners">
		  { $siteBanners }
		</div>

	</div>

  { $sectionFooter }
</body>
</html>
