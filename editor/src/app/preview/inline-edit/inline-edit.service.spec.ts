import { Overlay } from '@angular/cdk/overlay';
import { Store } from '@ngxs/store';

import { InlineEditService } from './inline-edit.service';

/**
 * Covers the single-line field value-transform/side-effect methods in
 * isolation. These are pure or near-pure (plain `HTMLElement` in,
 * string/void out), so a real `Overlay`/`Store` is never exercised — the
 * constructor only stores the references (plus registering window
 * resize/scroll listeners), it never calls into them.
 */
describe('InlineEditService (field value transforms)', () => {
  let service: InlineEditService;

  beforeEach(() => {
    service = new InlineEditService({} as Overlay, {} as Store);
  });

  function elementWithClasses(classes: string[]): HTMLElement {
    const el = document.createElement('div');
    el.className = classes.join(' ');
    return el;
  }

  describe('applyCssUnits', () => {
    it('appends "px" to a pure integer value on an xCSSUnits-1 field', () => {
      const el = elementWithClasses(['xCSSUnits-1']);
      expect((service as any).applyCssUnits(el, '300')).toBe('300px');
    });

    it('leaves "0" as "0" (no "px" appended)', () => {
      const el = elementWithClasses(['xCSSUnits-1']);
      expect((service as any).applyCssUnits(el, '0')).toBe('0');
    });

    it('leaves an empty value untouched', () => {
      const el = elementWithClasses(['xCSSUnits-1']);
      expect((service as any).applyCssUnits(el, '')).toBe('');
    });

    it('collapses a single space before a trailing unit', () => {
      const el = elementWithClasses(['xCSSUnits-1']);
      expect((service as any).applyCssUnits(el, '300 px')).toBe('300px');
      expect((service as any).applyCssUnits(el, '2 em')).toBe('2em');
    });

    it('leaves non-integer values untouched', () => {
      const el = elementWithClasses(['xCSSUnits-1']);
      expect((service as any).applyCssUnits(el, '300px')).toBe('300px');
      expect((service as any).applyCssUnits(el, '12.5')).toBe('12.5');
    });

    it('is a no-op for fields without xCSSUnits-1', () => {
      const el = elementWithClasses(['xNgEditable']);
      expect((service as any).applyCssUnits(el, '300')).toBe('300');
    });
  });

  describe('applyPriceParsing', () => {
    it('parses to a bare float string on xFormatModifier-toPrice fields', () => {
      const el = elementWithClasses(['xFormatModifier-toPrice']);
      expect((service as any).applyPriceParsing(el, '19.990')).toBe('19.99');
    });

    it('saves a zero/unparseable/empty value as empty', () => {
      const el = elementWithClasses(['xFormatModifier-toPrice']);
      expect((service as any).applyPriceParsing(el, '')).toBe('');
      expect((service as any).applyPriceParsing(el, '0')).toBe('');
      expect((service as any).applyPriceParsing(el, 'abc')).toBe('');
    });

    it('is a no-op for fields without xFormatModifier-toPrice', () => {
      const el = elementWithClasses(['xNgEditable']);
      expect((service as any).applyPriceParsing(el, '19.990')).toBe('19.990');
    });
  });

  describe('formatTags', () => {
    it('trims, filters empty entries, and dedupes', () => {
      const result = (service as any).formatTags('a, b,,  b ,c');
      expect(result).toEqual({ display: 'a / b / c', real: 'a, b, c' });
    });

    it('handles a single tag', () => {
      expect((service as any).formatTags('solo')).toEqual({
        display: 'solo',
        real: 'solo',
      });
    });
  });

  describe('syncTitle', () => {
    it('sets title on data-ng-edit-via-title fields', () => {
      const el = document.createElement('div');
      el.dataset['ngEditViaTitle'] = '1';

      (service as any).syncTitle(el, '19.99');

      expect(el.title).toBe('19.99');
    });

    it('is a no-op without data-ng-edit-via-title', () => {
      const el = document.createElement('div');
      el.title = 'unchanged';

      (service as any).syncTitle(el, '19.99');

      expect(el.title).toBe('unchanged');
    });
  });

  describe('readFieldValue', () => {
    it('reads from title on single-line data-ng-edit-via-title fields', () => {
      const el = document.createElement('div');
      el.dataset['ngEditViaTitle'] = '1';
      el.title = '19.99';
      el.textContent = '$19.99';

      expect((service as any).readFieldValue(el, false)).toBe('19.99');
    });

    it('reads from textContent when data-ng-edit-via-title is absent', () => {
      const el = document.createElement('div');
      el.textContent = 'plain text';

      expect((service as any).readFieldValue(el, false)).toBe('plain text');
    });

    it('ignores data-ng-edit-via-title for multiline fields', () => {
      const el = document.createElement('div');
      el.dataset['ngEditViaTitle'] = '1';
      el.title = 'ignored';
      el.innerHTML = 'line one<br />line two';

      expect((service as any).readFieldValue(el, true)).toBe(
        'line one\nline two',
      );
    });
  });
});
