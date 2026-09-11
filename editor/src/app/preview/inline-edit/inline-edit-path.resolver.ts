import { UpdateSectionEntryAction } from '../../sites/sections/entries/entries-state/section-entries.actions';
import { UpdateSiteSettingsFromSyncAction } from '../../sites/settings/site-settings.actions';

/**
 * Mirrors the legacy `path`-branching in `engine/js/BertaEditorBase.js`'s
 * `elementEdit_save` (site / settings / section / entry), but dispatches
 * Angular NGXS actions instead of the legacy engine's own redux store.
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
