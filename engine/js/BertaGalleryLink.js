var BertaGalleryLink = new Class({

  container: null,
  imageContainer: null,
  navContainer: null,
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
  },

  attach: function (container) {
    this.container = container;
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

      this.newObjectInjectWhere = bertaGlobalOptions.environment == 'site' ? this.imageContainer : this.imageContainer.getElement('.xGalleryEditButton');
      this.newObjectInjectPosition = bertaGlobalOptions.environment == 'site' ? 'bottom' : 'before';

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
      this.autoplay = parseInt(this.container.getClassStoredValue('xGalleryAutoPlay'), 10);

      if (fistItemType != 'image') {
        // load only if not image, because if that's image, it's already written in the HTML
        this.load(aEl.get('href'), aEl.getClassStoredValue('xType'), aEl.getClassStoredValue('xW'), aEl.getClassStoredValue('xH'), aEl.getClassStoredValue('xVideoHref'), aEl.getClassStoredValue('xAutoPlay'), li.getElement('.xGalleryImageCaption').get('html'), true, 1, aEl.get('data-srcset'));
      } else {
        this.currentSrc = aEl.get('href');
        this.preload = this.imageContainer.getElement('div.xGalleryItem');

        if (!this.getNext() || this.is_mobile_device) {
          var topImg = this.imageContainer.getFirst('.xGalleryItem');
          var linkHref = this.container.getClassStoredValue('xGalleryLinkAddress');
          var linkTarget = this.container.getClassStoredValue('xGalleryLinkTarget');

          topImg.getElements('img').setStyle('cursor', 'pointer');
          topImg.addEvent('click', function (event) {
            event.stop();
            if (linkTarget == '_blank') {
              window.open(linkHref);
            } else {
              window.location = linkHref;
            }
          });
        } else {
          this.loadNext();
        }
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
      }
    }
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

        this.preload = new Element('div', {
          'class': 'xGalleryItem xGalleryItemType-image xImgIndex-' + this.xImgIndex
        }).adopt(this.preload);

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
      var topImg = this.imageContainer.getFirst('.xGalleryItem');
      var bottomImg = this.imageContainer.getLast('.xGalleryItem');

      var linkHref = this.container.getClassStoredValue('xGalleryLinkAddress');
      var linkTarget = this.container.getClassStoredValue('xGalleryLinkTarget');

      bottomImg.setStyle('display', 'none');
      bottomImg.getElements('img').setStyle('cursor', 'pointer');
      topImg.addEvent('mouseenter', function (event) {
        event.stop();
        topImg.setStyle('display', 'none');
        bottomImg.setStyle('display', '');
      });
      bottomImg.addEvent('mouseleave', function (event) {
        event.stop();
        bottomImg.setStyle('display', 'none');
        topImg.setStyle('display', '');
      });

      bottomImg.addEvent('click', function (event) {
        event.stop();
        if (linkTarget == '_blank') {
          window.open(linkHref);
        } else {
          window.location = linkHref;
        }
      });
    }
  }
});
