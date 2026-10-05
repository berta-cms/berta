var BertaGallerySlideshow = class {
  constructor(container) {
    this.container = container;
    this.is_mobile_device = window.BertaHelpers.isMobile();
    if (container.classList.contains('xInitialized')) {
      return;
    }
    container.classList.add('xInitialized');
    if (this.is_mobile_device) {
      container.classList.add('bt-is-mobile-device');
    }

    this.initOptions();
    this.attach();
    this.loadFirst();
  }

  initOptions() {
    // The editor renders data-loop="0" when loop is off, the site omits the attribute
    var loop = this.container.getAttribute('data-loop');

    this.options = {
      fullscreen: this.container.getAttribute('data-fullscreen') !== null,
      autoplay: parseInt(this.container.getAttribute('data-autoplay'), 10),
      asRowGallery: this.container.getAttribute('data-as-row-gallery'),
      swiperOptions: {
        loop: loop !== null && loop !== '0',
      }
    };
  }

  attach() {
    this.imageContainer = this.container.querySelector('div.xGallery');
    this.navContainer = this.container.querySelector('ul.xGalleryNav');

    if (this.navContainer && !this.navContainer.querySelectorAll('a').length) {
      this.navContainer = null;
    }
  }

  loadFirst() {
    if (this.navContainer) {
      var navContainer = this.navContainer;
      var nav_highlightItem = this.nav_highlightItem;
      var li = this.navContainer.querySelector('li');
      this.nav_highlightItem(li);

      if (this.options.fullscreen || this.getNext()) {
        var swiperEl = this.imageContainer.querySelector('.swiper');

        var loadVideo = function (video) {
          if (video.getAttribute('data-autoplay')) {
            video.muted = true;
            video.play();
          }
        };

        var unLoadVideo = function (video) {
          video.pause();
        };

        // Loop mode moves slides around in the DOM, so find videos through the currently active slide
        var updateVideos = function (gallerySwiper) {
          var activeSlide = gallerySwiper.slides[gallerySwiper.activeIndex];
          if (!activeSlide) {
            return;
          }

          swiperEl.querySelectorAll('video').forEach(function (video) {
            if (!activeSlide.contains(video)) {
              unLoadVideo(video);
            }
          });

          var activeVideo = activeSlide.querySelector('video');
          if (activeVideo) {
            loadVideo(activeVideo);
          }
        };

        // Make gallery fit the screen in width for row gallery slideshow fallback
        if (this.options.asRowGallery) {
          var galleryWrapper = this.container.firstElementChild;
          galleryWrapper.style.width = '100vw';
          var setFullWidth = () => {
            var galleryPosition = this.container.getBoundingClientRect();
            galleryWrapper.style.marginLeft = -galleryPosition.left + 'px';
          };
          setFullWidth();
          var onResize = window.BertaHelpers.debounce(() => {
            // The gallery was removed from the page, e.g. the editor re-rendered the entries
            if (!this.container.isConnected) {
              window.removeEventListener('resize', onResize);
              return;
            }
            setFullWidth();
          }, 300);
          window.addEventListener('resize', onResize);
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
            nextEl: swiperEl.querySelector('.swiper-button-next'),
            prevEl: swiperEl.querySelector('.swiper-button-prev'),
            addIcons: false
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

          swiperEl.querySelectorAll('video').forEach(function (video) {
            video.addEventListener('loadeddata', function reloadSwiper(e) {
              this.gallerySwiper.update();
              e.target.removeEventListener(e.type, reloadSwiper);
            }.bind(this), false);
          }, this);

          updateVideos(this.gallerySwiper);
        }.bind(this));

        this.gallerySwiper.on('init slideChange resize', function () {
          var gallerySwiper = this;

          if (!gallerySwiper.slides.length) {
            return;
          }
          var slide = gallerySwiper.slides[gallerySwiper.activeIndex];
          var isImageSlide = slide.querySelector('.xGalleryItemType-image') !== null;
          gallerySwiper.el.setAttribute('data-slide-type', isImageSlide ? 'image' : 'video');
        });

        this.gallerySwiper.on('slideChange', function () {
          var gallerySwiper = this;
          updateVideos(gallerySwiper);

          nav_highlightItem(navContainer.querySelectorAll('li')[gallerySwiper.realIndex]);
        });

        this.gallerySwiper.init();
        this.nav_setEvents();
      }
    }
  }

  getNext() {
    var selectedLi = this.navContainer.querySelector('li.selected');
    return selectedLi ? selectedLi.nextElementSibling : null;
  }

  nav_setEvents() {
    var onItemClick = this.nav_onItemClick.bind(this);
    this.navContainer.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', onItemClick);
    });
  }

  nav_onItemClick(event) {
    event.preventDefault();
    event.stopPropagation();

    var linkElement = event.target.closest('a');
    var li = linkElement.closest('li');
    this.nav_highlightItem(li);
    // slideToLoop takes the real slide index and also works when loop is off
    this.gallerySwiper.slideToLoop(parseInt(window.BertaHelpers.getClassStoredValue(linkElement, 'xImgIndex'), 10) - 1);
  }

  nav_highlightItem(liElement) {
    Array.from(liElement.parentElement.children).forEach(function (sibling) {
      sibling.classList.remove('selected');
    });
    liElement.classList.add('selected');
  }
};
