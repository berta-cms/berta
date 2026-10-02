import {
  AUTO_SCROLL_EDGE,
  Box,
  autoScrollStep,
  clampPoint,
  insertPosition,
  intersectBox,
} from './sortable.math';

function box(left: number, top: number, width: number, height: number): Box {
  return { left, top, right: left + width, bottom: top + height };
}

describe('sortable math', () => {
  describe('insertPosition', () => {
    describe('in a list (items on different rows)', () => {
      const dragged = box(0, 0, 200, 50);
      const target = box(0, 50, 200, 100);

      it('goes before the target above its vertical middle', () => {
        expect(insertPosition(target, dragged, { x: 10, y: 99 })).toBe(
          'before',
        );
      });

      it('goes after the target below its vertical middle', () => {
        expect(insertPosition(target, dragged, { x: 10, y: 101 })).toBe(
          'after',
        );
      });

      it('ignores the horizontal position', () => {
        expect(insertPosition(target, dragged, { x: 199, y: 60 })).toBe(
          'before',
        );
      });

      it('treats items that only touch as different rows', () => {
        expect(
          insertPosition(box(0, 50, 200, 100), box(0, 0, 200, 50), {
            x: 190,
            y: 60,
          }),
        ).toBe('before');
      });
    });

    describe('in a grid row (items side by side)', () => {
      const dragged = box(0, 0, 100, 100);
      const target = box(100, 0, 100, 100);

      it('goes before the target left of its horizontal middle', () => {
        expect(insertPosition(target, dragged, { x: 149, y: 90 })).toBe(
          'before',
        );
      });

      it('goes after the target right of its horizontal middle', () => {
        expect(insertPosition(target, dragged, { x: 151, y: 10 })).toBe(
          'after',
        );
      });

      it('compares vertically with a target on the next row', () => {
        const nextRow = box(0, 100, 100, 100);

        expect(insertPosition(nextRow, dragged, { x: 90, y: 140 })).toBe(
          'before',
        );
        expect(insertPosition(nextRow, dragged, { x: 10, y: 160 })).toBe(
          'after',
        );
      });
    });

    it('stays put after moving a short item past a tall one', () => {
      // A 50px item dragged below the middle of a 500px one goes after it…
      const short = box(0, 0, 200, 50);
      const tall = box(0, 50, 200, 500);
      const pointer = { x: 10, y: 301 };
      expect(insertPosition(tall, short, pointer)).toBe('after');

      // …which moves the tall item up by 50px: the pointer is still below
      // its middle, so the short item stays after it.
      const tallMoved = box(0, 0, 200, 500);
      const shortMoved = box(0, 500, 200, 50);
      expect(insertPosition(tallMoved, shortMoved, pointer)).toBe('after');
    });
  });

  describe('intersectBox', () => {
    it('is the part both boxes cover', () => {
      expect(
        intersectBox(box(0, -500, 300, 1500), box(0, 0, 1000, 600)),
      ).toEqual(box(0, 0, 300, 600));
    });

    it('is null for boxes that do not overlap', () => {
      expect(
        intersectBox(box(0, 0, 100, 100), box(0, 100, 100, 100)),
      ).toBeNull();
      expect(
        intersectBox(box(0, 0, 100, 100), box(200, 0, 100, 100)),
      ).toBeNull();
    });
  });

  describe('clampPoint', () => {
    const list = box(100, 100, 200, 300);

    it('keeps points inside the box as they are', () => {
      expect(clampPoint({ x: 150, y: 200 }, list)).toEqual({ x: 150, y: 200 });
    });

    it('moves points outside the box just inside its edges', () => {
      expect(clampPoint({ x: 0, y: 0 }, list)).toEqual({ x: 101, y: 101 });
      expect(clampPoint({ x: 1000, y: 1000 }, list)).toEqual({
        x: 299,
        y: 399,
      });
    });
  });

  describe('autoScrollStep', () => {
    const viewportHeight = 600;

    it('does not scroll away from the edges', () => {
      expect(autoScrollStep(AUTO_SCROLL_EDGE, viewportHeight)).toBe(0);
      expect(autoScrollStep(300, viewportHeight)).toBe(0);
      expect(
        autoScrollStep(viewportHeight - AUTO_SCROLL_EDGE, viewportHeight),
      ).toBe(0);
    });

    it('scrolls up near the top and down near the bottom', () => {
      expect(autoScrollStep(30, viewportHeight)).toBeLessThan(0);
      expect(autoScrollStep(570, viewportHeight)).toBeGreaterThan(0);
    });

    it('scrolls faster deeper in the edge zone, up to a maximum', () => {
      const near = autoScrollStep(590, viewportHeight);
      const deeper = autoScrollStep(620, viewportHeight);
      const farOut = autoScrollStep(2000, viewportHeight);

      expect(deeper).toBeGreaterThan(near);
      expect(farOut).toBe(autoScrollStep(3000, viewportHeight));
      expect(autoScrollStep(-2000, viewportHeight)).toBe(-farOut);
    });
  });
});
