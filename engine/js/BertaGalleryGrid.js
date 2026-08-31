var BertaGalleryGrid = new Class({
  container: null,
  imageContainer: null,

  initialize: function (container) {
    if (container.hasClass('xInitialized')) {
      return;
    }
    container.addClass('xInitialized');
    this.attach(container);
    this.layout_update();

    if (this.fullscreen) {
      this.attachFullscreen();
    }

    window.addEvent('resize', window.BertaHelpers.debounce(this.layout_update.bindWithEvent(this), 200));
  },

  attach: function (container) {
    this.container = container;
    this.fullscreen = this.container.get('data-fullscreen') !== null;
    this.imageContainer = this.container.getElement('div.xGallery');
  },

  attachFullscreen: function () {
    var items = this.container.getElements('.xGalleryItem');
    items.each(function (item, i) {
      if (item.hasClass('xGalleryItemType-video')) {
        return;
      }

      item.setStyle('cursor', 'pointer');
      item.addEvent('click', function () {
        BertaGalleryFullscreen(this.container, i);
      }.bindWithEvent(this));
    }, this);
  },

  getColumnCount: function () {
    if (!this.imageContainer) {
      return 1;
    }

    var width = window.innerWidth;

    if (width >= 1200) {
      return this.imageContainer.get('xGridColumnsLarge') || 3;
    } else if (width >= 768) {
      return this.imageContainer.get('xGridColumnsDesktop') || 2;
    }

    return this.imageContainer.get('xGridColumnsMobile') || 1;
  },

  layout_update: function () {
    if (!this.imageContainer) {
      return;
    }

    var columns = this.getColumnCount();
    this.imageContainer.setStyle('grid-template-columns', 'repeat(' + columns + ', 1fr)');

    var gridGap = this.imageContainer.get('xGridGap');
    if (gridGap) {
      this.imageContainer.setStyle('gap', gridGap);
    }
  }
});
