{if ($entries)}
    <div class="portfolioThumbnails clearfix">
        {foreach from=$entries key="entryId" item="entry" name="entriesLoop"}
            <div class="portfolioThumbnail" data-id="{ $entryId }">
                <div class="wrap">
                    <div class="xHandle"></div>
                    <a href="#{ entrySlug entry=$entry }">
                        { entryGalleryFirstImage entry=$entry }
                        <span> {if $entry.title}{ $entry.title }{else}entry-{ $entryId }{/if}</span>
                    </a>
                </div>
            </div>
        {/foreach}
    </div>
{/if}