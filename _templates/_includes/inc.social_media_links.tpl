{foreach $berta.settings.socialMediaLinks.links.link as $link}
  {assign var="icon_path" value="`$berta.options.TEMPLATES_ROOT`_includes/icons/`$link.icon`.svg" }
  {if (file_exists($icon_path))}
    <a href="{$link.url}" target="_blank" class="social-icon">{$icon_path|file_get_contents}</a>
  {/if}
{/foreach}
