var BertaGalleryFullscreen = function (galleryEl, slideIndex) {
  var slides = [];

  var parseSlides = function () {
    galleryEl.querySelectorAll('.xGalleryItem').forEach(function (item) {
      var slide;
      var isImageSlide = item.classList.contains('xGalleryItemType-image');

      if (isImageSlide) {
        var imageEl = item.querySelector('img');

        // @TODO get original image src, width and height
        slide = {
          src: imageEl.getAttribute('src'),
          w: parseInt(imageEl.getAttribute('width'), 10),
          h: parseInt(imageEl.getAttribute('height'), 10),
          title: imageEl.getAttribute('alt')
        };

        // Video slide
      } else {
        var html = item.tagName === 'VIDEO' ? item.outerHTML : item.innerHTML;

        slide = {
          html: html
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
  var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, slides, options);
  gallery.init();
};
