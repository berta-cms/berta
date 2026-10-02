/**
 * Pure geometry for `SortableService`, kept separate so it can be unit tested
 * without a DOM.
 */

// Distance from the viewport's top/bottom edge where dragging scrolls it.
export const AUTO_SCROLL_EDGE = 40;
const AUTO_SCROLL_MAX_STEP = 20;

export interface Point {
  x: number;
  y: number;
}

export interface Box {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

/**
 * Where the dragged item goes relative to the item under the pointer: items
 * on the same row (a grid, an inline menu) compare the pointer with the
 * target's horizontal middle, items on different rows (a list) with its
 * vertical middle.
 *
 * Comparing with the middle keeps items of unequal size from swapping back
 * and forth: once moved, the pointer is still on the same side of the
 * target's middle.
 */
export function insertPosition(
  target: Box,
  dragged: Box,
  point: Point,
): 'before' | 'after' {
  const verticalOverlap =
    Math.min(target.bottom, dragged.bottom) - Math.max(target.top, dragged.top);

  if (verticalOverlap > 1) {
    return point.x < (target.left + target.right) / 2 ? 'before' : 'after';
  }

  return point.y < (target.top + target.bottom) / 2 ? 'before' : 'after';
}

/**
 * The part two boxes have in common, or `null` when they don't overlap.
 */
export function intersectBox(a: Box, b: Box): Box | null {
  const box = {
    left: Math.max(a.left, b.left),
    top: Math.max(a.top, b.top),
    right: Math.min(a.right, b.right),
    bottom: Math.min(a.bottom, b.bottom),
  };

  return box.left < box.right && box.top < box.bottom ? box : null;
}

/**
 * Keeps the point inside the box, so dragging past the start/end of a list
 * still targets its first/last item.
 */
export function clampPoint(point: Point, box: Box): Point {
  return {
    x: Math.min(Math.max(point.x, box.left + 1), box.right - 1),
    y: Math.min(Math.max(point.y, box.top + 1), box.bottom - 1),
  };
}

/**
 * Pixels to scroll the viewport by per frame while the pointer is near (or
 * past) its top/bottom edge; negative scrolls up. Faster the deeper the
 * pointer is in the edge zone.
 */
export function autoScrollStep(y: number, viewportHeight: number): number {
  const depth =
    y < AUTO_SCROLL_EDGE
      ? y - AUTO_SCROLL_EDGE
      : y > viewportHeight - AUTO_SCROLL_EDGE
        ? y - (viewportHeight - AUTO_SCROLL_EDGE)
        : 0;

  return (
    Math.sign(depth) *
    Math.min(AUTO_SCROLL_MAX_STEP, Math.ceil(Math.abs(depth) / 2))
  );
}
