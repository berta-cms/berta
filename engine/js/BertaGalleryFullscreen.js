var BertaGalleryFullscreen = function (galleryEl, slideIndex) {
  var slides = [];

  var parseSlides = function () {
    var items = galleryEl.querySelectorAll('.xGalleryItem');

    galleryEl.querySelectorAll('.xGalleryNav a').forEach(function (item, i) {
      var slide;
      var isImageSlide = item.classList.contains('xType-image');

      if (isImageSlide) {
        slide = {
          src: item.getAttribute('data-original-src'),
          w: parseInt(item.getAttribute('data-original-width'), 10),
          h: parseInt(item.getAttribute('data-original-height'), 10),
          title: item.getAttribute('data-caption'),
        };

        // Video slide
      } else {
        slide = {
          html: items[i].outerHTML
        };
      }

      slides.push(slide);
    });
  };
  parseSlides();

  var options = {
    index: slideIndex
  };

  var pswpElement = document.querySelectorAll('.pswp')[0];
  var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, slides, options);
  gallery.init();

  var pauseAllVideos = function () {
    pswpElement.querySelectorAll('video').forEach(function (video) {
      video.pause();
    });
  };

  gallery.listen('beforeChange', pauseAllVideos);
  gallery.listen('close', pauseAllVideos);
};
