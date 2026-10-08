import { fakeAsync, tick } from '@angular/core/testing';
import { Store } from '@ngxs/store';
import { of } from 'rxjs';

import { PreviewComponent } from './preview.component';

/**
 * Covers `waitFullLoad`, which decides when a loaded preview document is
 * ready for the editor services to attach to. Only the store's `isSetup`
 * selection is used, so every other dependency is an empty stub.
 */
describe('PreviewComponent (waitFullLoad)', () => {
  const EDITOR_URL = 'https://example.com/engine/editor/?section=works';

  let component: PreviewComponent;

  beforeEach(() => {
    const store = { select: () => of(false) } as unknown as Store;
    component = new PreviewComponent(
      {} as any,
      store,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
    );
  });

  function fakeDocument(href: string, bodyClass: string | null): Document {
    return {
      location: { href },
      body: bodyClass === null ? null : { className: bodyClass },
    } as unknown as Document;
  }

  function fakeIframe(doc: Document | null) {
    return { contentDocument: doc } as { contentDocument: Document | null };
  }

  function watch(iframe: { contentDocument: Document | null }) {
    const result = {
      emitted: [] as unknown[],
      completed: false,
      error: undefined as unknown,
    };

    (component as any).waitFullLoad(iframe).subscribe({
      next: (value: unknown) => result.emitted.push(value),
      error: (error: unknown) => (result.error = error),
      complete: () => (result.completed = true),
    });

    return result;
  }

  it('emits the iframe once the body has Berta classes', fakeAsync(() => {
    const iframe = fakeIframe(fakeDocument(EDITOR_URL, 'xContent-works'));
    const result = watch(iframe);

    tick(100);

    expect(result.emitted).toEqual([iframe]);
    expect(result.completed).toBeTrue();
  }));

  it('emits right away for the login page', fakeAsync(() => {
    const iframe = fakeIframe(
      fakeDocument('https://example.com/engine/', null),
    );
    const result = watch(iframe);

    tick(100);

    expect(result.emitted).toEqual([iframe]);
  }));

  it('keeps waiting while the document has no body yet', fakeAsync(() => {
    const doc = fakeDocument(EDITOR_URL, null);
    const iframe = fakeIframe(doc);
    const result = watch(iframe);

    tick(500);

    expect(result.emitted).toEqual([]);
    expect(result.completed).toBeFalse();

    (doc as any).body = { className: 'xSectionType-default' };
    tick(100);

    expect(result.emitted).toEqual([iframe]);
  }));

  it('errors once the body never appears', fakeAsync(() => {
    const result = watch(fakeIframe(fakeDocument(EDITOR_URL, null)));

    tick(12000);

    expect(result.emitted).toEqual([]);
    expect(result.error).toBeDefined();
  }));

  it('completes without emitting once a newer navigation replaces the document', fakeAsync(() => {
    const iframe = fakeIframe(fakeDocument('about:blank', ''));
    const result = watch(iframe);

    tick(100);
    expect(result.completed).toBeFalse();

    // A freshly committed document: nothing parsed yet.
    iframe.contentDocument = fakeDocument(EDITOR_URL, null);
    tick(100);

    expect(result.emitted).toEqual([]);
    expect(result.completed).toBeTrue();

    // Even once the new document is ready, it's left to its own `load`.
    (iframe.contentDocument as any).body = { className: 'xContent-works' };
    tick(500);

    expect(result.emitted).toEqual([]);
  }));
});
