var Berta = class {
  constructor(options) {
    this.options = Object.assign({}, options);

    window.BertaHelpers.onDomReady(this.onDOMReady.bind(this));
    window.BertaHelpers.onWindowLoad(this.onLoad.bind(this));
  }

  onDOMReady() {
    this.windowResizeEvents();
  }

  onLoad() {
    // init entry galleries only in "load" event because otherwise in some browsers
    // (eg. safari), the CSS sometimes is not loaded in time to get the styles from
    // the elements with javascript
    this.initEntriesList();
  }

  initEntriesList() {
    document.querySelectorAll('.xEntriesList .xGalleryContainer').forEach((item) => {
      if (!item.closest('.xEntry').classList.contains('xHidden')) {
        window.BertaHelpers.initGallery(item);
      }
    });
  }

  windowResizeEvents() {
    var templateName = this.options.templateName.split('-');
    templateName = templateName[0];

    if (templateName == 'mashup' || templateName == 'white') {
      var isResponsive = document.querySelectorAll('.xResponsive').length;
      var breakPointWidth = 767;

      var footerOverlayFix = function () {
        var windowSize = window.BertaHelpers.getWindowSize();
        var sideColumn = document.getElementById('sideColumn');
        var sideColumnTop = document.getElementById('sideColumnTop');
        var sideColumnBottom = document.getElementById('sideColumnBottom');

        if (sideColumnTop && sideColumnBottom) {
          var sideColumnTopHeight = sideColumnTop.offsetHeight;
          var sideColumnBottomHeight = sideColumnBottom.offsetHeight;
          if ((isResponsive && breakPointWidth > windowSize.x) || (windowSize.y < sideColumnTopHeight + sideColumnBottomHeight)) {
            sideColumn.style.position = 'absolute';
            sideColumnBottom.style.position = 'static';
          } else {
            sideColumn.style.position = 'fixed';
            sideColumnBottom.style.position = 'absolute';
          }
        }
      };

      setTimeout(footerOverlayFix, 1000);
      window.addEventListener('resize', footerOverlayFix);
    }

    this.responsiveMenu();
  }

  responsiveMenu() {
    var menuToggle = document.getElementById('menuToggle');

    if (!menuToggle) {
      return;
    }

    var objSlide = menuToggle.nextElementSibling;
    var breakPointWidth = 767;
    var winWidth = window.BertaHelpers.getWindowSize().x;

    menuToggle.addEventListener('click', (event) => {
      event.preventDefault();
      window.BertaHelpers.toggle(objSlide);
      menuToggle.classList.toggle('active');
    });

    window.addEventListener('resize', () => {
      var width = window.BertaHelpers.getWindowSize().x;

      if (winWidth != width) {
        winWidth = width;
        if (breakPointWidth < width) {
          window.BertaHelpers.show(objSlide);
          // small tablet
        } else {
          menuToggle.classList.remove('active');
          window.BertaHelpers.hide(objSlide);
        }
      }
    });
    window.BertaHelpers.triggerResize();
  }
};

window.berta = new Berta(window.bertaGlobalOptions);
