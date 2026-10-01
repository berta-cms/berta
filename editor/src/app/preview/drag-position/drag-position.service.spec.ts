import { Store } from '@ngxs/store';
import { of, throwError } from 'rxjs';

import { DragPositionService } from './drag-position.service';
import { UpdateSectionEntriesPositionAction } from '../../sites/sections/entries/entries-state/section-entries.actions';
import { UpdateSiteSectionFromSyncAction } from '../../sites/sections/sections-state/site-sections.actions';
import { UpdateSiteSettingsFromSyncAction } from '../../sites/settings/site-settings.actions';

/**
 * Drives the service with synthetic pointer events against a real
 * same-origin iframe, the way the preview uses it.
 */
describe('DragPositionService', () => {
  let iframe: HTMLIFrameElement;
  let doc: Document;
  let service: DragPositionService;
  let store: jasmine.SpyObj<Store>;
  let gridStep: string;

  const ENTRY_HTML = (id: string, left: number, top: number) => `
    <div class="xEntry mess xNgEditableDragXY" data-path="0/entry/works/${id}/content/positionXY"
      style="left:${left}px;top:${top}px">
      <a href="#" class="xEntryMove xHandle">move</a>
    </div>`;

  function setUp(bodyHtml: string) {
    doc.body.innerHTML = bodyHtml;
    service.attach(iframe);
  }

  function el(selector: string): HTMLElement {
    return doc.querySelector(selector) as HTMLElement;
  }

  function pointer(
    type: string,
    target: Element,
    clientX: number,
    clientY: number,
    init: PointerEventInit = {},
  ) {
    target.dispatchEvent(
      new PointerEvent(type, {
        bubbles: true,
        cancelable: true,
        isPrimary: true,
        pointerId: 1,
        button: 0,
        clientX,
        clientY,
        ...init,
      }),
    );
  }

  function drag(
    handle: Element,
    dx: number,
    dy: number,
    init: PointerEventInit = {},
  ) {
    pointer('pointerdown', handle, 10, 10);
    pointer('pointermove', handle, 10 + dx, 10 + dy, init);
    pointer('pointerup', handle, 10 + dx, 10 + dy, init);
  }

  function position(target: HTMLElement) {
    return { left: target.style.left, top: target.style.top };
  }

  function dispatchedActions(): any[] {
    return store.dispatch.calls.mostRecent().args[0] as any[];
  }

  function createIframe(): HTMLIFrameElement {
    const frame = document.createElement('iframe');
    frame.style.width = '1000px';
    frame.style.height = '600px';
    document.body.appendChild(frame);
    frame.contentDocument.open();
    frame.contentDocument.write(
      '<!doctype html><html><head><style>' +
        'body{margin:0} .xNgEditableDragXY,.xCreateNewEntry{position:absolute}' +
        '.xFixed{position:fixed} .mess>.xHandle{position:absolute;left:0;top:0;margin-left:-20px}' +
        '</style></head><body></body></html>',
    );
    frame.contentDocument.close();
    return frame;
  }

  function nextFrame(win: Window): Promise<void> {
    return new Promise((resolve) => win.requestAnimationFrame(() => resolve()));
  }

  beforeEach(() => {
    iframe = createIframe();
    doc = iframe.contentDocument;

    gridStep = '1';
    store = jasmine.createSpyObj<Store>('Store', ['dispatch', 'selectSnapshot']);
    store.selectSnapshot.and.callFake((() => [
      { slug: 'pageLayout', settings: [{ slug: 'gridStep', value: gridStep }] },
    ]) as any);
    store.dispatch.and.returnValue(of(null));
    service = new DragPositionService(store);
  });

  afterEach(() => iframe.remove());

  it('moves an entry by its handle and saves it with one request', () => {
    setUp(ENTRY_HTML('1', 100, 100));

    drag(el('.xHandle'), 23, 17);

    expect(position(el('.xEntry'))).toEqual({ left: '123px', top: '117px' });
    expect(store.dispatch).toHaveBeenCalledTimes(1);

    const [action] = dispatchedActions();
    expect(action).toEqual(jasmine.any(UpdateSectionEntriesPositionAction));
    expect(action.site).toBe('0');
    expect(action.section).toBe('works');
    expect(action.positions).toEqual([{ id: '1', value: '123,117' }]);
  });

  it('snaps to the grid step', () => {
    gridStep = '10';
    setUp(ENTRY_HTML('1', 100, 100));

    drag(el('.xHandle'), 23, 17);

    expect(position(el('.xEntry'))).toEqual({ left: '120px', top: '110px' });
  });

  it('keeps entries inside the page, leaving room for their toolbar', () => {
    setUp(ENTRY_HTML('1', 30, 30));

    drag(el('.xHandle'), -100, -100);

    expect(position(el('.xEntry'))).toEqual({ left: '0px', top: '20px' });
  });

  it('shows the coordinates badge while dragging', () => {
    setUp(ENTRY_HTML('1', 100, 100));
    const handle = el('.xHandle');

    pointer('pointerdown', handle, 10, 10);
    pointer('pointermove', handle, 15, 20);

    expect(el('#xCoords').textContent).toBe('X:105 Y:110');
    expect(el('.xEntry').classList).toContain('xEditing');

    pointer('pointerup', handle, 15, 20);

    expect(el('#xCoords')).toBeNull();
    expect(el('.xEntry').classList).not.toContain('xEditing');
  });

  it('moves and saves all entries together on Shift + drag', () => {
    setUp(
      `<div id="pageEntries">${ENTRY_HTML('1', 100, 100)}${ENTRY_HTML('2', 300, 50)}${ENTRY_HTML('3', 10, 400)}</div>`,
    );

    drag(el('.xHandle'), 5, 10, { shiftKey: true });

    const entries = Array.from(doc.querySelectorAll<HTMLElement>('.xEntry'));
    expect(entries.map(position)).toEqual([
      { left: '105px', top: '110px' },
      { left: '305px', top: '60px' },
      { left: '15px', top: '410px' },
    ]);
    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(dispatchedActions().length).toBe(1);
    expect(dispatchedActions()[0].positions).toEqual([
      { id: '1', value: '105,110' },
      { id: '2', value: '305,60' },
      { id: '3', value: '15,410' },
    ]);
  });

  it('stops a Shift + drag group when any entry reaches the page edge', () => {
    setUp(
      `<div id="pageEntries">${ENTRY_HTML('1', 200, 200)}${ENTRY_HTML('2', 50, 300)}${ENTRY_HTML('3', 400, 60)}</div>`,
    );

    drag(el('.xHandle'), -500, -500, { shiftKey: true });

    const entries = Array.from(doc.querySelectorAll<HTMLElement>('.xEntry'));
    // Entry 2 is the left-most (50) and entry 3 the top-most (60), so the
    // whole group moves by -50 / -40 and keeps its spacing.
    expect(entries.map(position)).toEqual([
      { left: '150px', top: '160px' },
      { left: '0px', top: '260px' },
      { left: '350px', top: '20px' },
    ]);
    expect(dispatchedActions()[0].positions).toEqual([
      { id: '1', value: '150,160' },
      { id: '2', value: '0,260' },
      { id: '3', value: '350,20' },
    ]);
  });

  it('pulls entries that were already off the page onto its edge', () => {
    setUp(
      `<div id="pageEntries">${ENTRY_HTML('1', 200, 200)}${ENTRY_HTML('2', -40, 10)}</div>`,
    );

    drag(el('.xHandle'), 15, 5, { shiftKey: true });

    const entries = Array.from(doc.querySelectorAll<HTMLElement>('.xEntry'));
    expect(entries.map(position)).toEqual([
      { left: '215px', top: '205px' },
      { left: '0px', top: '20px' },
    ]);
    expect(dispatchedActions()[0].positions).toEqual([
      { id: '1', value: '215,205' },
      { id: '2', value: '0,20' },
    ]);
  });

  it('moves only the dragged entry without Shift', () => {
    setUp(
      `<div id="pageEntries">${ENTRY_HTML('1', 100, 100)}${ENTRY_HTML('2', 300, 50)}</div>`,
    );

    drag(el('.xHandle'), 5, 10);

    expect(position(doc.querySelectorAll<HTMLElement>('.xEntry')[1])).toEqual(
      { left: '300px', top: '50px' },
    );
    expect(dispatchedActions()[0].positions.length).toBe(1);
  });

  it('adds handles to draggables without one and saves settings paths', () => {
    setUp(
      `<h1 class="mess xNgEditableDragXY" data-path="0/settings/siteTexts/siteHeadingXY"
        style="left:200px;top:40px">Heading</h1>`,
    );
    const handle = el('h1 > .xHandle');

    expect(handle).not.toBeNull();

    drag(handle, 10, 10);

    const [action] = dispatchedActions();
    expect(action).toEqual(jasmine.any(UpdateSiteSettingsFromSyncAction));
    expect(action.path).toBe('0/settings/siteTexts/siteHeadingXY');
    expect(action.payload).toBe('210,50');
  });

  it('saves section menu paths', () => {
    setUp(
      `<ul><li class="mess xNgEditableDragXY" data-path="0/section/2/positionXY"
        style="left:50px;top:50px">Works</li></ul>`,
    );

    drag(el('li > .xHandle'), 10, 0);

    const [action] = dispatchedActions();
    expect(action).toEqual(jasmine.any(UpdateSiteSectionFromSyncAction));
    expect(action.payload).toBe('60,50');
  });

  it('shifts a handle right when its element is near the left edge', () => {
    setUp(
      `<h1 class="mess xNgEditableDragXY" data-path="0/settings/siteTexts/siteHeadingXY"
        style="left:5px;top:40px">Heading</h1>`,
    );

    expect(el('h1 > .xHandle').style.left).toBe('15px');
  });

  it('saves a centered fixed element relative to its container', () => {
    setUp(
      `<div id="contentContainer" class="xCentered" style="width:600px;margin:0 auto">
        <h1 class="mess xNgEditableDragXY xFixed" data-path="0/settings/siteTexts/siteHeadingXY"
          style="left:300px;top:40px">Heading</h1>
      </div>`,
    );

    drag(el('h1 > .xHandle'), 10, 0);

    // 310px in the viewport minus the (1000 - 600) / 2 centering offset.
    expect(dispatchedActions()[0].payload).toBe('110,40');
  });

  it('does not save a click without movement', () => {
    setUp(ENTRY_HTML('1', 100, 100));
    const handle = el('.xHandle');

    pointer('pointerdown', handle, 10, 10);
    pointer('pointerup', handle, 10, 10);

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('prevents handle clicks from following the link', () => {
    setUp(ENTRY_HTML('1', 100, 100));
    const click = new MouseEvent('click', { bubbles: true, cancelable: true });

    el('.xHandle').dispatchEvent(click);

    expect(click.defaultPrevented).toBeTrue();
  });

  it('restores the positions when saving fails', () => {
    store.dispatch.and.returnValue(throwError(() => new Error('failed')));
    setUp(ENTRY_HTML('1', 100, 100));

    drag(el('.xHandle'), 23, 17);

    expect(position(el('.xEntry'))).toEqual({ left: '100px', top: '100px' });
    expect(el('.xEntry').classList).not.toContain('xSaving');
  });

  it('drags the "create new entry" button freely without saving', () => {
    gridStep = '10';
    setUp(
      '<a class="xCreateNewEntry mess" style="right:50px;top:30px;width:100px"><div class="xHandle"></div></a>',
    );

    drag(el('.xHandle'), 3, 4);

    expect(el('.xCreateNewEntry').style.right).toBe('auto');
    expect(el('.xCreateNewEntry').style.top).toBe('34px');
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  describe('when the dragged element is replaced mid-drag', () => {
    beforeEach(() => {
      setUp(`<div id="pageEntries">${ENTRY_HTML('1', 100, 100)}</div>`);
      pointer('pointerdown', el('.xHandle'), 10, 10);
      pointer('pointermove', el('.xHandle'), 30, 30);
      // A rerender swaps in a fresh copy of the entries.
      el('#pageEntries').innerHTML = ENTRY_HTML('1', 100, 100);
    });

    it('saves nothing for the detached element on pointerup', () => {
      pointer('pointerup', doc.body, 30, 30);

      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('ends the drag when the pointer capture is lost', () => {
      pointer('lostpointercapture', doc.body, 30, 30);
      drag(el('.xHandle'), 5, 5);

      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(dispatchedActions()[0].positions).toEqual([
        { id: '1', value: '105,105' },
      ]);
    });

    it('lets a new drag start even without pointerup or lost capture', () => {
      drag(el('.xHandle'), 5, 5);

      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(dispatchedActions()[0].positions).toEqual([
        { id: '1', value: '105,105' },
      ]);
    });
  });

  it('keeps updating handles after attaching to a reloaded iframe', async () => {
    setUp('');
    // Schedules a handles update on the first window, which never runs
    // once that iframe is gone.
    doc.body.appendChild(doc.createElement('div'));
    iframe.remove();

    iframe = createIframe();
    doc = iframe.contentDocument;
    service.attach(iframe);
    doc.body.innerHTML =
      '<h1 class="mess xNgEditableDragXY" style="left:100px;top:40px">Heading</h1>';
    await nextFrame(iframe.contentWindow);
    await nextFrame(iframe.contentWindow);

    expect(el('h1 > .xHandle')).not.toBeNull();
  });

  it('hides the guide lines when the pointer leaves the handle after a drop', () => {
    setUp(ENTRY_HTML('1', 100, 100));
    const handle = el('.xHandle');

    handle.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    pointer('pointerdown', handle, 10, 10);
    pointer('pointermove', handle, 15, 15);
    // Leaving the handle during the drag keeps the lines visible.
    handle.dispatchEvent(
      new MouseEvent('mouseout', { bubbles: true, relatedTarget: doc.body }),
    );
    expect(el('#xGuideLineX')).not.toBeNull();

    const rect = handle.getBoundingClientRect();
    pointer(
      'pointerup',
      handle,
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
    );
    expect(el('#xGuideLineX')).not.toBeNull();

    handle.dispatchEvent(
      new MouseEvent('mouseout', { bubbles: true, relatedTarget: doc.body }),
    );
    expect(el('#xGuideLineX')).toBeNull();
    expect(el('#xGuideLineY')).toBeNull();
  });

  it('ignores elements that are not draggable', () => {
    setUp('<div class="xEntry" style="position:absolute"><a class="xEntryMove xHandle">move</a></div>');

    drag(el('.xHandle'), 10, 10);

    expect(el('.xEntry').style.left).toBe('');
    expect(store.dispatch).not.toHaveBeenCalled();
  });
});
