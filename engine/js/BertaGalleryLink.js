var BertaGalleryLink = new Class({
  container: null,

  initialize: function (container) {
    this.attach(container);
  },

  attach: function (container) {
    this.container = container;
  },

  detach: function () {
    this.container = null;
  }
});
