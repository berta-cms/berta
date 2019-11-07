var DefaultTemplate = new Class({

  isResponsive: false,

  initialize: function () {
    window.addEvent('domready', this.onDOMReady.bind(this));
  },

  onDOMReady: function () {
    this.isResponsive = $$('.xResponsive').length;

    if (this.isResponsive) {
      if (bertaGlobalOptions.environment == 'site') {
        this.iframeResponsiveFix($$('iframe'));
      }
    }
  },

  iframeResponsiveFix: function (el) {
    el.each(function (item) {
      var source = item.get('src');

      berta.options.iframeWrapperWhiteList.each(function (whiteList) {
        if (source && source.indexOf(whiteList) > -1) {
          var width = item.get('width');
          var height = item.get('height');
          var wrapper = new Element('div', {
            'class': 'iframeWrapper'
          });

          if (width && height) {
            wrapper.setStyle('padding-bottom', height * 100 / width + '%');
          }

          if (!item.getParent().hasClass('iframeWrapper')) { //if no iframeWrapper already exists
            wrapper.wraps(item);
          }
        }
      });
    });
  }
});

new DefaultTemplate();
