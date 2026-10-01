import {
  ENTRY_MIN_TOP,
  centeringOffset,
  clampGroupDelta,
  clampPosition,
  normalizeGridStep,
  snapToGrid,
  toSavedValue,
} from './drag-position.math';

describe('drag-position math', () => {
  describe('normalizeGridStep', () => {
    it('parses positive integers', () => {
      expect(normalizeGridStep(10)).toBe(10);
      expect(normalizeGridStep('25')).toBe(25);
    });

    it('falls back to 1 for missing, invalid or < 1 values', () => {
      expect(normalizeGridStep(undefined)).toBe(1);
      expect(normalizeGridStep('')).toBe(1);
      expect(normalizeGridStep('abc')).toBe(1);
      expect(normalizeGridStep(0)).toBe(1);
      expect(normalizeGridStep(-5)).toBe(1);
    });
  });

  describe('snapToGrid', () => {
    it('rounds down to the grid', () => {
      expect(snapToGrid(123, 10)).toBe(120);
      expect(snapToGrid(129, 10)).toBe(120);
      expect(snapToGrid(130, 10)).toBe(130);
    });

    it('is a no-op for a step of 1', () => {
      expect(snapToGrid(123, 1)).toBe(123);
    });
  });

  describe('clampPosition', () => {
    it('keeps elements inside the top/left page edges', () => {
      expect(clampPosition({ left: -10, top: -10 }, false)).toEqual({
        left: 0,
        top: 0,
      });
    });

    it('keeps room above entries for their toolbar', () => {
      expect(clampPosition({ left: 5, top: 3 }, true)).toEqual({
        left: 5,
        top: ENTRY_MIN_TOP,
      });
    });

    it('leaves in-bounds positions untouched', () => {
      expect(clampPosition({ left: 50, top: 60 }, true)).toEqual({
        left: 50,
        top: 60,
      });
    });
  });

  describe('clampGroupDelta', () => {
    const starts = [
      { left: 100, top: 100 },
      { left: 30, top: 200 },
      { left: 300, top: 50 },
    ];

    it('passes an in-bounds move through unchanged', () => {
      expect(clampGroupDelta({ left: -20, top: -20 }, starts, true)).toEqual({
        left: -20,
        top: -20,
      });
    });

    it('stops the group when its outermost member reaches the edge', () => {
      expect(clampGroupDelta({ left: -500, top: -500 }, starts, true)).toEqual(
        { left: -30, top: -30 },
      );
      expect(clampGroupDelta({ left: -500, top: -500 }, starts, false)).toEqual(
        { left: -30, top: -50 },
      );
    });

    it('never limits moves away from the edges', () => {
      expect(clampGroupDelta({ left: 500, top: 500 }, starts, true)).toEqual({
        left: 500,
        top: 500,
      });
    });

    it('is not limited by members already past the edge', () => {
      const withOutside = [...starts, { left: -40, top: 10 }];

      expect(
        clampGroupDelta({ left: -10, top: -10 }, withOutside, true),
      ).toEqual({ left: -10, top: -10 });
      expect(
        clampGroupDelta({ left: -500, top: -500 }, withOutside, true),
      ).toEqual({ left: -30, top: -30 });
    });
  });

  describe('centeringOffset', () => {
    function container(classes: string[], width: number): HTMLElement {
      const el = document.createElement('div');
      el.className = classes.join(' ');
      spyOn(el, 'getBoundingClientRect').and.returnValue({ width } as DOMRect);
      return el;
    }

    it('is half the space around a centered container', () => {
      const win = { innerWidth: 1000 } as Window;
      expect(centeringOffset(win, container(['xCentered'], 600))).toBe(200);
    });

    it('is 0 without a centered container', () => {
      const win = { innerWidth: 1000 } as Window;
      expect(centeringOffset(win, container([], 600))).toBe(0);
      expect(centeringOffset(win, null)).toBe(0);
    });
  });

  describe('toSavedValue', () => {
    it('formats "left,top"', () => {
      expect(toSavedValue({ left: 10, top: 20 }, 200, false)).toBe('10,20');
    });

    it('removes the centering offset from fixed elements', () => {
      expect(toSavedValue({ left: 310, top: 20 }, 200, true)).toBe('110,20');
    });

    it('rounds fractional offsets', () => {
      expect(toSavedValue({ left: 310, top: 20 }, 199.5, true)).toBe('111,20');
    });
  });
});
