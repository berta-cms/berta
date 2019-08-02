var BertaGalleryFullscreen = function (galleryEl, slideIndex) {
  var slides = [];

  var items = galleryEl.querySelectorAll('.xGalleryItem');
  var isLoopSlideshow = galleryEl.querySelector('[data-swiper-slide-index]') !== null;

  galleryEl.querySelectorAll('.xGalleryNav a').forEach(function (item, i) {
    var slide;
    var isImageSlide = item.classList.contains('xType-image');

    if (isImageSlide) {
      slide = {
        originalImage: {
          src: item.getAttribute('data-original-src'),
          w: parseInt(item.getAttribute('data-original-width'), 10),
          h: parseInt(item.getAttribute('data-original-height'), 10),
        },
        mobileImage: {
          src: item.getAttribute('data-mobile-src'),
          w: parseInt(item.getAttribute('data-mobile-width'), 10),
          h: parseInt(item.getAttribute('data-mobile-height'), 10)
        },
        title: item.getAttribute('data-caption'),
      };

    // Video slide
    } else {
      slide = {
        html: items[i + (isLoopSlideshow ? 1 : 0)].outerHTML
      };
    }

    slides.push(slide);
  });

  var options = {
    loop: bertaGlobalOptions.slideshowAutoRewind === 'yes',
    index: slideIndex,
    counterEl: bertaGlobalOptions.galleryFullScreenImageNumbers === 'yes',
    history: false,
    clickToCloseNonZoomable: false,
    shareButtons: [
      {id:'facebook', label:'Share on Facebook', url:'https://www.facebook.com/sharer/sharer.php?u={{url}}'},
      {id:'twitter', label:'Tweet', url:'https://twitter.com/intent/tweet?text={{text}}&url={{url}}'},
      {id:'pinterest', label:'Pin it', url:'http://www.pinterest.com/pin/create/button/?url={{url}}&media={{image_url}}&description={{text}}'}
    ]
  };

  var pswpElement = document.querySelectorAll('.pswp')[0];
  // create variable that will store real size of viewport
  var realViewportWidth, useLargeImages = false, firstResize = true, imageSrcWillChange;

  var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, slides, options);

  // beforeResize event fires each time size of gallery viewport updates
  gallery.listen('beforeResize', function () {
    // gallery.viewportSize.x - width of PhotoSwipe viewport
    // gallery.viewportSize.y - height of PhotoSwipe viewport
    // window.devicePixelRatio - ratio between physical pixels and device independent pixels (Number)
    //                          1 (regular display), 2 (@2x, retina) ...


    // calculate real pixels when size changes
    realViewportWidth = gallery.viewportSize.x * window.devicePixelRatio;

    // Code below is needed if you want image to switch dynamically on window.resize

    // Find out if current images need to be changed
    if (useLargeImages && realViewportWidth < 425) {
      useLargeImages = false;
      imageSrcWillChange = true;
    } else if (!useLargeImages && realViewportWidth >= 425) {
      useLargeImages = true;
      imageSrcWillChange = true;
    }

    // Invalidate items only when source is changed and when it's not the first update
    if (imageSrcWillChange && !firstResize) {
      // invalidateCurrItems sets a flag on slides that are in DOM,
      // which will force update of content (image) on window.resize.
      gallery.invalidateCurrItems();
    }

    if (firstResize) {
      firstResize = false;
    }

    imageSrcWillChange = false;
  });


  // gettingData event fires each time PhotoSwipe retrieves image source & size
  gallery.listen('gettingData', function(_, item) {
    if (item.html) {
      return;
    }

    // Set image source & size based on real viewport width
    if( useLargeImages ) {
      item.src = item.originalImage.src;
      item.w = item.originalImage.w;
      item.h = item.originalImage.h;
    } else {
      item.src = item.mobileImage.src;
      item.w = item.mobileImage.w;
      item.h = item.mobileImage.h;
    }
  });

  gallery.init();

  var pauseAllVideos = function () {
    pswpElement.querySelectorAll('video').forEach(function (video) {
      video.pause();
    });
  };

  gallery.listen('beforeChange', pauseAllVideos);
  gallery.listen('close', pauseAllVideos);
};
