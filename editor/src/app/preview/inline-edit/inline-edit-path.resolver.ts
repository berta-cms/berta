import {
  UpdateSectionEntryAction,
  UpdateSectionEntryFromSyncAction,
} from '../../sites/sections/entries/entries-state/section-entries.actions';
import { UpdateSiteSettingsFromSyncAction } from '../../sites/settings/site-settings.actions';

/**
 * Maps an inline-edited field's `data-path` to the NGXS action that saves
 * it, branching on the path's type (site / settings / section / entry).
 *
 * Only the `entry` and `settings` branches are implemented so far. The
 * remaining branches are stubbed to fail loudly rather than silently no-op,
 * so an `xNgEditable`/`xNgEditableTA` marker accidentally added to an
 * unmigrated field type is caught immediately instead of quietly doing
 * nothing.
 */
export function resolveInlineEditAction(path: string, value: string): any {
  const pathParts = path.split('/');

  if (pathParts[1] === 'entry') {
    // A tags save needs `UpdateSectionEntryFromSyncAction`'s tags-specific
    // handling (`section-entries.state.ts`'s `updateSectionEntryFromSync`):
    // it stores the server's array-shaped `entry.tags` instead of the raw
    // posted string (which would break the next `entry.tags.tag.join(...)`
    // render), refreshes `SectionTagsState` (read by the `sectionsMenu` tag
    // submenu), keeps the section's `has_direct_content` in sync, and
    // re-saves once to refresh the entry's tag-derived slug. Every other entry field behaves identically under either
    // action, so this is scoped to tags only.
    const lastPathPart = pathParts.slice(4).join('/');

    if (lastPathPart === 'tags/tag') {
      return new UpdateSectionEntryFromSyncAction(path, value);
    }

    return new UpdateSectionEntryAction(path, value);
  }

  if (pathParts[1] === 'settings') {
    return new UpdateSiteSettingsFromSyncAction(path, value);
  }

  if (pathParts[1] === 'section') {
    throw new Error(
      `resolveInlineEditAction: section fields are not migrated to Angular inline editing yet (path: "${path}")`,
    );
  }

  if (pathParts[0] === 'site') {
    throw new Error(
      `resolveInlineEditAction: site-level fields are not migrated to Angular inline editing yet (path: "${path}")`,
    );
  }

  throw new Error(`resolveInlineEditAction: unrecognized data-path "${path}"`);
}
