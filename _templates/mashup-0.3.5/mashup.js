var MashupTemplate = class {
  constructor() {
    this.isResponsive = false;
    this.breakPointWidth = 767;

    this.entriesContainer = null;
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
    this.entriesContainer = document.getElementById('firstPageMarkedEntries');
    this.sideColumnBottom = document.getElementById('sideColumnBottom');
    this.sideColumn = document.getElementById('sideColumn');
    this.mainColumn = document.getElementById('mainColumn');
    this.allContainer = document.getElementById('allContainer');
    this.contentContainer = document.getElementById('contentContainer');
    this.isCenteredLayout = this.sideColumn.classList.contains('xCentered');

    if (!this.isResponsive && this.entriesContainer && bertaGlobalOptions.environment == 'site') {
      this.entriesContainer.querySelectorAll('.firstPagePic').forEach((el) => {
        this.firstPagePicWiggle(el);
      });
    }

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
        this.mainColumn.style.paddingTop = parseInt(mainColumnPaddingTop) + sideColumnHeight + 'px';
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

  // The first mouse move over a picture nudges it 5px in that direction, leaving puts it back
  firstPagePicWiggle(el) {
    var prevMouseX = 0;
    var prevMouseY = 0;
    var mouseMoveOn = false;
    var initPosX, initPosY;

    el.addEventListener('mouseenter', function (event) {
      mouseMoveOn = true;
      prevMouseX = event.pageX;
      prevMouseY = event.pageY;
      initPosX = window.BertaHelpers.getStyle(el, 'left');
      initPosY = window.BertaHelpers.getStyle(el, 'top');
    });

    el.addEventListener('mouseleave', function () {
      el.style.left = initPosX;
      el.style.top = initPosY;
    });

    el.addEventListener('mousemove', function (event) {
      if (mouseMoveOn) {
        var xDiff = event.pageX > prevMouseX ? 1 : (event.pageX == prevMouseX ? 0 : -1);
        var yDiff = event.pageY > prevMouseY ? 1 : (event.pageY == prevMouseY ? 0 : -1);

        prevMouseX = event.pageX;
        prevMouseY = event.pageY;
        mouseMoveOn = !xDiff && !yDiff;

        if (el.classList.contains('firstPageWiggle')) {
          el.style.left = parseInt(window.BertaHelpers.getStyle(el, 'left')) + xDiff * 5 + 'px';
          el.style.top = parseInt(window.BertaHelpers.getStyle(el, 'top')) + yDiff * 5 + 'px';
        }
      }
    });
  }
};

new MashupTemplate();
