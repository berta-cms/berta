import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { concat, defer, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AppState } from '../app-state/app.state';
import { PreviewService } from '../preview/preview.service';
import {
  CreateSiteSettingsAction,
  DeleteSiteSettingsAction,
  HandleSiteSettingsChildrenChangesAction,
  UpdateNavigationSiteSettingsAction,
} from '../sites/settings/site-settings.actions';
import {
  CreateSiteTemplateSettingsAction,
  DeleteSiteTemplateSettingsAction,
  HandleSiteTemplateSettingsAction,
} from '../sites/template-settings/site-template-settings.actions';
import {
  DeleteSiteSectionsAction,
  ReplaceSiteSectionsAction,
} from '../sites/sections/sections-state/site-sections.actions';
import {
  DeleteSiteSectionsEntriesAction,
  ReplaceSectionEntriesAction,
} from '../sites/sections/entries/entries-state/section-entries.actions';
import {
  AddSiteSectionsTagsAction,
  DeleteSiteSectionsTagsAction,
} from '../sites/sections/tags/section-tags.actions';
import {
  InitSitesAction,
  SiteContentRefreshedAction,
} from '../sites/sites-state/sites.actions';
import { SiteStateModel } from '../sites/sites-state/site-state.model';
import { AiChange, AiRefresh } from './ai-assistant.service';

/**
 * Shows changes the AI chat made on the server as the editor shows its own edits: the touched parts of the store are
 * swapped for the fresh data the server sent, then the preview is re-rendered with the same triggers the editor's
 * own edits use, and reloaded only where the editor reloads it for its own edits too
 * (TemplateRerenderService.handleIframeHardReload).
 */
@Injectable({ providedIn: 'root' })
export class AiChangesMirrorService {
  /** Site settings groups whose components the templates re-render (SiteSettingsState.updateSiteSettings). */
  private static readonly SETTINGS_RERENDER_GROUPS = [
    'siteTexts',
    'socialMediaLinks',
    'socialMediaButtons',
    'banners',
    'settings',
    'entryLayout',
    'pageLayout',
  ];

  /** Design groups the templates re-render; the rest are styles, which the preview updates from the store. */
  private static readonly DESIGN_RERENDER_GROUPS = [
    'pageLayout',
    'pageHeading',
    'entryLayout',
    'sideBar',
    'heading',
    'menu',
    'tagsMenu',
    'css',
  ];

  /** Section fields after which the editor reloads the preview. */
  private static readonly RELOADING_SECTION_FIELDS = [
    'type',
    'params.columns',
    'params.entryMaxWidth',
    'params.entryPadding',
    'params.backgroundVideoEmbed',
    'params.backgroundVideoRatio',
    'params.marked_items_imageselect',
    'params.marked_items_count',
  ];

  constructor(
    private store: Store,
    private previewService: PreviewService,
    private router: Router,
  ) {}

  /** Swaps the fresh data into the store and updates the preview. */
  mirror(changes: AiChange[], refresh: AiRefresh): Observable<unknown> {
    if (changes.length === 0) {
      return of(null);
    }

    const { triggers, reload } = this.previewUpdates(changes);

    return concat(
      defer(() => this.store.dispatch(this.storeUpdates(refresh))),
      defer(() => (triggers.length ? this.store.dispatch(triggers) : of(null))),
    ).pipe(
      tap({
        complete: () => {
          this.leaveRemovedSite(refresh);

          if (reload) {
            this.previewService.reloadIframe();
          }
        },
      }),
    );
  }

  /** The actions that swap the fresh parts into the store. */
  private storeUpdates(refresh: AiRefresh): object[] {
    const actions: object[] = [];

    if (refresh.sites) {
      const names = refresh.sites.map((site) => site.name);

      this.knownSites()
        .filter((name) => !names.includes(name))
        .forEach((name) =>
          actions.push(
            new DeleteSiteSettingsAction(name),
            new DeleteSiteTemplateSettingsAction(name),
            new DeleteSiteSectionsAction(name),
            new DeleteSiteSectionsEntriesAction(name),
            new DeleteSiteSectionsTagsAction(name),
          ),
        );
      actions.push(new InitSitesAction(refresh.sites));
    }

    for (const [name, data] of Object.entries(refresh.site_data ?? {})) {
      const site = { name } as SiteStateModel;

      if (data.settings) {
        actions.push(new CreateSiteSettingsAction(site, data.settings as any));
      }
      if (data.template_settings) {
        actions.push(
          new CreateSiteTemplateSettingsAction(site, data.template_settings),
        );
      }
      if (data.sections) {
        actions.push(new ReplaceSiteSectionsAction(name, data.sections));
      }
      if (data.entries) {
        actions.push(
          new ReplaceSectionEntriesAction(
            name,
            data.entries,
            data.sections ? data.sections.map((section) => section.name) : null,
          ),
        );
      }
      if (data.tags) {
        actions.push(new AddSiteSectionsTagsAction(site, data.tags as any));
      }
    }

    return actions;
  }

  /**
   * The re-render triggers the changes of the site open in the editor need, and whether the preview reloads.
   */
  private previewUpdates(changes: AiChange[]): {
    triggers: object[];
    reload: boolean;
  } {
    const site = this.store.selectSnapshot(AppState.getSite) ?? '';
    const triggers: object[] = [];
    let content = false;
    let reload = false;

    for (const change of changes) {
      if (change.kind === 'subsite') {
        content = true;
        continue;
      }

      if (change.subsite !== site) {
        continue;
      }

      for (const item of change.items) {
        const payload = { [item.key]: item.value };

        switch (change.kind) {
          case 'settings':
            if (item.group === 'media') {
              reload = true;
            } else if (item.group === 'navigation') {
              triggers.push(new UpdateNavigationSiteSettingsAction(payload));
            } else if (
              AiChangesMirrorService.SETTINGS_RERENDER_GROUPS.includes(
                item.group,
              )
            ) {
              triggers.push(
                new HandleSiteSettingsChildrenChangesAction(
                  item.group,
                  payload,
                ),
              );
            }
            break;
          case 'design':
            if (
              AiChangesMirrorService.DESIGN_RERENDER_GROUPS.includes(item.group)
            ) {
              triggers.push(
                new HandleSiteTemplateSettingsAction(item.group, payload),
              );
            }
            break;
          case 'section':
            content = true;
            reload ||= AiChangesMirrorService.RELOADING_SECTION_FIELDS.includes(
              item.key,
            );
            break;
          case 'entry':
            content = true;
            break;
          case 'gallery':
            content = true;
            reload ||=
              item.key.startsWith('background.') ||
              item.key.endsWith('.gallery.size');
            break;
        }
      }
    }

    if (content) {
      triggers.push(new SiteContentRefreshedAction(site));
    }

    return { triggers, reload };
  }

  /** Opens the main site when the site open in the editor is gone, e.g. deleted or given a new address. */
  private leaveRemovedSite(refresh: AiRefresh) {
    const site = this.store.selectSnapshot(AppState.getSite) ?? '';

    if (
      refresh.sites &&
      site !== '' &&
      !refresh.sites.some((known) => known.name === site)
    ) {
      this.router.navigate([], {
        queryParams: { site: null },
        queryParamsHandling: 'merge',
      });
    }
  }

  private knownSites(): string[] {
    return (
      this.store.selectSnapshot((state) => state.sites as SiteStateModel[]) ??
      []
    ).map((site) => site.name);
  }
}
