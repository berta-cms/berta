var MashupTemplate = new Class({

  isResponsive: false,
  breakPointWidth: 767,

  entriesContainer: null,
  sideColumnBottom: null,
  sideColumn: null,
  mainColumn: null,
  allContainer: null,
  contentContainer: null,
  isCenteredLayout: false,

  initialize: function () {
    window.addEvent('domready', this.onDOMReady.bind(this));
  },

  onDOMReady: function () {
    this.isResponsive = $$('.xResponsive').length;
    this.entriesContainer = $('firstPageMarkedEntries');
    this.sideColumnBottom = $('sideColumnBottom');
    this.sideColumn = $('sideColumn');
    this.mainColumn = $('mainColumn');
    this.allContainer = $('allContainer');
    this.contentContainer = $('contentContainer');
    this.isCenteredLayout = this.sideColumn.hasClass('xCentered');

    if (!this.isResponsive && this.entriesContainer && bertaGlobalOptions.environment == 'site') {

      this.entriesContainer.getElements('.firstPagePic').each(function (el) {
        el.addEvent('mouseenter', this.onFirstPagePicMouseEnter.bindWithEvent(this));
        el.addEvent('mouseleave', this.onFirstPagePicMouseLeave.bindWithEvent(this));
        el.addEvent('mousemove', this.onFirstPagePicMouseMove.bindWithEvent(this));
        el.store('prevMouseX', 0);
        el.store('prevMouseY', 0);
        el.store('mouseMoveOn', false);
      }.bind(this));
    }

    if (this.isCenteredLayout) {
      this.sidebarPositionFix();
    }

    if (this.isResponsive) {
      if (bertaGlobalOptions.environment == 'site') {
        this.iframeResponsiveFix($$('iframe'));
      }
      this.mainColumnPaddingFix();
      this.sideColumnBottomSwitching();
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
  },

  sidebarPositionFix: function () {
    var allContainerWidth = parseInt(this.allContainer.getStyle('max-width'));

    window.addEvent('resize', function () {
      if (window.getSize().x < allContainerWidth) {
        this.allContainer.addClass('xNarrow');
      } else {
        this.allContainer.removeClass('xNarrow');
      }
    }).fireEvent('resize');
  },

  mainColumnPaddingFix: function () {
    var breakPointWidth = this.breakPointWidth;
    var mainColumnPaddingTop = this.mainColumn.get('data-paddingtop');

    window.addEvent('resize', function () {
      var sideColumnHeight = this.sideColumn.getSize().y;

      if (breakPointWidth < this.getSize().x) {
        this.mainColumn.setStyle('padding-top', mainColumnPaddingTop);
        // small tablet
      } else {
        this.mainColumn.setStyle('padding-top', parseInt(mainColumnPaddingTop) + sideColumnHeight + 'px');
      }
    });

    var headerImage = this.sideColumn.getElement('img');

    if (headerImage) {
      Asset.image(headerImage.get('src'), {
        onLoad: function () {
          window.fireEvent('resize');
        }
      });
    }

    setTimeout(
      function () {
        window.fireEvent('resize');
      },
      100
    );
  },

  sideColumnBottomSwitching: function () {
    var breakPointWidth = this.breakPointWidth;

    window.addEvent('resize', function () {
      if (breakPointWidth < this.getSize().x) {
        this.sideColumnBottom.inject(this.sideColumn);
        // small tablet
      } else {
        this.sideColumnBottom.inject(this.allContainer).setStyle('position', 'static');
      }
    }).fireEvent('resize');
  },

  onFirstPagePicMouseEnter: function (event) {
    var target = $(event.target);
    if (!target.hasClass('firstPagePic')) {
      target = target.getParent('.firstPagePic');
    }

    target.store('mouseMoveOn', true);
    target.store('prevMouseX', event.page.x);
    target.store('prevMouseY', event.page.y);
    target.store('initPosX', target.getStyle('left'));
    target.store('initPosY', target.getStyle('top'));
  },

  onFirstPagePicMouseLeave: function (event) {
    var target = $(event.target);
    if (!target.hasClass('firstPagePic')) {
      target = target.getParent('.firstPagePic');
    }

    target.setStyle('left', target.retrieve('initPosX'));
    target.setStyle('top', target.retrieve('initPosY'));
  },

  onFirstPagePicMouseMove: function (event) {
    var target = $(event.target);
    if (!target.hasClass('firstPagePic')) {
      target = target.getParent('.firstPagePic');
    }

    if (target.retrieve('mouseMoveOn')) {
      var xDiff = event.page.x > target.retrieve('prevMouseX') ? 1 : (event.page.x == target.retrieve('prevMouseX') ? 0 : -1);
      var yDiff = event.page.y > target.retrieve('prevMouseY') ? 1 : (event.page.y == target.retrieve('prevMouseY') ? 0 : -1);

      target.store('prevMouseX', event.page.x);
      target.store('prevMouseY', event.page.y);
      target.store('mouseMoveOn', !xDiff && !yDiff);

      if (target.hasClass('firstPageWiggle')) {
        target.setStyle('left', parseInt(target.getStyle('left')) + xDiff * 5);
        target.setStyle('top', parseInt(target.getStyle('top')) + yDiff * 5);
      }
    }
  }
});

new MashupTemplate();
