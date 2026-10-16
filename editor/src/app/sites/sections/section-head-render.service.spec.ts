import { SectionHeadRenderService } from './section-head-render.service';
import { TwigTemplateRenderService } from '../../render/twig-template-render.service';

describe('SectionHeadRenderService', () => {
  const PRICE_ITEM = {
    priceItemFontcolor: '#ff0000',
    priceItemfontFamily: 'Arial, sans-serif',
    priceItemgoogleFont: 'Roboto:400,700',
    priceItemfontSize: '',
    priceItemfontWeight: 'bold',
    priceItemfontStyle: 'normal',
    priceItemfontVariant: 'normal',
    priceItemlineHeight: '14px',
  };
  const ENTRY_HEADING = {
    fontFamily: 'Arial, sans-serif',
    googleFont: '',
    fontWeight: 'bold',
    fontStyle: '',
    fontVariant: 'normal',
  };

  function shopStyles(pageLayout: Record<string, string>) {
    const service = new SectionHeadRenderService(
      {} as TwigTemplateRenderService,
    );

    return service.getStyles(
      { version: '2.11.0' },
      '',
      { template: { template: 'messy-0.4.2' } },
      null,
      { pageLayout, entryHeading: ENTRY_HEADING, css: { customCSS: '' } },
      { default: { entryPadding: '0' } },
      'messy',
      'shop',
      true,
      { group_price_item: PRICE_ITEM },
      false,
      false,
      {
        entryHeading: {
          fontStyle: { default: 'normal' },
          fontWeight: { default: 'normal' },
        },
      },
      { group_price_item: { priceItemfontSize: { default: '12px' } } },
    );
  }

  it('links the static shop styles and writes the price and cart heading fonts', () => {
    const styles = shopStyles({});

    expect(styles.cssFiles).toContain('/_plugin_shop/css/shop.css?2.11.0');
    // An empty setting shows its default, as the site's settings files read it
    expect(styles.inlineCSS).toBe(
      '#pageEntries .cartPrice { color: #ff0000; font-family: Roboto; font-size: 12px; font-weight: bold; font-style: normal; font-variant: normal; line-height: 14px; }' +
        '#shoppingCartTitle, #shoppingCartEmpty { font-family: Arial, sans-serif; font-weight: bold; font-style: normal; font-variant: normal; }',
    );
  });

  it('writes the cart link and price layout of a responsive, centered page', () => {
    const styles = shopStyles({ responsive: 'yes', centeredContents: 'yes' });

    expect(styles.inlineCSS).toContain(
      '#shoppingCart { position: relative; float: right; right: inherit; margin: 0 10px 10px 10px; }#shoppingCart { margin-top: 20px; }',
    );
    expect(styles.inlineCSS).toContain(
      '@media (max-width: 767px) {.bt-auto-responsive #shoppingCart { margin-top: 20px; }',
    );
  });
});
