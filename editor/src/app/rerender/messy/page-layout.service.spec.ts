import { Store } from '@ngxs/store';

import { PageLayoutService } from './page-layout.service';
import { HandleSiteSettingsChildrenChangesAction } from '../../sites/settings/site-settings.actions';

describe('PageLayoutService gridlines', () => {
  const GRID_STYLE = 'background-size: 50px 50px';
  const NEW_GRID_STYLE = 'background-size: 100px 100px';

  let doc: Document;
  let iframe: HTMLIFrameElement;
  let service: PageLayoutService;

  function grids(): HTMLElement[] {
    return Array.from(doc.querySelectorAll<HTMLElement>('#xGridBackground'));
  }

  function change(payload: object, gridStyle: string | null) {
    service.handleSettings(
      iframe,
      new HandleSiteSettingsChildrenChangesAction('pageLayout', payload),
      { gridlinesAttributes: gridStyle ? { style: gridStyle } : null },
    );
  }

  function addServerRenderedGrid() {
    doc.body.insertAdjacentHTML(
      'afterbegin',
      `<div id="xGridBackground" style="${GRID_STYLE}"></div>`,
    );
  }

  beforeEach(() => {
    doc = document.implementation.createHTMLDocument('');
    doc.body.id = 'body';
    doc.body.innerHTML = '<div id="allContainer"></div>';
    iframe = { contentDocument: doc } as HTMLIFrameElement;
    service = new PageLayoutService({} as Store);
  });

  it('adds the gridlines when they are turned on', () => {
    change({ showGrid: 'yes' }, GRID_STYLE);

    expect(grids().length).toBe(1);
    expect(grids()[0].style.backgroundSize).toBe('50px 50px');
    expect(doc.body.firstElementChild).toBe(grids()[0]);
  });

  it('keeps a single element when they are turned on again', () => {
    change({ showGrid: 'yes' }, GRID_STYLE);
    change({ showGrid: 'yes' }, NEW_GRID_STYLE);

    expect(grids().length).toBe(1);
    expect(grids()[0].style.backgroundSize).toBe('100px 100px');
  });

  it('reuses the server-rendered gridlines and drops duplicates', () => {
    addServerRenderedGrid();
    addServerRenderedGrid();

    change({ showGrid: 'yes' }, NEW_GRID_STYLE);

    expect(grids().length).toBe(1);
    expect(grids()[0].style.backgroundSize).toBe('100px 100px');
  });

  it('removes every copy when they are turned off', () => {
    addServerRenderedGrid();
    addServerRenderedGrid();

    change({ showGrid: 'no' }, null);

    expect(grids().length).toBe(0);
  });

  it('turning off without gridlines on the page is fine', () => {
    expect(() => change({ showGrid: 'no' }, null)).not.toThrow();
    expect(grids().length).toBe(0);
  });

  it('updates the gridlines on a grid step or color change', () => {
    addServerRenderedGrid();

    change({ gridStep: '20' }, NEW_GRID_STYLE);

    expect(grids().length).toBe(1);
    expect(grids()[0].style.backgroundSize).toBe('100px 100px');

    change({ gridColor: 'white' }, GRID_STYLE);

    expect(grids().length).toBe(1);
    expect(grids()[0].style.backgroundSize).toBe('50px 50px');
  });

  it('adds missing gridlines on a grid step change while they are on', () => {
    change({ gridStep: '20' }, GRID_STYLE);

    expect(grids().length).toBe(1);
  });

  it('removes the gridlines when the grid step drops below 2', () => {
    addServerRenderedGrid();

    change({ gridStep: '1' }, null);

    expect(grids().length).toBe(0);
  });

  it('ignores other page layout settings', () => {
    addServerRenderedGrid();

    change({ centeredWidth: '900px' }, null);

    expect(grids().length).toBe(1);
  });
});
