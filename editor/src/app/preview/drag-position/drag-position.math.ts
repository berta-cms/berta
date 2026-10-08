/**
 * Pure positioning math for `DragPositionService`, kept separate so it can be
 * unit tested without a DOM.
 */

// Entries keep room above them for their hover toolbar (`.xEntryEditWrap`).
export const ENTRY_MIN_TOP = 20;

export interface Position {
  left: number;
  top: number;
}

/**
 * The `pageLayout/gridStep` site setting; missing, invalid or < 1 means no
 * snapping (a step of 1).
 */
export function normalizeGridStep(raw: unknown): number {
  const step = parseInt(String(raw), 10);
  return isNaN(step) || step < 1 ? 1 : step;
}

/**
 * Rounds down to the grid (toward zero). Positions are clamped to >= 0 right
 * after, so negative values never reach the saved result.
 */
export function snapToGrid(value: number, step: number): number {
  return value - (value % step);
}

/**
 * Keeps a dragged element from leaving the page at the top/left edge.
 */
export function clampPosition(position: Position, isEntry: boolean): Position {
  return {
    left: Math.max(position.left, 0),
    top: Math.max(position.top, isEntry ? ENTRY_MIN_TOP : 0),
  };
}

/**
 * Limits a group move so no member crosses the top/left page edge: the
 * group stops as soon as any member reaches it. Members that already start
 * past an edge (stored before the guard existed) don't limit the group; the
 * caller clamps them onto the edge instead (see `clampPosition`), since the
 * API rejects off-screen entry positions.
 */
export function clampGroupDelta(
  delta: Position,
  starts: Position[],
  isEntry: boolean,
): Position {
  const minTop = isEntry ? ENTRY_MIN_TOP : 0;

  return starts.reduce(
    (clamped, start) => ({
      left: start.left >= 0 ? Math.max(clamped.left, -start.left) : clamped.left,
      top:
        start.top >= minTop
          ? Math.max(clamped.top, minTop - start.top)
          : clamped.top,
    }),
    delta,
  );
}

/**
 * Horizontal offset the centered layout (`#contentContainer.xCentered`)
 * shifts `.xFixed` elements by: `position: fixed` makes their `left`
 * viewport-relative, while the stored value is container-relative.
 */
export function centeringOffset(
  win: Window,
  container: HTMLElement | null,
): number {
  if (!container?.classList.contains('xCentered')) {
    return 0;
  }

  return (win.innerWidth - container.getBoundingClientRect().width) / 2;
}

/**
 * The stored `"left,top"` value for an element at `position`.
 */
export function toSavedValue(
  position: Position,
  offset: number,
  isFixed: boolean,
): string {
  const left = isFixed ? position.left - offset : position.left;
  return `${Math.round(left)},${Math.round(position.top)}`;
}
