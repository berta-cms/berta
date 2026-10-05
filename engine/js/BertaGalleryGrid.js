var BertaGalleryGrid = class {
  constructor(container) {
    if (container.classList.contains('xInitialized')) {
      return;
    }
    container.classList.add('xInitialized');
    this.attach(container);
    this.layout_update();

    if (this.fullscreen) {
      this.attachFullscreen();
    }

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

  getColumnCount() {
    if (!this.imageContainer) {
      return 1;
    }

    var width = window.innerWidth;

    if (width >= 1200) {
      return this.imageContainer.getAttribute('xGridColumnsLarge') || 3;
    } else if (width >= 768) {
      return this.imageContainer.getAttribute('xGridColumnsDesktop') || 2;
    }

    return this.imageContainer.getAttribute('xGridColumnsMobile') || 1;
  }

  layout_update() {
    if (!this.imageContainer) {
      return;
    }

    var columns = this.getColumnCount();
    this.imageContainer.style.gridTemplateColumns = 'repeat(' + columns + ', 1fr)';

    var gridGap = this.imageContainer.getAttribute('xGridGap');
    if (gridGap) {
      this.imageContainer.style.gap = gridGap;
    }
  }
};
