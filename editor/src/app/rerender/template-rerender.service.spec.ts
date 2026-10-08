import { Actions, ActionStatus } from '@ngxs/store';
import { Subject } from 'rxjs';

import { TemplateRerenderService } from './template-rerender.service';
import { TemplateRenderService } from '../render/template-render.service';
import { AddSectionEntryFromSyncAction } from '../sites/sections/entries/entries-state/section-entries.actions';
import { HandleSiteSettingsChildrenChangesAction } from '../sites/settings/site-settings.actions';
import { SiteSettingChildrenHandler } from './types/components';

describe('TemplateRerenderService', () => {
  const ENTRY =
    '<li class="xEntry"><a class="xCreateNewEntry" href="#"></a>entry</li>';

  let doc: Document;
  let iframe: HTMLIFrameElement;
  let dispatchEvent: jasmine.Spy;
  let actions$: Subject<{ action: unknown; status: ActionStatus }>;
  let viewData: Record<string, string>;
  let service: TemplateRerenderService;

  function succeed(action: unknown) {
    actions$.next({ action, status: ActionStatus.Successful });
  }

  function dispatchedEvents(): string[] {
    return dispatchEvent.calls.allArgs().map(([event]) => event.type);
  }

  beforeEach(() => {
    doc = document.implementation.createHTMLDocument('');
    dispatchEvent = jasmine.createSpy('dispatchEvent');
    iframe = {
      contentDocument: doc,
      contentWindow: { dispatchEvent },
    } as unknown as HTMLIFrameElement;
    actions$ = new Subject();
    viewData = {};
    service = new TemplateRerenderService(
      { getViewData: () => viewData } as unknown as TemplateRenderService,
      actions$ as unknown as Actions,
    );
  });

  describe('entry creation', () => {
    const created = new AddSectionEntryFromSyncAction('', 'works', {
      tag: null,
      before_entry: null,
    });

    beforeEach(() => {
      viewData.entries = ENTRY + ENTRY;
      viewData.portfolioThumbnails = '';
      service.handleEntryCreationRerender(iframe);
    });

    it('rerenders a page that has no "create new entry" link yet', () => {
      doc.body.innerHTML = '<ol id="pageEntries"></ol>';

      succeed(created);

      expect(doc.querySelectorAll('#pageEntries .xEntry').length).toBe(2);
      expect(dispatchedEvents()).toEqual(['entriesRerendered']);
    });

    it('keeps the "create new entry" link of every entry', () => {
      doc.body.innerHTML = '<ol id="pageEntries"></ol>';

      succeed(created);

      expect(doc.querySelectorAll('.xEntry .xCreateNewEntry').length).toBe(2);
    });

    it('rerenders a page without an entries list', () => {
      succeed(created);

      expect(dispatchedEvents()).toEqual(['entriesRerendered']);
    });
  });

  it('rerenders site settings on a page without entries', () => {
    doc.body.innerHTML = '<div id="siteBanners"></div>';
    viewData.siteBanners = '<div class="banner"></div>';
    service.handleSiteSettingChildrenHandleRerender(iframe, {
      banners: { id: 'siteBanners', dataKey: 'siteBanners' },
    } as SiteSettingChildrenHandler);

    succeed(new HandleSiteSettingsChildrenChangesAction('banners'));

    expect(doc.querySelector('#siteBanners .banner')).not.toBeNull();
    expect(dispatchedEvents()).toEqual(['entriesRerendered']);
  });
});
