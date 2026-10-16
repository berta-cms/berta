import { Store } from '@ngxs/store';

import { StyleService } from './style.service';

describe('StyleService', () => {
  const PRICE_COLOR = {
    group: 'group_price_item',
    slug: 'priceItemFontcolor',
    value: '#ff0000',
  };

  let rootState: { shopSettingsConfig?: unknown };
  let styleSheet: CSSStyleSheet;
  let service: StyleService;

  beforeEach(() => {
    rootState = {};
    const store = {
      selectSnapshot: (selector: (state: unknown) => unknown) =>
        selector(rootState),
    } as unknown as Store;
    service = new StyleService(
      store,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
    );
    styleSheet = new CSSStyleSheet();
    service.initializeStyleSheet(window, styleSheet);
  });

  it('ignores a shop setting while the shop settings config is not loaded', () => {
    expect(() => service.updateShopStyle({ ...PRICE_COLOR }, [])).not.toThrow();
    expect(styleSheet.cssRules.length).toBe(0);
  });

  it('applies a shop setting with the config the shop loaded after the preview', () => {
    rootState.shopSettingsConfig = {
      group_price_item: {
        priceItemFontcolor: {
          default: '#333333',
          css: [{ selector: '#pageEntries .cartPrice', property: 'color' }],
        },
      },
    };

    service.updateShopStyle({ ...PRICE_COLOR }, []);

    const rule = styleSheet.cssRules[0] as CSSStyleRule;
    expect(rule.selectorText).toBe('#pageEntries .cartPrice');
    expect(rule.style.color).toBe('rgb(255, 0, 0)');
  });
});
