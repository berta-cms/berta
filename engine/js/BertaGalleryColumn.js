var BertaGalleryColumn = class {
  constructor(container) {
    this.is_mobile_device = window.BertaHelpers.isMobile();
    if (container.classList.contains('xInitialized')) {
      return;
    }
    container.classList.add('xInitialized');
    if (this.is_mobile_device) {
      container.classList.add('bt-is-mobile-device');
    }
    // empty galleries render no images container
    if (!container.querySelector('div.xGallery')) {
      return;
    }
    this.attach(container);
    this.loadFirst();
    this.onResize = window.BertaHelpers.debounce(this.resize.bind(this), 200);
    window.addEventListener('resize', this.onResize);
  }

  resize() {
    // The gallery was removed from the page, e.g. the editor re-rendered the entries
    if (!this.container.isConnected) {
      window.removeEventListener('resize', this.onResize);
      return;
    }
    this.layout_update();
  }

  attach(container) {
    this.container = container;
    this.fullscreen = this.container.getAttribute('data-fullscreen') !== null;
    this.imageContainer = this.container.querySelector('div.xGallery');
    this.navContainer = this.container.querySelector('ul.xGalleryNav');

    if (this.navContainer && this.navContainer.querySelectorAll('a').length > 0) {
      this.rowClearElement = window.BertaHelpers.createElement('br', {
        'class': 'clear'
      });
      this.imageContainer.append(this.rowClearElement);

      this.newObjectInjectWhere = bertaGlobalOptions.environment == 'site' ? this.rowClearElement : this.imageContainer.querySelector('.xGalleryEditButton');

    } else {
      this.navContainer = null;
    }
  }

  loadFirst() {
    if (this.navContainer) {
      var li = this.navContainer.querySelector('li');
      this.nav_highlightItem(li);
      var aEl = this.navContainer.querySelector('li a');
      var fistItemType = window.BertaHelpers.getClassStoredValue(aEl, 'xType');

      if (fistItemType != 'image') {
        // load only if not image, because if that's image, it's already written in the HTML
        this.loadItem(aEl, li, true, 1);
      } else {
        this.currentSrc = aEl.getAttribute('href');
        this.preload = this.imageContainer.querySelector('div.xGalleryItem');

        this.layout_update();
        this.loadNext();
      }
    }
  }

  loadNext() {
    if (this.navContainer) {
      var nextLi = this.getNext();
      if (nextLi) {
        this.nav_highlightItem(nextLi);
        var aEl = nextLi.querySelector('a');
        this.loadItem(aEl, nextLi, false, window.BertaHelpers.getClassStoredValue(aEl, 'xImgIndex'));
      } else {
        if (this.fullscreen) {
          this.attachFullscreen();
        }
      }
    }
  }

  // Load the gallery item described by a navigation link
  loadItem(aEl, li, bDeleteExisting, xImgIndex) {
    var getValue = function (varName) {
      return window.BertaHelpers.getClassStoredValue(aEl, varName);
    };

    this.load(aEl.getAttribute('href'), getValue('xType'), getValue('xW'), getValue('xH'), getValue('xVideoHref'), getValue('xAutoPlay'), li.querySelector('.xGalleryImageCaption').innerHTML, bDeleteExisting, xImgIndex, aEl.getAttribute('data-srcset'));
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

  getGalleryItems() {
    return Array.from(this.imageContainer.children).filter(function (el) {
      return el.matches('.xGalleryItem');
    });
  }

  layout_update() {
    var totalHeight = 0,
      maxWidth = 0;
    this.getGalleryItems().forEach(function (item) {
      totalHeight += item.offsetHeight;
      if (item.offsetWidth > maxWidth) maxWidth = item.offsetWidth;
    });
    this.imageContainer.style.height = totalHeight + 'px';
    this.imageContainer.style.width = maxWidth + 'px';
    this.imageContainer.querySelectorAll('.xGalleryItem').forEach(function (item) {
      item.style.position = 'relative';
    });
  }

  layout_inject(bDeleteExisting, bDoContainerFade) {
    if (bDeleteExisting) {
      this.getGalleryItems().forEach(function (item) {
        item.remove();
      });
    }

    this.newObjectInjectWhere.before(this.preload);

    picturefill(this.preload.querySelector('img'));

    if (bDoContainerFade) {
      this.imageContainer.style.opacity = '1';
      this.imageContainer.style.visibility = 'visible';
    } else {
      // just fade in the newly added image
      window.BertaHelpers.fadeIn(this.preload);
    }

    this.layout_update();
  }

  nav_highlightItem(liElement) {
    Array.from(liElement.parentElement.children).forEach(function (sibling) {
      sibling.classList.remove('selected');
    });
    liElement.classList.add('selected');
  }

  load(src, mType, mWidth, mHeight, videoPath, autoPlay, caption, bDeleteExisting, xImgIndex, srcset) {
    this.currentSrc = src;
    this.xImgIndex = xImgIndex;
    this.srcset = srcset ? srcset : null;

    switch (mType) {
      case 'image':
        var altText = caption.replace(/(<([^>]+)>)/ig, ' ').replace(/(\r\n|\n|\r)/gm, ' ').replace(/\s{2,}/g, ' ').trim();
        var image = window.BertaHelpers.createElement('img', {
          'width': mWidth,
          'height': mHeight,
          'srcset': this.srcset,
          'alt': altText,
          'src': src
        });

        var imageWrapper = window.BertaHelpers.createElement('div', {
          'class': 'image'
        });
        imageWrapper.append(image);

        if (mWidth) imageWrapper.style.width = mWidth + 'px';
        if (mHeight) imageWrapper.style.height = mHeight + 'px';

        this.preload = window.BertaHelpers.createElement('div', {
          'class': 'xGalleryItem xGalleryItemType-image xImgIndex-' + this.xImgIndex
        });
        this.preload.append(imageWrapper);

        if (mWidth) this.preload.style.width = mWidth + 'px';
        if (mHeight) this.preload.style.height = mHeight + 'px';

        this.preload.append(window.BertaHelpers.createElement('div', {
          'class': 'xGalleryImageCaption'
        }, caption));

        this.load_Finish(src, mType, bDeleteExisting);
        break;

      case 'video':
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

        this.layout_inject(bDeleteExisting, true);
        this.preload.style.position = 'absolute';

        if (autoPlay > 0) {
          this.preload.muted = true;
          this.preload.play();
        }

        this.preload.append(window.BertaHelpers.createElement('div', {
          'class': 'xGalleryImageCaption'
        }, caption));

        this.load_Finish(src, mType, bDeleteExisting);
        break;
    }
  }

  load_Finish(src, mType, bDeleteExisting) {
    // test if the loaded image's src is the last invoked image's src
    if (src == this.currentSrc) {
      if (mType == 'image') this.layout_inject(bDeleteExisting, false);

      this.layout_update();
      this.loadNext();
    }
  }
};
