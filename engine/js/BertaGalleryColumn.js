var BertaGalleryColumn = new Class({

  container: null,
  imageContainer: null,
  navContainer: null,
  rowClearElement: null,
  newObjectInjectWhere: null,
  newObjectInjectPosition: null,
  currentSrc: null,
  preload: null,
  phase: null,
  loadTimer: null,
  imageFadeOutFx: null,
  imageResizeFx: null,
  imageShowFx: null,

  initialize: function (container) {
    this.is_mobile_device = window.BertaHelpers.isMobile();
    if (container.hasClass('xInitialized')) {
      return;
    }
    container.addClass('xInitialized');
    if (this.is_mobile_device) {
      container.addClass('bt-is-mobile-device');
    }
    this.attach(container);
    this.loadFirst();
    window.addEvent('resize', window.BertaHelpers.debounce(this.layout_update.bindWithEvent(this), 200));
  },

  attach: function (container) {
    this.container = container;
    this.fullscreen = this.container.get('data-fullscreen') !== null;
    this.imageContainer = this.container.getElement('div.xGallery');
    this.navContainer = this.container.getElement('ul.xGalleryNav');

    if (this.navContainer && this.navContainer.getElements('a').length > 0) {
      this.imageFadeOutFx = new Fx.Tween(this.imageContainer, {
        duration: 'short',
        transition: Fx.Transitions.Sine.easeInOut
      });
      this.imageShowFx = new Fx.Tween(this.imageContainer, {
        duration: 'normal',
        transition: Fx.Transitions.Sine.easeInOut
      });

      this.rowClearElement = new Element('br', {
        'class': 'clear'
      }).inject(this.imageContainer);

      this.newObjectInjectWhere = bertaGlobalOptions.environment == 'site' ? this.rowClearElement : this.imageContainer.getElement('.xGalleryEditButton');
      this.newObjectInjectPosition = 'before';

    } else {
      this.navContainer = null;
    }
  },

  detach: function () {
    if (this.navContainer) {
      this.navContainer.getElements('a').each(function (item) {
        item.removeEvents('click');
      });

      this.imageFadeOutFx.cancel();
      if (this.imageResizeFx) this.imageResizeFx.cancel();
      this.imageShowFx.cancel();
      this.imageFadeOutFx = this.imageResizeFx = this.imageShowFx = null;
    }
    this.container = this.imageContainer = this.navContainer = null;
    this.currentSrc = null;
  },

  loadFirst: function () {
    if (this.navContainer) {
      var li = this.navContainer.getElement('li');
      this.nav_highlightItem(li);
      var aEl = this.navContainer.getElement('li a');
      var fistItemType = aEl.getClassStoredValue('xType');

      if (fistItemType != 'image') {
        // load only if not image, because if that's image, it's already written in the HTML
        this.load(aEl.get('href'), aEl.getClassStoredValue('xType'), aEl.getClassStoredValue('xW'), aEl.getClassStoredValue('xH'), aEl.getClassStoredValue('xVideoHref'), aEl.getClassStoredValue('xAutoPlay'), li.getElement('.xGalleryImageCaption').get('html'), true, 1, aEl.get('data-srcset'));
      } else {
        this.currentSrc = aEl.get('href');
        this.preload = this.imageContainer.getElement('div.xGalleryItem');

        this.layout_update();
        this.loadNext();
      }
    }
  },

  loadNext: function (bRotate) {
    if (this.navContainer) {
      var nextLi = this.getNext(bRotate);
      if (nextLi) {
        this.nav_highlightItem(nextLi);
        var aEl = nextLi.getElement('a');
        this.load(aEl.get('href'), aEl.getClassStoredValue('xType'), aEl.getClassStoredValue('xW'), aEl.getClassStoredValue('xH'), aEl.getClassStoredValue('xVideoHref'), aEl.getClassStoredValue('xAutoPlay'), nextLi.getElement('.xGalleryImageCaption').get('html'), false, aEl.getClassStoredValue('xImgIndex'), aEl.get('data-srcset'));
      } else {
        if (this.fullscreen) {
          this.attachFullscreen();
        }
      }
    }
  },

  attachFullscreen: function () {
    var items = this.container.getElements('.xGalleryItem');
    items.each(function (item, i) {
      if (item.hasClass('xGalleryItemType-video')) {
        return;
      }

      item.setStyle('cursor', 'pointer');
      item.addEvent('click', function () {
        BertaGalleryFullscreen(this.container, i);
      }.bindWithEvent(this));
    }, this);
  },

  getNext: function (bRotate) {
    if (this.navContainer) {
      var selectedLi = this.navContainer.getElement('li.selected');
      if (selectedLi) {
        var n = selectedLi.getNext();
        if (!n && bRotate) {
          n = this.navContainer.getElement('li');
        }
        return n;
      }
    }
    return null;
  },

  layout_update: function () {
    // implementable
    // in a template you can implement this function
    var totalHeight = 0,
      maxWidth = 0,
      itmSize;
    this.imageContainer.getChildren('.xGalleryItem').each(function (item) {
      itmSize = item.getSize();
      totalHeight += itmSize.y;
      if (itmSize.x > maxWidth) maxWidth = itmSize.x;
    });
    this.imageContainer.setStyle('height', totalHeight + 'px');
    this.imageContainer.setStyle('width', maxWidth + 'px');
    this.imageContainer.getElements('.xGalleryItem').setStyle('position', 'relative');
  },

  layout_inject: function (bDeleteExisting, bDoContainerFade) {
    if (bDeleteExisting) {
      this.imageContainer.getChildren('.xGalleryItem').destroy();
    }

    this.preload.inject(this.newObjectInjectWhere, this.newObjectInjectPosition);

    picturefill(this.preload.getElement('img'));

    if (bDoContainerFade) {
      this.imageShowFx.set('opacity', 1);
    } else {
      // just fade in the newly added image
      new Fx.Tween(this.preload, {
        duration: 'short',
        transition: Fx.Transitions.Sine.easeInOut
      }).set('opacity', 0).start('opacity', 1);
    }

    this.layout_update();
  },

  nav_setEvents: function () {
    // implementable in the future
    this.navContainer.getElements('a').addEvent('click', this.nav_onItemClick.bindWithEvent(this));
  },

  nav_onItemClick: function (event) {
    // implementable in the future
    if (event.event) {
      event.stop();
    }

    var linkElement = $(event.target);
    if (linkElement.tagName != 'A') linkElement = linkElement.getParent('a');

    var li = linkElement.getParent('li');
    this.nav_highlightItem(li);
  },

  nav_highlightItem: function (liElement) {
    liElement.getParent().getChildren().removeClass('selected');
    liElement.addClass('selected');
  },

  load: function (src, mType, mWidth, mHeight, videoPath, autoPlay, caption, bDeleteExisting, xImgIndex, srcset) {
    switch (this.phase) {
      case 'fadeout':
        this.imageFadeOutFx.cancel();
        break;
      case 'fadein':
        this.imageResizeFx.cancel();
        this.imageShowFx.cancel();
        break;
      default:
        this.imageShowFx.cancel();
        break;
    }

    this.currentSrc = null;
    this.load_Render(src, mType, mWidth, mHeight, videoPath, autoPlay, caption, bDeleteExisting, xImgIndex, srcset);
  },

  load_Render: function (src, mType, mWidth, mHeight, videoPath, autoPlay, caption, bDeleteExisting, xImgIndex, srcset) {
    this.currentSrc = src;
    this.currentVideoAutoPlay = autoPlay;
    this.currentCaption = caption;
    this.xImgIndex = xImgIndex;
    this.srcset = srcset ? srcset : null;

    switch (mType) {
      case 'image':

        var loader = this.imageContainer.getNext('.loader');

        if (loader) {
          this.loadTimer = setTimeout(function () {
            loader.removeClass('xHidden');
          }, 500);
        }

        this.phase = 'preload';
        var altText = caption.replace(/(<([^>]+)>)/ig, ' ').replace(/(\r\n|\n|\r)/gm, ' ').replace(/\s{2,}/g, ' ').trim();
        this.preload = new Asset.image(src, {
          'width': mWidth,
          'height': mHeight,
          'srcset': this.srcset,
          'alt': altText
        });

        this.preload = new Element('div', {
          'class': 'image'
        }).adopt(this.preload);

        if (mWidth) this.preload.setStyle('width', mWidth + 'px');
        if (mHeight) this.preload.setStyle('height', mHeight + 'px');

        this.preload = new Element('div', {
          'class': 'xGalleryItem xGalleryItemType-image xImgIndex-' + this.xImgIndex
        }).adopt(this.preload);

        if (mWidth) this.preload.setStyle('width', mWidth + 'px');
        if (mHeight) this.preload.setStyle('height', mHeight + 'px');

        new Element('div', {
          'class': 'xGalleryImageCaption'
        }).set('html', caption).inject(this.preload);

        this.load_Finish(src, mType, mWidth, mHeight, bDeleteExisting);
        break;

      case 'video':
        if (mHeight) mHeight = parseInt(mHeight);

        this.preload = new Element('video', {
          'width': mWidth,
          'class': 'xGalleryItem xGalleryItemType-video',
          'controls': true,
          'poster': src && src.charAt(0) !== '#' ? src : null,
        });

        var videoType = videoPath.split('.').pop();

        var source = new Element('source', {
          'src': videoPath,
          'type': 'video/' + videoType
        });

        source.inject(this.preload, 'top');

        this.layout_inject(bDeleteExisting, true);
        this.preload.setStyle('position', 'absolute');

        if (autoPlay > 0) {
          this.preload.muted = true;
          this.preload.play();
        }

        new Element('div', {
          'class': 'xGalleryImageCaption'
        }).set('html', caption).inject(this.preload);

        this.load_Finish(src, mType, mWidth, mHeight, bDeleteExisting);
        break;
    }
  },

  load_Finish: function (src, mType, mWidth, mHeight, bDeleteExisting) {
    // test if the loaded image's src is the last invoked image's src
    if (src == this.currentSrc) {
      this.phase = 'done';

      if (mType == 'image') this.layout_inject(bDeleteExisting, false);

      this.layout_update();
      this.loadNext();
    }
  }
});
