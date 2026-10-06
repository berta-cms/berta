var WhiteTemplate = class {
  constructor() {
    this.isResponsive = false;
    this.breakPointWidth = 767;

    this.sideColumnBottom = null;
    this.sideColumn = null;
    this.mainColumn = null;
    this.allContainer = null;
    this.contentContainer = null;
    this.isCenteredLayout = false;

    window.BertaHelpers.onDomReady(this.onDOMReady.bind(this));
  }

  onDOMReady() {
    this.isResponsive = document.querySelectorAll('.xResponsive').length > 0;

    this.sideColumnBottom = document.getElementById('sideColumnBottom');
    this.sideColumn = document.getElementById('sideColumn');
    this.mainColumn = document.getElementById('mainColumn');
    this.allContainer = document.getElementById('allContainer');
    this.contentContainer = document.getElementById('contentContainer');

    this.isCenteredLayout = this.sideColumn.classList.contains('xCentered');

    if (this.isCenteredLayout) {
      this.sidebarPositionFix();
    }

    if (this.isResponsive) {
      if (bertaGlobalOptions.environment == 'site') {
        window.BertaHelpers.wrapResponsiveIframes(document.querySelectorAll('iframe'), false);
      }
      this.mainColumnPaddingFix();
      this.sideColumnBottomSwitching();
    }
  }

  sidebarPositionFix() {
    var allContainerWidth = parseInt(window.BertaHelpers.getStyle(this.allContainer, 'max-width'));

    window.addEventListener('resize', () => {
      if (window.BertaHelpers.getWindowSize().x < allContainerWidth) {
        this.allContainer.classList.add('xNarrow');
      } else {
        this.allContainer.classList.remove('xNarrow');
      }
    });
    window.BertaHelpers.triggerResize();
  }

  mainColumnPaddingFix() {
    var breakPointWidth = this.breakPointWidth;
    var mainColumnPaddingTop = this.mainColumn.getAttribute('data-paddingtop');

    window.addEventListener('resize', () => {
      var sideColumnHeight = this.sideColumn.offsetHeight;

      if (breakPointWidth < window.BertaHelpers.getWindowSize().x) {
        this.mainColumn.style.paddingTop = mainColumnPaddingTop;
        // small tablet
      } else {
        this.mainColumn.style.paddingTop = sideColumnHeight + 'px';
      }
    });

    var headerImage = this.sideColumn.querySelector('img');

    if (headerImage) {
      var image = new Image();
      image.onload = function () {
        window.BertaHelpers.triggerResize();
      };
      image.src = headerImage.getAttribute('src');
    }

    setTimeout(
      function () {
        window.BertaHelpers.triggerResize();
      },
      100
    );
  }

  sideColumnBottomSwitching() {
    var breakPointWidth = this.breakPointWidth;

    window.addEventListener('resize', () => {
      if (breakPointWidth < window.BertaHelpers.getWindowSize().x) {
        this.sideColumn.append(this.sideColumnBottom);
        // small tablet
      } else {
        this.allContainer.append(this.sideColumnBottom);
        this.sideColumnBottom.style.position = 'static';
      }
    });
    window.BertaHelpers.triggerResize();
  }
};

new WhiteTemplate();
