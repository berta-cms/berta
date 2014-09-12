{* multisites menu ********************************************************************* *}
{if $berta.options.MULTISITES|count > 1}
    <ul id="multisites" class="{ messClasses property='multisitesXY' }" style="{ messStyles xy=$multisitesXY }">
        {foreach $berta.options.MULTISITES AS $siteName => $site }
            {if $berta.options.MULTISITE != $siteName || ($siteName=='0' && $berta.options.MULTISITE !='' ) }
                <li><a href="{ bertaLink site=$siteName }">{if $site['title']['value']!=''}{$site['title']['value']}{else}{if $siteName=='0'}Main site{else}{$siteName}{/if}{/if}</a></li>
            {/if}
        {/foreach}
    </ul>
{/if}

<!-- PAGE HEADING -->
{ if ($berta.environment == 'site' && $berta.settings.navigation.landingSectionPageHeadingVisible=='yes') || $berta.environment == 'engine' || ($berta.environment == 'site' && $berta.settings.navigation.landingSectionPageHeadingVisible=='no' && $berta.sectionName != $berta.sections|@key) }
    { if $berta.settings.heading.image }
        <h1 class="{ messClasses property='siteHeadingXY' }{ if $berta.settings.heading.position == 'fixed' } xFixed{ /if }" style="{ messStyles xy=$siteHeadingXY }"><a href="{ bertaLink }"><img src="{ $berta.options.MEDIA_ABS_ROOT }{ $berta.settings.heading.image }" /></a></h1>
    { else }
        <h1 class="{ messClasses property='siteHeadingXY' }{ if $berta.settings.heading.position == 'fixed' } xFixed{ /if }" style="{ messStyles xy=$siteHeadingXY }">
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
    <nav>
        {if $berta.settings.pageLayout.responsive == 'yes'}
            <a href="#" id="menuToggle"><span></span></a>
        {/if}
        <ul>
            { assign var="currentSectionName" value=$berta.sectionName }
            { foreach $berta.publishedSections as $sName => $section }
                { if $section.type != 'shopping_cart' }
                <li class="menuItem xSection-{ $sName } { messClasses property='positionXY' } { if $currentSectionName == $section.name }menuItemSelected{ /if }{ if $berta.settings.menu.position == 'fixed' } xFixed{ /if }" style="{ messStyles xy=$section.positionXY }">
                    <a href="{ bertaLink section=$sName }" target="{ bertaTarget section=$sName }">{ $section.title }</a>

                    { if $berta.settings.tagsMenu.hidden=='no' && (!empty($berta.tags.$sName) && ($berta.settings.pageLayout.responsive == 'yes' || $berta.settings.tagsMenu.alwaysOpen=='yes' || $berta.sectionName==$sName)) }
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