var DefaultTemplate = class {
  constructor() {
    this.isResponsive = false;
    window.BertaHelpers.onDomReady(this.onDOMReady.bind(this));
  }

  onDOMReady() {
    this.isResponsive = document.querySelectorAll('.xResponsive').length > 0;

    if (this.isResponsive) {
      if (bertaGlobalOptions.environment == 'site') {
        window.BertaHelpers.wrapResponsiveIframes(document.querySelectorAll('iframe'), false);
      }
    }
  }
};

new DefaultTemplate();
