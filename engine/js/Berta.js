Element.implement({
  getIndex: function (type) {
    type = (type) ? type : '';
    return $$(type).indexOf(this);
  },

  exists: function () {
    return this;
  },

  getClassStoredValue: function (varName) {
    var c = this.get('class').split(' ');
    for (var i = 0; i < c.length; i++) {
      if (c[i].substr(0, c[i].indexOf('-')) == varName) {
        return c[i].substr(c[i].indexOf('-') + 1);
      }
    }
    return null;
  },

  setClassStoredValue: function (varName, varValue) {
    var c = this.get('class').split(' ');
    var curValue = this.getClassStoredValue(varName);
    if (curValue) {
      this.removeClass(varName + '-' + curValue);
    }
    this.addClass(varName + '-' + varValue);
  }
});



var Berta = new Class({

  Implements: Options,

  options: {
    paths: null,
    playerType: 'JWPlayer',
    iframeWrapperWhiteList: ['youtube', 'vimeo']
  },

  entriesList: null,

  initialize: function (options) {
    this.setOptions(options);
    window.addEvent('domready', this.onDOMReady.bindWithEvent(this));
    window.addEvent('load', this.onLoad.bindWithEvent(this));

    if (!window.console) {
      window.console = {
        debug: function () {},
        log: function () {}
      };
    }
  },

  onDOMReady: function (event) {
    this.entriesList = $$('.xEntriesList');
    if (this.entriesList) this.entriesList = this.entriesList[0];
    this.windowResizeEvents();
  },

  onLoad: function (event) {
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
    var galleryType = item.getClassStoredValue('xGalleryType');

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
        new BertaGalleryLink(item);
        break;
      default:
        new BertaGallerySlideshow(item);
    }
  },

  windowResizeEvents: function () {
    var templateName = this.options.templateName.split('-');
    templateName = templateName[0];

    var footerOverlayFix = function () {
      var windowWidth = window.getSize().x;
      var windowHeight = window.getSize().y;
      var sideColumn = $('sideColumn');
      var sideColumnTop = $('sideColumnTop');
      var sideColumnBottom = $('sideColumnBottom');

      if (sideColumnBottom && sideColumnBottom) {
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

    if (templateName == 'mashup' || templateName == 'white') {

      var isResponsive = $$('.xResponsive').length;
      var breakPointWidth = 767;

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
        window.fireEvent('resize');
      }
    };
    responsiveMenu();
  }

});

window.berta = new Berta(window.bertaGlobalOptions);
