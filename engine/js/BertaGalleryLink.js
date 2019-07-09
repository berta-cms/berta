var BertaGalleryLink = new Class({

  Implements: Options,

  options: {
    fullscreen: null,
    galleryFullScreenImageBorders: 'yes',
    type: 'slideshow',
    engineRoot: null,
    engineABSRoot: null,
    playerType: 'JWPlayer'
  },

  type: 'slideshow',
  time: 0,
  interval: null,

  container: null,
  imageContainer: null,
  gallerySwiper: null,
  navContainer: null,
  rowClearElement: null,

  newObjectInjectWhere: null,
  newObjectInjectPosition: null,

  currentSrc: null,
  currentType: null,
  currentVideoPath: null,
  preload: null,
  phase: null,
  loadTimer: null,

  imageFadeOutFx: null,
  imageResizeFx: null,
  imageShowFx: null,

  numFinishedLoading: 0,

  isResponsive: false,
  isAutoResponsive: false,
  isRowFallback: false,
  mobileBrekapoint: 768,

  initialize: function (container, options) {
    this.is_mobile_device = window.BertaHelpers.isMobile();
    if (container.hasClass('xInitialized')) {
      return;
    }
    container.addClass('xInitialized');
    if (this.is_mobile_device) {
      container.addClass('bt-is-mobile-device');
    }
    this.setOptions(options);
    this.attach(container);
    this.loadFirst();
    window.addEvent('resize', window.BertaHelpers.debounce(this.layout_update.bindWithEvent(this), 200));
  },

  attach: function (container) {
    this.container = container;
    this.isResponsive = $$('.xResponsive').length > 0;
    this.isAutoResponsive = $$('.bt-auto-responsive').length > 0;
    var fallbackGallery = this.container.getPrevious();
    this.isRowFallback = fallbackGallery && fallbackGallery.hasClass('xGalleryType-row') ? true : false;
    this.type = this.container.getClassStoredValue('xGalleryType');
    this.fullscreen = this.container.getParent().getElement('div.xFullscreen') !== null;
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

      if (this.type == 'slideshow') {
        this.imageResizeFx = new Fx.Morph(this.imageContainer, {
          duration: 'short',
          transition: Fx.Transitions.Sine.easeInOut
        });

        this.newObjectInjectWhere = this.options.environment == 'site' ? this.imageContainer : this.imageContainer.getElement('.xGalleryEditButton');
        this.newObjectInjectPosition = this.options.environment == 'site' ? 'bottom' : 'before';
      } else if (this.type == 'link') {
        this.newObjectInjectWhere = this.options.environment == 'site' ? this.imageContainer : this.imageContainer.getElement('.xGalleryEditButton');
        this.newObjectInjectPosition = this.options.environment == 'site' ? 'bottom' : 'before';
      } else {
        this.rowClearElement = new Element('br', {
          'class': 'clear'
        }).inject(this.imageContainer);

        this.newObjectInjectWhere = this.options.environment == 'site' ? this.rowClearElement : this.imageContainer.getElement('.xGalleryEditButton');
        this.newObjectInjectPosition = 'before';
      }
    } else
      this.navContainer = null;
  },

  detach: function () {
    if (this.gallerySwiper) {
      this.gallerySwiper.destroy();
    }

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



  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////| Loading  |////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  loadFirst: function () {
    if (this.navContainer) {
      var navContainer = this.navContainer;
      var nav_highlightItem = this.nav_highlightItem;
      var li = this.navContainer.getElement('li');
      this.nav_highlightItem(li);
      var aEl = this.navContainer.getElement('li a');
      var fistItemType = aEl.getClassStoredValue('xType');
      this.autoplay = parseInt(this.container.getClassStoredValue('xGalleryAutoPlay'), 10);

      if (this.type !== 'slideshow' && (fistItemType != 'image' || (fistItemType == 'image' && this.type == 'row'))) {
        // load only if not image, because if that's image, it's already written in the HTML
        this.load(aEl.get('href'), aEl.getClassStoredValue('xType'), aEl.getClassStoredValue('xW'), aEl.getClassStoredValue('xH'), aEl.getClassStoredValue('xVideoHref'), aEl.getClassStoredValue('xAutoPlay'), li.getElement('.xGalleryImageCaption').get('html'), true, 1, aEl.get('data-srcset'));
      } else {
        this.currentSrc = aEl.get('href');
        this.preload = this.imageContainer.getElement('div.xGalleryItem');

        if ((this.fullscreen || this.getNext()) && this.type == 'slideshow') {
          var galleryId = this.container.getParent().getClassStoredValue('xEntryId');
          this.imageContainer.getElements('.xGalleryItem').each(function (galleryItem, i) {
            if (!(this.isRowFallback || this.fullscreen)) {
              return;
            }

            if (this.fullscreen) {
              galleryItem.setStyle('cursor', 'pointer');
            }

            galleryItem.addEvent('click', function () {
              // Row gallery slideshow fallback prev/next navigation
              // for partly visible slides
              if (this.isRowFallback) {
                var isNextEl = galleryItem.getParent('.swiper-slide-next');
                if (isNextEl) {
                  this.gallerySwiper.slideNext();
                  return;
                }

                var isPrevEl = galleryItem.getParent('.swiper-slide-prev');
                if (isPrevEl) {
                  this.gallerySwiper.slidePrev();
                  return;
                }
              }

              if (galleryItem.hasClass('xGalleryItemType-video')) {
                return;
              }

              milkbox.showGallery({
                gallery: 'gallery-' + galleryId,
                index: i
              });
            }.bindWithEvent(this));
          }, this);

          var swiperEl = this.imageContainer.getElement('.swiper-container');
          var videos = [];

          swiperEl.getElements('.swiper-slide').each(function (slide, i) {
            var video = slide.getElement('video');
            if (video) {
              videos[i] = video;
              video.addEventListener('loadeddata', function reloadSwiper(e) {
                this.gallerySwiper.update();
                e.target.removeEventListener(e.type, reloadSwiper);
              }.bindWithEvent(this), false);
            }
          }, this);

          var loadVideo = function (video) {
            if (video.data('autoplay')) {
              video.muted = true;
              video.play();
            }
          };

          var unLoadVideo = function (video) {
            video.pause();
          };

          // Make gallery fit the screen in width for row gallery slideshow fallback
          if (this.isRowFallback) {
            var galleryWrapper = this.container.getFirst();
            galleryWrapper.setStyle('width', '100vw');
            var setFullWidth = function () {
              var galleryPosition = this.container.getBoundingClientRect();
              galleryWrapper.setStyle('margin-left', -galleryPosition.left);
            }.bindWithEvent(this);
            setFullWidth();
            window.addEvent('resize', window.BertaHelpers.debounce(setFullWidth.bindWithEvent(this), 300));
          }

          var swiperOptions = {
            centeredSlides: this.isRowFallback,
            slidesPerView: this.isRowFallback ? 'auto' : 1,
            spaceBetween: this.isRowFallback ? 10 : 0,
            autoHeight: true,
            effect: this.isRowFallback ? 'slide' : 'fade',
            mousewheel: this.isRowFallback ? {
              releaseOnEdges: true
            } : false,
            fadeEffect: {
              crossFade: true
            },
            navigation: {
              nextEl: swiperEl.getElement('.swiper-button-next'),
              prevEl: swiperEl.getElement('.swiper-button-prev')
            },
            on: {
              init: function () {
                if (videos[this.activeIndex]) {
                  loadVideo(videos[this.activeIndex]);
                }
              },
              slideChange: function () {
                if (videos[this.previousIndex]) {
                  unLoadVideo(videos[this.previousIndex]);
                }

                if (videos[this.activeIndex]) {
                  loadVideo(videos[this.activeIndex]);
                }

                nav_highlightItem(navContainer.getElements('li')[this.activeIndex]);
              }
            }
          };

          if (this.autoplay) {
            swiperOptions['autoplay'] = {
              delay: this.autoplay * 1000
            };
          }

          this.gallerySwiper = new Swiper(swiperEl, swiperOptions);
          this.nav_setEvents();
        }

        if (this.type == 'link') {
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

        if (this.type == 'row' || this.type == 'pile' || this.type == 'column') {
          this.layout_update();
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
      } else {
        //after everything is loaded - attach fullscreen for gallery row mode
        if (this.fullscreen && (this.type == 'row' || this.type == 'pile' || this.type == 'column')) {
          this.attachRowFullscreen();
        }
      }
    }
  },

  //gallery row mode - fullscreen
  attachRowFullscreen: function () {
    this.container.getElements('.xGalleryItem:not(.xGalleryItemType-video)').each(function (item) {
      item.setStyle('cursor', 'pointer');
      item.addEvent('click', function () {
        var ImgIndex = this.getClassStoredValue('xImgIndex');
        var GalleryId = this.getParent('.xEntry').getClassStoredValue('xEntryId');

        milkbox.showGallery({
          gallery: 'gallery-' + GalleryId,
          index: ImgIndex - 1
        });
      });
    });
  },

  loadFullscreen: function () {
    var ImgIndex = this.preload.getClassStoredValue('xImgIndex');
    var GalleryId = this.container.getParent().getClassStoredValue('xEntryId');

    milkbox.showGallery({
      gallery: 'gallery-' + GalleryId,
      index: ImgIndex - 1
    });
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





  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////| Layout  |/////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  layout_update: function () {
    // implementable
    // in a template you can implement this function

    // this is a default implementation that assumes that "row" mode is horizontal
    if (this.type == 'row') {

      var rowGalleryPadding = this.imageContainer.get('xRowGalleryPadding');

      if (rowGalleryPadding) {
        this.imageContainer.getChildren().each(function (el) {
          el.setStyle('padding', rowGalleryPadding);
        });
      }

      var totalWidth = 0,
        itemWidth = 0,
        numImages = 0;
      this.imageContainer.getChildren('.xGalleryItem').each(function (item) {
        if (item.getClassStoredValue('xGalleryItemType') != 'video') {
          item.setStyle('height', 'auto');
        }
        itemWidth = parseInt(item.getStyle('width'), 10);
        itmMarginLeft = parseInt(0 + item.getStyle('margin-left'));
        itmMarginRight = parseInt(0 + item.getStyle('margin-right'));
        totalWidth += itemWidth + itmMarginLeft + itmMarginRight;
        numImages++;
      });

      this.imageContainer.setStyle('width', (totalWidth + numImages /* for "em" discrepancy */ ) + 'px');
      this.imageContainer.getElements('.xGalleryItem').setStyle('position', 'relative');

    } else if (this.type == 'pile') {
      var margin = 0;
      var totalHeight = 0,
        totalWidth = 0;
      if (!this.layout_pileOnHoverBinded) this.layout_pileOnHoverBinded = this.layout_pileOnHover.bindWithEvent(this);
      this.imageContainer.getChildren('.xGalleryItem').each(function (el) {
        totalHeight = Math.max(totalHeight, margin + parseInt(el.getStyle('height')));
        totalWidth = Math.max(totalWidth, margin + parseInt(el.getStyle('width')));
        el.setStyles({
          'left': margin + 'px',
          'top': margin + 'px'
        });
        el.addEvent('mouseover', this.layout_pileOnHoverBinded);

        margin += 30;
      }, this);

      this.imageContainer.setStyle('height', totalHeight + 'px');
      this.imageContainer.setStyle('width', totalWidth + 'px');
      this.imageContainer.getElements('.xGalleryItem').setStyle('position', 'absolute');
      this.layout_rowTotalHeight = totalHeight;
      this.layout_rowTotalWidth = totalWidth;
    } else if (this.type == 'column') {

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
    }

    if (typeof (messyMess) == 'object') {
      messyMess.copyrightStickToBottom();
    }
  },

  layout_pileOnHover: bertaGlobalOptions.environment == 'site' ? function (event) {
    event.stop();
    var target = $(event.target);
    if (!target.hasClass('xGalleryItem')) target = target.getParent('.xGalleryItem');
    if (target) {
      var imElements = this.imageContainer.getChildren('.xGalleryItem');
      var z = 1000,
        zPlus = 200,
        numElements = imElements.length;
      this.imageContainer.getChildren('.xGalleryItem').each(function (el, idx) {

        // set correct z-index
        zSignChange = false;
        el.setStyle('z-index', z);
        if (el == target) {
          zPlus = -199;
          zSignChange = true;
        }
        z += zPlus;

      }, this);

    }
  } : $empty,


  layout_inject: function (bDeleteExisting, bDoContainerFade) {

    if (bDeleteExisting) this.imageContainer.getChildren('.xGalleryItem').destroy();

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

  layout_finisage: function (src, mType, mWidth, mHeight) {
    if (mType == 'image') {
      if (this.fullscreen || this.getNext(this.options.slideshowAutoRewind == 'yes')) {
        this.preload.setStyle('cursor', 'pointer');
        this.preload.addEvent('click', this.layout_onImageClick.bindWithEvent(this));
      }
    }
  },

  layout_onImageClick: function (event) {
    if (this.fullscreen) {
      this.loadFullscreen();
    } else {
      if (this.interval) {
        clearTimeout(this.interval);
      }
      this.loadNext(this.options.slideshowAutoRewind == 'yes');
    }
  },




  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////| Navigation  |/////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  nav_setEvents: function () {
    // implementable in the future
    this.navContainer.getElements('a').addEvent('click', this.nav_onItemClick.bindWithEvent(this));
  },

  nav_onItemClick: function (event) {
    // implementable in the future
    if (event.event) {
      event.stop();
    }
    if (this.interval) {
      clearTimeout(this.interval);
    }
    var linkElement = $(event.target);
    if (linkElement.tagName != 'A') linkElement = linkElement.getParent('a');

    var li = linkElement.getParent('li');
    this.nav_highlightItem(li);
    this.gallerySwiper.slideTo(linkElement.getClassStoredValue('xImgIndex') - 1);
  },
  nav_highlightItem: function (liElement) {
    liElement.getParent().getChildren().removeClass('selected');
    liElement.addClass('selected');
  },








  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////| Loading engine  |/////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // load: starts the actual loading of next image/video into the container

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

    if (this.currentSrc && this.type == 'slideshow') {
      this.currentSrc = null;
      this.phase = 'fadeout';
      this.imageFadeOutFx.start('opacity', 0).chain(this.load_Render.bind(this, [src, mType, mWidth, mHeight, videoPath, autoPlay, caption, bDeleteExisting, xImgIndex, srcset]));
    } else {
      this.currentSrc = null;
      this.load_Render(src, mType, mWidth, mHeight, videoPath, autoPlay, caption, bDeleteExisting, xImgIndex, srcset);
    }
  },

  load_Render: function (src, mType, mWidth, mHeight, videoPath, autoPlay, caption, bDeleteExisting, xImgIndex, srcset) {

    this.currentSrc = src;
    this.currentType = mType;
    this.currentVideoPath = videoPath;
    this.currentVideoAutoPlay = autoPlay;
    this.currentCaption = caption;
    this.xImgIndex = xImgIndex;
    this.srcset = srcset ? srcset : null;

    if (this.type == 'slideshow') {
      var obj;
      if (obj = this.imageContainer.getElement('div.xGalleryItem')) {
        obj.destroy();
      }
    }

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
        this.preload = new Asset.image(src, this.type == 'slideshow' ? {
          'width': mWidth,
          'height': mHeight,
          'srcset': this.srcset,
          'alt': altText,
          'onload': this.load_Finish.bind(this, [src, mType, mWidth, mHeight, bDeleteExisting])
        } : {
          'width': mWidth,
          'height': mHeight,
          'srcset': this.srcset,
          'alt': altText
        });

        this.preload = new Element('div', {
          'class': 'image'
        }).adopt(this.preload);
        if (this.type == 'row' || this.type == 'pile' || this.type == 'column') {
          if (mWidth) this.preload.setStyle('width', mWidth + 'px');
          if (mHeight) this.preload.setStyle('height', mHeight + 'px');
        }

        this.preload = new Element('div', {
          'class': 'xGalleryItem xGalleryItemType-image xImgIndex-' + this.xImgIndex
        }).adopt(this.preload);
        if (this.type == 'row' || this.type == 'pile' || this.type == 'column') {
          if (mWidth) this.preload.setStyle('width', mWidth + 'px');
          if (mHeight) this.preload.setStyle('height', mHeight + 'px');
        }

        new Element('div', {
          'class': 'xGalleryImageCaption'
        }).set('html', caption).inject(this.preload);

        if (this.type != 'slideshow') this.load_Finish(src, mType, mWidth, mHeight, bDeleteExisting);

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

    var obj = this;

    // test if the loaded image's src is the last invoked image's src
    if (src == this.currentSrc) {
      if (this.type == 'slideshow') {

        clearTimeout(this.loadTimer);

        var loader = obj.imageContainer.getNext('.loader');
        if (loader) {
          loader.addClass('xHidden');
        }

        this.phase = 'fadein';
        this.imageResizeFx.start({
          'width': mWidth,
          'height': mHeight
        }).chain(function () {
          this.phase = 'done';
          if (mType == 'image') this.layout_inject(bDeleteExisting, true);

          this.layout_finisage(src, mType, mWidth, mHeight);

          if (this.interval) {
            this.interval = setTimeout(function () {
              obj.loadNext(true);
            }, this.time);
          }
        }.bind(this));

      } else if (this.type == 'link') {
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
      } else {
        this.phase = 'done';

        if (mType == 'image') this.layout_inject(bDeleteExisting, false);

        this.layout_update();
        this.loadNext();
      }
    }
  }

});
