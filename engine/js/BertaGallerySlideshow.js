var BertaGallerySlideshow = new Class({

  container: null,
  imageContainer: null,
  gallerySwiper: null,
  navContainer: null,
  isRowFallback: false,

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
    var fallbackGallery = this.container.getPrevious();
    this.isRowFallback = fallbackGallery && fallbackGallery.hasClass('xGalleryType-row') ? true : false;
    this.fullscreen = this.container.get('data-fullscreen') !== null;
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

            BertaGalleryFullscreen(this.container, i);

          }.bindWithEvent(this));
        }, this);

        var swiperEl = this.imageContainer.getElement('.swiper-container');
        var videos = [];

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
          init: false,
          loop: bertaGlobalOptions.slideshowAutoRewind === 'yes' && !this.isRowFallback,
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
          }
        };

        if (this.autoplay) {
          swiperOptions['autoplay'] = {
            delay: this.autoplay * 1000
          };
        }

        this.gallerySwiper = new Swiper(swiperEl, swiperOptions);

        this.gallerySwiper.on('init', function () {
          swiperEl.getElements('.swiper-slide').each(function (slide, i) {
            var video = slide.getElement('video');
            if (video) {
              videos[i] = video;
              video.addEventListener('loadeddata', function reloadSwiper(e) {
                this.update();
                e.target.removeEventListener(e.type, reloadSwiper);
              }.bindWithEvent(this), false);
            }
          }, this);

          if (videos[this.activeIndex]) {
            loadVideo(videos[this.activeIndex]);
          }
        });

        this.gallerySwiper.on('init slideChange resize', function () {
          if (!this.slides.length) {
            return;
          }
          var slide = this.slides[this.activeIndex];
          var isImageSlide = slide.getElement('.xGalleryItemType-image') !== null;
          this.$el[0].setAttribute('data-slide-type', isImageSlide ? 'image' : 'video');
        });

        this.gallerySwiper.on('slideChange', function () {
          if (videos[this.previousIndex]) {
            unLoadVideo(videos[this.previousIndex]);
          }

          if (videos[this.activeIndex]) {
            loadVideo(videos[this.activeIndex]);
          }

          nav_highlightItem(navContainer.getElements('li')[this.realIndex]);
        });

        this.gallerySwiper.init();
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
    this.gallerySwiper.slideTo(parseInt(linkElement.getClassStoredValue('xImgIndex') - (this.gallerySwiper.params.loop ? 0 : 1), 10));
  },

  nav_highlightItem: function (liElement) {
    liElement.getParent().getChildren().removeClass('selected');
    liElement.addClass('selected');
  }
});
