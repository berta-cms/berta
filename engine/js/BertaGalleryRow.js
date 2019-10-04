var BertaGalleryRow = new Class({
  container: null,
  imageContainer: null,
  navContainer: null,
  rowClearElement: null,
  newObjectInjectWhere: null,
  newObjectInjectPosition: null,
  currentSrc: null,
  preload: null,
  loadTimer: null,
  loadedItems: 0,
  currentItem: 0,


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
    this.galleryEditButton = this.imageContainer.getElement('.xGalleryEditButton');

    var galleryLoader = this.imageContainer.getElement('.loading');
    if (galleryLoader) {
      galleryLoader.dispose();
    }

    this.loadedItems = this.container.getElements('.xGalleryItem').length;

    if (this.navContainer && this.navContainer.getElements('a').length > 0) {
      this.rowClearElement = new Element('br', {
        'class': 'clear'
      }).inject(this.imageContainer);

      this.newObjectInjectWhere = bertaGlobalOptions.environment == 'site' ? this.rowClearElement : this.galleryEditButton;
      this.newObjectInjectPosition = 'before';

    } else
      this.navContainer = null;
  },

  detach: function () {
    if (this.navContainer) {
      this.navContainer.getElements('a').each(function (item) {
        item.removeEvents('click');
      });
    }
    this.container = this.imageContainer = this.navContainer = null;
    this.currentSrc = null;
  },

  loadFirst: function () {
    if (this.navContainer) {
      var li = this.navContainer.getElement('li');
      this.nav_highlightItem(li);
      var aEl = this.navContainer.getElement('li a');
      this.load(aEl.get('href'), aEl.getClassStoredValue('xType'), aEl.getClassStoredValue('xW'), aEl.getClassStoredValue('xH'), aEl.getClassStoredValue('xVideoHref'), aEl.getClassStoredValue('xAutoPlay'), li.getElement('.xGalleryImageCaption').get('html'), 1, aEl.get('data-srcset'));
    }
  },

  loadNext: function (bRotate) {
    if (this.navContainer) {
      var nextLi = this.getNext(bRotate);
      if (nextLi) {
        this.nav_highlightItem(nextLi);
        var aEl = nextLi.getElement('a');
        this.load(aEl.get('href'), aEl.getClassStoredValue('xType'), aEl.getClassStoredValue('xW'), aEl.getClassStoredValue('xH'), aEl.getClassStoredValue('xVideoHref'), aEl.getClassStoredValue('xAutoPlay'), nextLi.getElement('.xGalleryImageCaption').get('html'), aEl.getClassStoredValue('xImgIndex'), aEl.get('data-srcset'));
      } else {
        //after everything is loaded

        // attach fullscreen for gallery row mode
        if (this.fullscreen) {
          this.attachFullscreen();
        }

        // update gallery edit button width
        if (this.galleryEditButton) {
          this.galleryEditButton.setStyle('width', this.imageContainer.scrollWidth);
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

    var rowGalleryPadding = this.imageContainer.get('xRowGalleryPadding');

    if (rowGalleryPadding) {
      this.imageContainer.getChildren().each(function (el) {
        el.setStyle('padding', rowGalleryPadding);
      });
    }

    this.imageContainer.getChildren('.xGalleryItem').each(function (item) {
      if (item.getClassStoredValue('xGalleryItemType') != 'video') {
        item.setStyle('height', 'auto');
      }
    });

    this.imageContainer.getElements('.xGalleryItem').setStyle('position', 'relative');
  },

  layout_inject: function (currentItemIsLoaded) {
    if (!currentItemIsLoaded) {
      this.preload.inject(this.newObjectInjectWhere, this.newObjectInjectPosition);
      picturefill(this.preload.getElement('img'));
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

  load: function (src, mType, mWidth, mHeight, videoPath, autoPlay, caption, xImgIndex, srcset) {
    this.currentItem += 1;
    this.currentSrc = null;
    var currentItemIsLoaded = this.currentItem <= this.loadedItems;
    this.load_Render(src, mType, mWidth, mHeight, videoPath, autoPlay, caption, xImgIndex, srcset, currentItemIsLoaded);
  },

  load_Render: function (src, mType, mWidth, mHeight, videoPath, autoPlay, caption, xImgIndex, srcset, currentItemIsLoaded) {
    this.currentSrc = src;
    this.xImgIndex = xImgIndex;
    this.srcset = srcset ? srcset : null;

    switch (mType) {
      case 'image':
        if (!currentItemIsLoaded) {
          var altText = caption.replace(/(<([^>]+)>)/ig, ' ').replace(/(\r\n|\n|\r)/gm, ' ').replace(/\s{2,}/g, ' ').trim();

          this.preload = new Asset.image(src, {
            'width': mWidth,
            'height': mHeight,
            'srcset': this.srcset,
            'alt': altText
          });

          this.preload = new Element('div', {
            'class': 'xGalleryItem xGalleryItemType-image xImgIndex-' + this.xImgIndex
          }).adopt(this.preload);

          new Element('div', {
            'class': 'xGalleryImageCaption'
          }).set('html', caption).inject(this.preload);
        }

        this.load_Finish(src, mType, currentItemIsLoaded);
        break;

      case 'video':

        if (currentItemIsLoaded) {
          this.preload = this.imageContainer.getChildren()[this.currentItem - 1].getElement('video');

        } else {
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

          this.layout_inject(currentItemIsLoaded);
          this.preload.setStyle('position', 'absolute');

          new Element('div', {
            'class': 'xGalleryImageCaption'
          }).set('html', caption).inject(this.preload);
        }

        if (autoPlay > 0) {
          this.preload.muted = true;
          this.preload.play();
        }

        this.load_Finish(src, mType, currentItemIsLoaded);
        break;
    }
  },

  load_Finish: function (src, mType, currentItemIsLoaded) {
    // test if the loaded image's src is the last invoked image's src
    if (src == this.currentSrc) {
      if (mType == 'image') {
        this.layout_inject(currentItemIsLoaded);
      }

      this.layout_update();
      this.loadNext();
    }
  }
});
