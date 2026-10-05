var Berta = new Class({

  Implements: Options,

  options: {
    iframeWrapperWhiteList: ['youtube', 'vimeo']
  },

  initialize: function (options) {
    this.setOptions(options);
    window.addEvent('domready', this.onDOMReady.bind(this));
    window.addEvent('load', this.onLoad.bind(this));
  },

  onDOMReady: function () {
    this.windowResizeEvents();
  },

  onLoad: function () {
    // init entry galleries only in "load" event because otherwise in some browsers
    // (eg. safari), the CSS sometimes is not loaded in time to get the styles from
    // the elements with javascript
    this.initEntriesList();
  },

  initEntriesList: function () {
    $$('.xEntriesList .xGalleryContainer').each(function (item) {
      if (!item.getParent('.xEntry').hasClass('xHidden')) {
        this.initGallery(item);
      }
    }.bind(this));
  },

  initGallery: function (item) {
    var galleryType = window.BertaHelpers.getClassStoredValue(item, 'xGalleryType');

    switch (galleryType) {
      case 'row':
        new BertaGalleryRow(item);
        break;
      case 'column':
        new BertaGalleryColumn(item);
        break;
      case 'pile':
        new BertaGalleryPile(item);
        break;
      case 'link':
        // link galleries are plain markup and need no JS
        break;
      case 'grid':
        new BertaGalleryGrid(item);
        break;
      default:
        new BertaGallerySlideshow(item);
    }
  },

  windowResizeEvents: function () {
    var templateName = this.options.templateName.split('-');
    templateName = templateName[0];

    if (templateName == 'mashup' || templateName == 'white') {
      var isResponsive = $$('.xResponsive').length;
      var breakPointWidth = 767;

      var footerOverlayFix = function () {
        var windowWidth = window.getSize().x;
        var windowHeight = window.getSize().y;
        var sideColumn = $('sideColumn');
        var sideColumnTop = $('sideColumnTop');
        var sideColumnBottom = $('sideColumnBottom');

        if (sideColumnTop && sideColumnBottom) {
          var sideColumnTopHeight = sideColumnTop.getSize().y;
          var sideColumnBottomHeight = sideColumnBottom.getSize().y;
          if ((isResponsive && breakPointWidth > windowWidth) || (windowHeight < sideColumnTopHeight + sideColumnBottomHeight)) {
            sideColumn.setStyle('position', 'absolute');
            sideColumnBottom.setStyle('position', 'static');
          } else {
            sideColumn.setStyle('position', 'fixed');
            sideColumnBottom.setStyle('position', 'absolute');
          }
        }
      };

      footerOverlayFix.delay(1000);
      $(window).addEvent('resize', footerOverlayFix);
    }

    var responsiveMenu = function () {
      var menuToggle = $('menuToggle');

      if (menuToggle) {
        var objSlide = menuToggle.getNext();
        var breakPointWidth = 767;

        menuToggle.addEvent('click', function (e) {
          e.preventDefault();
          objSlide.toggle();
          this.toggleClass('active');
        });

        window.addEvent('resize', function () {
          if (win_width != window.getSize().x) {
            win_width = window.getSize().x;
            if (breakPointWidth < this.getSize().x) {
              objSlide.show();
              // small tablet
            } else {
              menuToggle.removeClass('active');
              objSlide.hide();
            }
          }
        });
        var win_width = window.getSize().x;
        window.BertaHelpers.triggerResize();
      }
    };
    responsiveMenu();
  }

});

window.berta = new Berta(window.bertaGlobalOptions);
