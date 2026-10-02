import { Store } from '@ngxs/store';
import { Subject, of, throwError } from 'rxjs';

import { SortableService } from './sortable.service';
import { OrderSectionEntriesFromSyncAction } from '../../sites/sections/entries/entries-state/section-entries.actions';
import { OrderSectionTagsFromSyncAction } from '../../sites/sections/tags/section-tags.actions';

interface Point {
  x: number;
  y: number;
}

/**
 * Drives the service with synthetic pointer events against a real
 * same-origin iframe, the way the preview uses it.
 */
describe('SortableService', () => {
  let iframe: HTMLIFrameElement;
  let doc: Document;
  let service: SortableService;
  let store: jasmine.SpyObj<Store>;

  // 50px entries, 100px thumbnails three to a row, 60px tags side by side.
  const STYLES =
    'body{margin:0} ol,ul{margin:0;padding:0;list-style:none}' +
    '.xEntry{height:50px} .portfolioThumbnails{width:300px;display:flow-root}' +
    '.portfolioThumbnail{float:left;width:100px;height:100px}' +
    '.subMenu{display:flex} .subMenu li{width:60px}';

  const ENTRIES_HTML = (ids: string[], classes = '') => `
    <ol class="xEntriesList xSection-works ${classes}">
      ${ids
        .map(
          (id) => `
            <li id="e${id}" class="xEntry xEntryId-${id} xSection-works">
              <a href="#" class="xEntryMove">move</a>
            </li>`,
        )
        .join('')}
    </ol>`;

  const THUMBNAILS_HTML = (ids: string[]) => `
    <div class="portfolioThumbnails">
      ${ids
        .map(
          (id) => `
            <div id="t${id}" class="portfolioThumbnail" data-id="${id}">
              <div class="wrap">
                <div class="xHandle">grab</div>
                <a href="#entry-${id}">entry ${id}</a>
              </div>
            </div>`,
        )
        .join('')}
    </div>`;

  const SUBMENU_HTML = (tags: string[], classes = 'xAllowOrdering') => `
    <ul class="subMenu xSection-works ${classes}">
      ${tags
        .map(
          (tag) => `
            <li id="tag-${tag}" class="xTag-${tag}">
              <a class="handle" href="?section=works&tag=${tag}">${tag}</a>
            </li>`,
        )
        .join('')}
    </ul>`;

  function setUp(bodyHtml: string) {
    doc.body.innerHTML = bodyHtml;
    service.attach(iframe);
  }

  function el(selector: string): HTMLElement {
    return doc.querySelector(selector) as HTMLElement;
  }

  function order(selector: string): string[] {
    return Array.from(el(selector).children)
      .filter((child) => !child.classList.contains('xSortGhost'))
      .map((child) => child.id);
  }

  /**
   * A point inside the element, at the given fractions of its size.
   */
  function at(target: Element, fx = 0.5, fy = 0.5): Point {
    const rect = target.getBoundingClientRect();
    return {
      x: rect.left + rect.width * fx,
      y: rect.top + rect.height * fy,
    };
  }

  function pointer(
    type: string,
    target: Element,
    point: Point,
    init: PointerEventInit = {},
  ) {
    target.dispatchEvent(
      new PointerEvent(type, {
        bubbles: true,
        cancelable: true,
        isPrimary: true,
        pointerId: 1,
        button: 0,
        clientX: point.x,
        clientY: point.y,
        ...init,
      }),
    );
  }

  function drag(handle: Element, to: Point) {
    pointer('pointerdown', handle, at(handle));
    pointer('pointermove', handle, to);
    pointer('pointerup', handle, to);
  }

  /**
   * Clicks the element and tells whether the service prevented its default
   * action. Never lets a link navigate the test iframe.
   */
  function click(target: Element): boolean {
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    let prevented: boolean | null = null;
    // Reached only when the service didn't stop the click.
    const guard = (guarded: Event) => {
      prevented = guarded.defaultPrevented;
      guarded.preventDefault();
    };

    target.addEventListener('click', guard);
    target.dispatchEvent(event);
    target.removeEventListener('click', guard);

    return prevented ?? event.defaultPrevented;
  }

  function dispatchedAction(): any {
    return store.dispatch.calls.mostRecent().args[0];
  }

  function createIframe(): HTMLIFrameElement {
    const frame = document.createElement('iframe');
    frame.style.width = '1000px';
    frame.style.height = '600px';
    document.body.appendChild(frame);
    frame.contentDocument.open();
    frame.contentDocument.write(
      `<!doctype html><html><head><style>${STYLES}</style></head><body></body></html>`,
    );
    frame.contentDocument.close();
    return frame;
  }

  function nextFrame(win: Window): Promise<void> {
    return new Promise((resolve) => win.requestAnimationFrame(() => resolve()));
  }

  /**
   * Finishes the slide and landing animations, and lets their `finished`
   * callbacks run.
   */
  async function settle() {
    doc.getAnimations().forEach((animation) => animation.finish());
    await new Promise((resolve) => setTimeout(resolve));
  }

  function slides(target: Element): Animation[] {
    return target
      .getAnimations()
      .filter((animation) => animation.id === 'xSortSlide');
  }

  beforeEach(() => {
    iframe = createIframe();
    doc = iframe.contentDocument;

    store = jasmine.createSpyObj<Store>('Store', ['dispatch']);
    store.dispatch.and.returnValue(of(null));
    service = new SortableService(store);
  });

  afterEach(() => iframe.remove());

  describe('entries', () => {
    beforeEach(() => setUp(ENTRIES_HTML(['1', '2', '3'])));

    it('moves an entry before the entry under the pointer and saves it', () => {
      drag(el('#e3 .xEntryMove'), at(el('#e1'), 0.5, 0.2));

      expect(order('.xEntriesList')).toEqual(['e3', 'e1', 'e2']);
      expect(store.dispatch).toHaveBeenCalledTimes(1);

      const action = dispatchedAction();
      expect(action).toEqual(jasmine.any(OrderSectionEntriesFromSyncAction));
      expect(action.site).toBe('');
      expect(action.section).toBe('works');
      expect(action.entryId).toBe('3');
      expect(action.value).toBe('1');
    });

    it('moves an entry after the entry under the pointer, last saving no next entry', () => {
      drag(el('#e1 .xEntryMove'), at(el('#e3'), 0.5, 0.8));

      expect(order('.xEntriesList')).toEqual(['e2', 'e3', 'e1']);
      expect(dispatchedAction().entryId).toBe('1');
      expect(dispatchedAction().value).toBeNull();
    });

    it('moves an entry to the end when dragged past the list', () => {
      drag(el('#e1 .xEntryMove'), { x: 10, y: 500 });

      expect(order('.xEntriesList')).toEqual(['e2', 'e3', 'e1']);
    });

    it('marks the entry and the list until the preview has landed', async () => {
      const handle = el('#e1 .xEntryMove');

      pointer('pointerdown', handle, at(handle));
      pointer('pointermove', handle, at(el('#e2')));

      expect(el('#e1').classList).toContain('xSortDragging');
      expect(el('.xEntriesList').classList).toContain('xSortActive');
      expect(doc.documentElement.classList).toContain('xSorting');

      pointer('pointerup', handle, at(el('#e2')));

      expect(doc.documentElement.classList).not.toContain('xSorting');
      expect(el('#e1').classList).toContain('xSortDragging');

      await settle();

      expect(el('#e1').classList).not.toContain('xSortDragging');
      expect(el('.xEntriesList').classList).not.toContain('xSortActive');
    });

    it('shows a preview of the entry, grabbed where the pointer is', () => {
      const handle = el('#e1 .xEntryMove');
      const start = at(handle);

      pointer('pointerdown', handle, start);
      pointer('pointermove', handle, { x: start.x + 30, y: start.y + 200 });

      const ghost = el('.xSortGhost');
      const rect = ghost.getBoundingClientRect();

      expect(ghost.textContent).toContain('move');
      expect(ghost.classList).not.toContain('xSortDragging');
      // The entry was at the top left: the preview moved with the pointer.
      expect(rect.left).toBeCloseTo(30, 0);
      expect(rect.top).toBeCloseTo(200, 0);
      expect(rect.height).toBeCloseTo(50, 0);
      expect(ghost.classList).not.toContain('xSortGhostClipped');
    });

    it('clips the preview of a tall entry', () => {
      el('#e1').style.height = '1000px';
      const handle = el('#e1 .xEntryMove');
      const start = at(handle);

      pointer('pointerdown', handle, start);
      pointer('pointermove', handle, { x: start.x, y: start.y + 20 });

      const ghost = el('.xSortGhost');
      expect(ghost.getBoundingClientRect().height).toBeCloseTo(240, 0);
      expect(ghost.classList).toContain('xSortGhostClipped');
    });

    it('leaves ids, data paths and embeds out of the preview', () => {
      el('#e1').insertAdjacentHTML(
        'beforeend',
        '<div id="title" data-path="0/entry/works/1/content/title">Title</div>' +
          '<iframe></iframe>',
      );
      const handle = el('#e1 .xEntryMove');
      const start = at(handle);

      pointer('pointerdown', handle, start);
      pointer('pointermove', handle, { x: start.x, y: start.y + 20 });

      const ghost = el('.xSortGhost');
      expect(ghost.textContent).toContain('Title');
      expect(ghost.id).toBe('');
      expect(ghost.querySelector('[id], [data-path], iframe')).toBeNull();
      expect(doc.querySelectorAll('[data-path]').length).toBe(1);
    });

    it('slides the entries making way to their new places', () => {
      const handle = el('#e1 .xEntryMove');

      pointer('pointerdown', handle, at(handle));
      pointer('pointermove', handle, at(el('#e2'), 0.5, 0.8));

      expect(order('.xEntriesList')).toEqual(['e2', 'e1', 'e3']);
      expect(slides(el('#e1')).length).toBe(1);
      expect(slides(el('#e2')).length).toBe(1);
      expect(slides(el('#e3')).length).toBe(0);
    });

    it('sorts again once a slide is over', async () => {
      const handle = el('#e1 .xEntryMove');

      pointer('pointerdown', handle, at(handle));
      pointer('pointermove', handle, at(el('#e2'), 0.5, 0.8));
      pointer('pointermove', handle, at(el('#e3'), 0.5, 0.8));

      // Still sliding into its first place.
      expect(order('.xEntriesList')).toEqual(['e2', 'e1', 'e3']);

      await settle();

      expect(order('.xEntriesList')).toEqual(['e2', 'e3', 'e1']);
    });

    it('lands the preview on the dropped entry, then removes it', async () => {
      drag(el('#e1 .xEntryMove'), at(el('#e3'), 0.5, 0.8));

      const ghost = el('.xSortGhost');
      expect(ghost.getAnimations().length).toBe(1);
      // Moved last, but still before the preview: `nth-child` rules see it
      // at its real index.
      expect(el('.xEntriesList').lastElementChild).toBe(ghost);
      expect(ghost.previousElementSibling).toBe(el('#e1'));

      await settle();

      expect(ghost.isConnected).toBeFalse();
      expect(order('.xEntriesList')).toEqual(['e2', 'e3', 'e1']);
    });

    it('drops without animations when reduced motion is preferred', () => {
      spyOn(iframe.contentWindow, 'matchMedia').and.returnValue({
        matches: true,
      } as MediaQueryList);

      drag(el('#e1 .xEntryMove'), at(el('#e3'), 0.5, 0.8));

      expect(order('.xEntriesList')).toEqual(['e2', 'e3', 'e1']);
      expect(doc.getAnimations().length).toBe(0);
      expect(el('.xSortGhost')).toBeNull();
      expect(el('#e1').classList).not.toContain('xSortDragging');
    });

    it('does not save an entry dropped where it started', () => {
      const handle = el('#e1 .xEntryMove');
      const start = at(handle);

      drag(handle, { x: start.x + 10, y: start.y + 10 });

      expect(order('.xEntriesList')).toEqual(['e1', 'e2', 'e3']);
      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('does not start a drag on a click without movement', () => {
      const handle = el('#e1 .xEntryMove');

      pointer('pointerdown', handle, at(handle));
      pointer('pointerup', handle, at(handle));

      expect(el('#e1').classList).not.toContain('xSortDragging');
      expect(el('.xSortGhost')).toBeNull();
      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('prevents the move button from following its link', () => {
      expect(click(el('#e1 .xEntryMove'))).toBeTrue();
    });

    it('puts the entry back when the drag is canceled', async () => {
      const handle = el('#e1 .xEntryMove');

      pointer('pointerdown', handle, at(handle));
      pointer('pointermove', handle, at(el('#e3'), 0.5, 0.8));
      expect(order('.xEntriesList')).toEqual(['e2', 'e3', 'e1']);

      pointer('pointercancel', handle, at(el('#e3')));

      expect(order('.xEntriesList')).toEqual(['e1', 'e2', 'e3']);
      expect(store.dispatch).not.toHaveBeenCalled();

      await settle();

      expect(el('.xSortGhost')).toBeNull();
      expect(el('#e1').classList).not.toContain('xSortDragging');
    });

    it('puts the entry back when the list loses the pointer capture', () => {
      const handle = el('#e1 .xEntryMove');

      pointer('pointerdown', handle, at(handle));
      pointer('pointermove', handle, at(el('#e3'), 0.5, 0.8));
      pointer('lostpointercapture', el('.xEntriesList'), at(el('#e3')));

      expect(order('.xEntriesList')).toEqual(['e1', 'e2', 'e3']);
      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('keeps dragging when the handle loses its (touch) capture to the list', () => {
      const handle = el('#e1 .xEntryMove');

      pointer('pointerdown', handle, at(handle));
      pointer('pointermove', handle, at(el('#e2'), 0.5, 0.8));
      // A touch is captured by the handle until the list takes it over.
      pointer('lostpointercapture', handle, at(el('#e2')));

      expect(el('#e1').classList).toContain('xSortDragging');

      pointer('pointerup', handle, at(el('#e2'), 0.5, 0.8));

      expect(order('.xEntriesList')).toEqual(['e2', 'e1', 'e3']);
      expect(store.dispatch).toHaveBeenCalledTimes(1);
    });

    it('puts the entry back when saving fails', () => {
      store.dispatch.and.returnValue(throwError(() => new Error('failed')));

      drag(el('#e1 .xEntryMove'), at(el('#e3'), 0.5, 0.8));

      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(order('.xEntriesList')).toEqual(['e1', 'e2', 'e3']);
    });

    it('ends the drag when the replaced list loses the pointer capture', () => {
      const handle = el('#e1 .xEntryMove');

      pointer('pointerdown', handle, at(handle));
      pointer('pointermove', handle, at(el('#e3'), 0.5, 0.8));
      el('.xEntriesList').outerHTML = ENTRIES_HTML(['1', '2', '3']);
      // Fired at the document once the capturing list is gone.
      doc.dispatchEvent(
        new PointerEvent('lostpointercapture', { bubbles: true, pointerId: 1 }),
      );

      expect(doc.documentElement.classList).not.toContain('xSorting');
      expect(store.dispatch).not.toHaveBeenCalled();
    });

    describe('when the entries are replaced mid-drag', () => {
      beforeEach(() => {
        const handle = el('#e1 .xEntryMove');

        pointer('pointerdown', handle, at(handle));
        pointer('pointermove', handle, at(el('#e3'), 0.5, 0.8));
        // A rerender swaps in a fresh copy of the entries.
        el('.xEntriesList').outerHTML = ENTRIES_HTML(['1', '2', '3']);
      });

      it('saves nothing on pointerup', () => {
        pointer('pointerup', doc.body, { x: 10, y: 140 });

        expect(store.dispatch).not.toHaveBeenCalled();
      });

      it('lets a new drag start even without pointerup', () => {
        drag(el('#e1 .xEntryMove'), at(el('#e2'), 0.5, 0.8));

        expect(order('.xEntriesList')).toEqual(['e2', 'e1', 'e3']);
        expect(store.dispatch).toHaveBeenCalledTimes(1);
      });
    });

    it('binds a document only once', () => {
      service.attach(iframe);

      drag(el('#e1 .xEntryMove'), at(el('#e2'), 0.5, 0.8));

      expect(store.dispatch).toHaveBeenCalledTimes(1);
    });

    it('keeps sorting after attaching to a reloaded iframe', () => {
      iframe.remove();
      iframe = createIframe();
      doc = iframe.contentDocument;
      setUp(ENTRIES_HTML(['1', '2', '3']));

      drag(el('#e1 .xEntryMove'), at(el('#e2'), 0.5, 0.8));

      expect(order('.xEntriesList')).toEqual(['e2', 'e1', 'e3']);
      expect(store.dispatch).toHaveBeenCalledTimes(1);
    });
  });

  it('does not sort entries of a list without ordering', () => {
    setUp(ENTRIES_HTML(['1', '2', '3'], 'xNoEntryOrdering'));

    drag(el('#e1 .xEntryMove'), at(el('#e3'), 0.5, 0.8));

    expect(order('.xEntriesList')).toEqual(['e1', 'e2', 'e3']);
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('scrolls the page while dragging near its bottom edge', async () => {
    setUp(
      ENTRIES_HTML(Array.from({ length: 30 }, (_, index) => `${index + 1}`)),
    );
    const win = iframe.contentWindow;
    const handle = el('#e1 .xEntryMove');

    pointer('pointerdown', handle, at(handle));
    pointer('pointermove', handle, { x: 10, y: 595 });
    await nextFrame(win);
    await nextFrame(win);
    await nextFrame(win);

    expect(win.scrollY).toBeGreaterThan(0);

    pointer('pointerup', handle, { x: 10, y: 595 });
    const scrolled = win.scrollY;
    await nextFrame(win);
    await nextFrame(win);

    expect(win.scrollY).toBe(scrolled);
  });

  it('sorts to the first entry in view when dragged above the iframe', () => {
    setUp(
      ENTRIES_HTML(Array.from({ length: 30 }, (_, index) => `${index + 1}`)),
    );
    // Entries 11–22 are in view.
    iframe.contentWindow.scrollTo(0, 500);
    const handle = el('#e15 .xEntryMove');

    pointer('pointerdown', handle, at(handle));
    pointer('pointermove', handle, { x: 10, y: -20 });

    const ids = order('.xEntriesList');
    expect(ids.indexOf('e15')).toBe(ids.indexOf('e11') - 1);

    pointer('pointerup', handle, { x: 10, y: -20 });
  });

  it('saves for the site shown in the preview', async () => {
    iframe.remove();
    iframe = document.createElement('iframe');
    iframe.style.width = '1000px';
    iframe.style.height = '600px';
    const loaded = new Promise((resolve) =>
      iframe.addEventListener('load', resolve, { once: true }),
    );
    iframe.src = 'about:blank?site=berlin';
    document.body.appendChild(iframe);
    await loaded;

    doc = iframe.contentDocument;
    doc.head.innerHTML = `<style>${STYLES}</style>`;
    setUp(ENTRIES_HTML(['1', '2']));

    drag(el('#e2 .xEntryMove'), at(el('#e1'), 0.5, 0.2));

    expect(dispatchedAction().site).toBe('berlin');
  });

  describe('portfolio thumbnails', () => {
    it('moves a thumbnail along its row and saves the entry order', () => {
      setUp(THUMBNAILS_HTML(['1', '2', '3', '4', '5']) + ENTRIES_HTML([]));

      drag(el('#t1 .xHandle'), at(el('#t2'), 0.6, 0.5));

      expect(order('.portfolioThumbnails')).toEqual([
        't2',
        't1',
        't3',
        't4',
        't5',
      ]);

      const action = dispatchedAction();
      expect(action).toEqual(jasmine.any(OrderSectionEntriesFromSyncAction));
      expect(action.section).toBe('works');
      expect(action.entryId).toBe('1');
      expect(action.value).toBe('3');
    });

    it('moves a thumbnail to another row', () => {
      setUp(THUMBNAILS_HTML(['1', '2', '3', '4', '5']) + ENTRIES_HTML([]));

      drag(el('#t5 .xHandle'), at(el('#t1'), 0.5, 0.2));

      expect(order('.portfolioThumbnails')).toEqual([
        't5',
        't1',
        't2',
        't3',
        't4',
      ]);
      expect(dispatchedAction().entryId).toBe('5');
      expect(dispatchedAction().value).toBe('1');
    });

    it('does not sort thumbnails when the entries list has no ordering', () => {
      setUp(
        THUMBNAILS_HTML(['1', '2', '3']) + ENTRIES_HTML([], 'xNoEntryOrdering'),
      );

      drag(el('#t1 .xHandle'), at(el('#t2'), 0.6, 0.5));

      expect(order('.portfolioThumbnails')).toEqual(['t1', 't2', 't3']);
      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('submenu tags', () => {
    it('moves a tag by its link and saves the tag order', () => {
      setUp(SUBMENU_HTML(['a', 'b', 'c']));

      drag(el('#tag-a .handle'), at(el('#tag-c'), 0.8, 0.5));

      expect(order('.subMenu')).toEqual(['tag-b', 'tag-c', 'tag-a']);

      const action = dispatchedAction();
      expect(action).toEqual(jasmine.any(OrderSectionTagsFromSyncAction));
      expect(action.site).toBe('');
      expect(action.section).toBe('works');
      expect(action.tag).toBe('a');
      expect(action.value).toBeNull();
    });

    it('marks the submenu as saving until the order is saved', () => {
      const saving = new Subject<void>();
      store.dispatch.and.returnValue(saving);
      setUp(SUBMENU_HTML(['a', 'b', 'c']));

      drag(el('#tag-c .handle'), at(el('#tag-a'), 0.2, 0.5));

      expect(el('.subMenu').classList).toContain('xSaving');

      saving.next();

      expect(el('.subMenu').classList).not.toContain('xSaving');
    });

    it('follows a tag link on a plain click', () => {
      setUp(SUBMENU_HTML(['a', 'b', 'c']));
      const link = el('#tag-a .handle');

      pointer('pointerdown', link, at(link));
      pointer('pointerup', link, at(link));

      expect(click(link)).toBeFalse();
    });

    it('captures the pointer only once a drag starts', () => {
      // A captured pointer's click goes to the capturing list instead of
      // the link, so a plain click must leave the pointer uncaptured.
      const capture = spyOn(
        (iframe.contentWindow as any).Element.prototype,
        'setPointerCapture',
      );
      setUp(SUBMENU_HTML(['a', 'b', 'c']));
      const link = el('#tag-a .handle');
      const start = at(link);

      pointer('pointerdown', link, start);
      pointer('pointermove', link, { x: start.x + 2, y: start.y });

      expect(capture).not.toHaveBeenCalled();

      pointer('pointermove', link, at(el('#tag-b'), 0.8, 0.5));

      expect(capture).toHaveBeenCalledOnceWith(1);
      expect(capture.calls.mostRecent().object).toBe(el('.subMenu'));
    });

    it('does not follow a tag link after dragging it', () => {
      setUp(SUBMENU_HTML(['a', 'b', 'c']));
      const link = el('#tag-a .handle');

      drag(link, at(el('#tag-b'), 0.8, 0.5));

      expect(click(link)).toBeTrue();
      // Only the click right after the drag.
      expect(click(link)).toBeFalse();
    });

    it('does not sort tags of a submenu without ordering', () => {
      setUp(SUBMENU_HTML(['a', 'b', 'c'], ''));

      drag(el('#tag-a .handle'), at(el('#tag-c'), 0.8, 0.5));

      expect(order('.subMenu')).toEqual(['tag-a', 'tag-b', 'tag-c']);
      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });
});
