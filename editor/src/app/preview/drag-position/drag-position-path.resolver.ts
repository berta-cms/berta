import { UpdateSectionEntriesPositionAction } from '../../sites/sections/entries/entries-state/section-entries.actions';
import { UpdateSiteSectionFromSyncAction } from '../../sites/sections/sections-state/site-sections.actions';
import { UpdateSiteSettingsFromSyncAction } from '../../sites/settings/site-settings.actions';

export interface PositionUpdate {
  path: string;
  value: string;
}

/**
 * Maps dragged elements' `data-path`s + new `"left,top"` values to the NGXS
 * actions that save them. None of these actions triggers a preview rerender:
 * the dragged elements are already where they belong.
 *
 * - `<site>/entry/<section>/<id>/content/positionXY`: one
 *   `UpdateSectionEntriesPositionAction` per section, so a group (Shift)
 *   drag of any number of entries is a single request.
 * - `<site>/settings/<group>/<key>`: `UpdateSiteSettingsFromSyncAction`.
 * - `<site>/section/<order>/positionXY`: `UpdateSiteSectionFromSyncAction`.
 */
export function resolveDragPositionActions(updates: PositionUpdate[]): any[] {
  const actions: any[] = [];
  const entryActions = new Map<string, UpdateSectionEntriesPositionAction>();

  updates.forEach(({ path, value }) => {
    const [site, type, section, entryId] = path.split('/');

    if (type === 'entry') {
      const key = `${site}/${section}`;

      if (!entryActions.has(key)) {
        const action = new UpdateSectionEntriesPositionAction(
          site,
          section,
          [],
        );
        entryActions.set(key, action);
        actions.push(action);
      }

      entryActions.get(key).positions.push({ id: entryId, value });
      return;
    }

    if (type === 'settings') {
      actions.push(new UpdateSiteSettingsFromSyncAction(path, value));
      return;
    }

    if (type === 'section') {
      actions.push(new UpdateSiteSectionFromSyncAction(path, value));
      return;
    }

    throw new Error(
      `resolveDragPositionActions: unrecognized data-path "${path}"`,
    );
  });

  return actions;
}
