var BertaGalleryRow = class {
  constructor(container) {
    this.is_mobile_device = window.BertaHelpers.isMobile();
    if (container.classList.contains('xInitialized')) {
      return;
    }
    container.classList.add('xInitialized');
    if (this.is_mobile_device) {
      container.classList.add('bt-is-mobile-device');
    }
    this.currentItem = 0;
    this.attach(container);
    this.loadFirst();
    window.addEventListener('resize', window.BertaHelpers.debounce(this.layout_update.bind(this), 200));
  }

  attach(container) {
    this.container = container;
    this.fullscreen = this.container.getAttribute('data-fullscreen') !== null;
    this.imageContainer = this.container.querySelector('div.xGallery');
    this.navContainer = this.container.querySelector('ul.xGalleryNav');
    this.galleryEditButton = this.imageContainer.querySelector('.xGalleryEditButton');

    var galleryLoader = this.imageContainer.querySelector('.loading');
    if (galleryLoader) {
      galleryLoader.remove();
    }

    this.loadedItems = this.container.querySelectorAll('.xGalleryItem').length;

    if (this.navContainer && this.navContainer.querySelectorAll('a').length > 0) {
      this.rowClearElement = window.BertaHelpers.createElement('br', {
        'class': 'clear'
      });
      this.imageContainer.append(this.rowClearElement);

      this.newObjectInjectWhere = bertaGlobalOptions.environment == 'site' ? this.rowClearElement : this.galleryEditButton;

    } else
      this.navContainer = null;
  }

  loadFirst() {
    if (this.navContainer) {
      var li = this.navContainer.querySelector('li');
      this.nav_highlightItem(li);
      var aEl = this.navContainer.querySelector('li a');
      this.loadItem(aEl, li, 1);
    }
  }

  loadNext() {
    if (this.navContainer) {
      var nextLi = this.getNext();
      if (nextLi) {
        this.nav_highlightItem(nextLi);
        var aEl = nextLi.querySelector('a');
        this.loadItem(aEl, nextLi, window.BertaHelpers.getClassStoredValue(aEl, 'xImgIndex'));
      } else {
        //after everything is loaded

        // attach fullscreen for gallery row mode
        if (this.fullscreen) {
          this.attachFullscreen();
        }

        // update gallery edit button width
        if (this.galleryEditButton) {
          this.galleryEditButton.style.width = this.imageContainer.scrollWidth + 'px';
        }
      }
    }
  }

  // Load the gallery item described by a navigation link
  loadItem(aEl, li, xImgIndex) {
    var getValue = function (varName) {
      return window.BertaHelpers.getClassStoredValue(aEl, varName);
    };

    this.load(aEl.getAttribute('href'), getValue('xType'), getValue('xW'), getValue('xH'), getValue('xVideoHref'), getValue('xAutoPlay'), li.querySelector('.xGalleryImageCaption').innerHTML, xImgIndex, aEl.getAttribute('data-srcset'));
  }

  attachFullscreen() {
    this.container.querySelectorAll('.xGalleryItem').forEach((item, i) => {
      if (item.classList.contains('xGalleryItemType-video')) {
        return;
      }

      item.style.cursor = 'pointer';
      item.addEventListener('click', () => {
        BertaGalleryFullscreen(this.container, i);
      });
    });
  }

  getNext() {
    var selectedLi = this.navContainer.querySelector('li.selected');
    return selectedLi ? selectedLi.nextElementSibling : null;
  }

  layout_update() {
    var rowGalleryPadding = this.imageContainer.getAttribute('xRowGalleryPadding');

    if (rowGalleryPadding) {
      Array.from(this.imageContainer.children).forEach(function (el) {
        el.style.padding = rowGalleryPadding;
      });
    }

    Array.from(this.imageContainer.children).forEach(function (item) {
      if (item.matches('.xGalleryItem') && window.BertaHelpers.getClassStoredValue(item, 'xGalleryItemType') != 'video') {
        item.style.height = 'auto';
      }
    });

    this.imageContainer.querySelectorAll('.xGalleryItem').forEach(function (item) {
      item.style.position = 'relative';
    });
  }

  layout_inject(currentItemIsLoaded) {
    if (!currentItemIsLoaded) {
      this.newObjectInjectWhere.before(this.preload);
      picturefill(this.preload.querySelector('img'));
    }

    this.layout_update();
  }

  nav_highlightItem(liElement) {
    Array.from(liElement.parentElement.children).forEach(function (sibling) {
      sibling.classList.remove('selected');
    });
    liElement.classList.add('selected');
  }

  load(src, mType, mWidth, mHeight, videoPath, autoPlay, caption, xImgIndex, srcset) {
    this.currentItem += 1;
    this.currentSrc = null;
    var currentItemIsLoaded = this.currentItem <= this.loadedItems;
    this.load_Render(src, mType, mWidth, mHeight, videoPath, autoPlay, caption, xImgIndex, srcset, currentItemIsLoaded);
  }

  load_Render(src, mType, mWidth, mHeight, videoPath, autoPlay, caption, xImgIndex, srcset, currentItemIsLoaded) {
    this.currentSrc = src;
    this.xImgIndex = xImgIndex;
    this.srcset = srcset ? srcset : null;

    switch (mType) {
      case 'image':
        if (!currentItemIsLoaded) {
          var altText = caption.replace(/(<([^>]+)>)/ig, ' ').replace(/(\r\n|\n|\r)/gm, ' ').replace(/\s{2,}/g, ' ').trim();

          var image = window.BertaHelpers.createElement('img', {
            'width': mWidth,
            'height': mHeight,
            'srcset': this.srcset,
            'alt': altText,
            'src': src
          });

          this.preload = window.BertaHelpers.createElement('div', {
            'class': 'xGalleryItem xGalleryItemType-image xImgIndex-' + this.xImgIndex
          });
          this.preload.append(image);

          this.preload.append(window.BertaHelpers.createElement('div', {
            'class': 'xGalleryImageCaption'
          }, caption));
        }

        this.load_Finish(src, mType, currentItemIsLoaded);
        break;

      case 'video':

        if (currentItemIsLoaded) {
          this.preload = this.imageContainer.children[this.currentItem - 1].querySelector('video');

        } else {
          this.preload = window.BertaHelpers.createElement('video', {
            'width': mWidth,
            'class': 'xGalleryItem xGalleryItemType-video',
            'controls': true,
            'controlsList': 'nodownload',
            'poster': src && src.charAt(0) !== '#' ? src : null,
          });

          var videoType = videoPath.split('.').pop();

          this.preload.prepend(window.BertaHelpers.createElement('source', {
            'src': videoPath,
            'type': 'video/' + videoType
          }));

          this.layout_inject(currentItemIsLoaded);
          this.preload.style.position = 'absolute';

          this.preload.append(window.BertaHelpers.createElement('div', {
            'class': 'xGalleryImageCaption'
          }, caption));
        }

        if (autoPlay > 0) {
          this.preload.muted = true;
          this.preload.play();
        }

        this.load_Finish(src, mType, currentItemIsLoaded);
        break;
    }
  }

  load_Finish(src, mType, currentItemIsLoaded) {
    // test if the loaded image's src is the last invoked image's src
    if (src == this.currentSrc) {
      if (mType == 'image') {
        this.layout_inject(currentItemIsLoaded);
      }

      this.layout_update();
      this.loadNext();
    }
  }
};
