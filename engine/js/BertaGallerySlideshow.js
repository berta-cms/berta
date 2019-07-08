var BertaGallerySlideshow = new Class({

  Implements: Options,

  container: null,
  imageContainer: null,
  gallerySwiper: null,
  navContainer: null,
  isRowFallback: false,


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
  },

  attach: function (container) {
    this.container = container;
    var fallbackGallery = this.container.getPrevious();
    this.isRowFallback = fallbackGallery && fallbackGallery.hasClass('xGalleryType-row') ? true : false;
    this.fullscreen = this.container.getParent().getElement('div.xFullscreen') !== null;
    this.imageContainer = this.container.getElement('div.xGallery');
    this.navContainer = this.container.getElement('ul.xGalleryNav');

    if (this.navContainer && !this.navContainer.getElements('a').length) {
      this.navContainer = null;
    }
  },

  detach: function () {
    if (this.gallerySwiper) {
      this.gallerySwiper.destroy();
    }

    if (this.navContainer) {
      this.navContainer.getElements('a').each(function (item) {
        item.removeEvents('click');
      });
    }
    this.container = this.imageContainer = this.navContainer = null;
  },

  loadFirst: function () {
    if (this.navContainer) {
      var navContainer = this.navContainer;
      var nav_highlightItem = this.nav_highlightItem;
      var li = this.navContainer.getElement('li');
      this.nav_highlightItem(li);
      this.autoplay = parseInt(this.container.getClassStoredValue('xGalleryAutoPlay'), 10);

      if (this.fullscreen || this.getNext()) {
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
    this.gallerySwiper.slideTo(linkElement.getClassStoredValue('xImgIndex') - 1);
  },

  nav_highlightItem: function (liElement) {
    liElement.getParent().getChildren().removeClass('selected');
    liElement.addClass('selected');
  }
});