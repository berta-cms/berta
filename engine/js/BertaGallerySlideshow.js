var BertaGallerySlideshow = new Class({

  options: {},
  container: null,
  imageContainer: null,
  gallerySwiper: null,
  navContainer: null,

  initialize: function (container) {
    this.container = container;
    this.is_mobile_device = window.BertaHelpers.isMobile();
    if (container.hasClass('xInitialized')) {
      return;
    }
    container.addClass('xInitialized');
    if (this.is_mobile_device) {
      container.addClass('bt-is-mobile-device');
    }

    this.initOptions();
    this.attach();
    this.loadFirst();
  },

  initOptions: function () {
    this.options = {
      fullscreen: this.container.get('data-fullscreen') !== null,
      autoplay: parseInt(this.container.get('data-autoplay'), 10),
      asRowGallery: this.container.get('data-as-row-gallery'),
      swiperOptions: {
        loop: this.container.get('data-loop'),
      }
    };
  },

  attach: function () {
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

      if (this.options.fullscreen || this.getNext()) {
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
        if (this.options.asRowGallery) {
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
          loop: this.options.swiperOptions.loop,
          centeredSlides: this.options.asRowGallery,
          slidesPerView: this.options.asRowGallery ? 'auto' : 1,
          spaceBetween: this.options.asRowGallery ? 10 : 0,
          autoHeight: true,
          effect: this.options.asRowGallery ? 'slide' : 'fade',
          mousewheel: this.options.asRowGallery ? {
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

        if (this.options.autoplay) {
          swiperOptions['autoplay'] = {
            delay: this.options.autoplay * 1000
          };
        }

        this.gallerySwiper = new Swiper(swiperEl, swiperOptions);

        this.gallerySwiper.on('init', function () {
          this.imageContainer.querySelectorAll('.xGalleryItem').forEach(function (galleryItem, i) {

            if (!(this.options.asRowGallery || this.options.fullscreen)) {
              return;
            }

            if (this.options.fullscreen) {
              galleryItem.style.cursor = 'pointer';
            }

            galleryItem.addEventListener('click', function () {
              // Row gallery slideshow fallback prev/next navigation
              // for partly visible slides
              if (this.options.asRowGallery) {
                var isNextEl = galleryItem.parentNode.classList.contains('swiper-slide-next');
                if (isNextEl) {
                  this.gallerySwiper.slideNext();
                  return;
                }

                var isPrevEl = galleryItem.parentNode.classList.contains('swiper-slide-prev');
                if (isPrevEl) {
                  this.gallerySwiper.slidePrev();
                  return;
                }
              }

              if (galleryItem.classList.contains('xGalleryItemType-video')) {
                return;
              }

              var index = this.gallerySwiper.params.loop ? parseInt(galleryItem.parentNode.getAttribute('data-swiper-slide-index'), 10) : i;
              BertaGalleryFullscreen(this.container, index);

            }.bind(this));
          }, this);

          swiperEl.querySelectorAll('.swiper-slide').forEach(function (slide, i) {
            var video = slide.querySelector('video');
            if (video) {
              videos[i] = video;
              video.addEventListener('loadeddata', function reloadSwiper(e) {
                this.gallerySwiper.update();
                e.target.removeEventListener(e.type, reloadSwiper);
              }.bind(this), false);
            }
          }, this);

          if (videos[this.gallerySwiper.activeIndex]) {
            loadVideo(videos[this.gallerySwiper.activeIndex]);
          }
        }.bind(this));

        this.gallerySwiper.on('init slideChange resize', function () {
          var gallerySwiper = this;

          if (!gallerySwiper.slides.length) {
            return;
          }
          var slide = gallerySwiper.slides[gallerySwiper.activeIndex];
          var isImageSlide = slide.querySelector('.xGalleryItemType-image') !== null;
          gallerySwiper.$el[0].setAttribute('data-slide-type', isImageSlide ? 'image' : 'video');
        });

        this.gallerySwiper.on('slideChange', function () {
          var gallerySwiper = this;
          if (videos[gallerySwiper.previousIndex]) {
            unLoadVideo(videos[gallerySwiper.previousIndex]);
          }

          if (videos[gallerySwiper.activeIndex]) {
            loadVideo(videos[gallerySwiper.activeIndex]);
          }

          nav_highlightItem(navContainer.querySelectorAll('li')[gallerySwiper.realIndex]);
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
