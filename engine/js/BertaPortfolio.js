var BertaPortfolio = new Class({

  Implements: Options,

  initialize: function (options) {
    this.setOptions(options);
    window.addEvent('domready', this.onDOMReady.bindWithEvent(this));
    window.addEventListener('addEntry',this.onAddPortfolio.bindWithEvent(this))
  },

  onAddPortfolio: function () {
    // after adding portfolio entry
    this.portfolioThumbnails()
  },

  onDOMReady: function () {
    this.portfolioThumbnails();
  },

  showEntry: function (entry) {
    entry.removeClass('xHidden');
    var galleries = entry.getElements('.xGalleryContainer');

    setTimeout(function () {
      galleries[0].each(function (item) {
        if (bertaGlobalOptions.environment == 'site') {
          berta.initGallery(item);
        } else {
          bertaEditor.initGallery(item);
        }
      });
    }, 500);
  },

  portfolioThumbnails: function () {
    var container = $$('.portfolioThumbnails');
    var entries = $$('.xEntry');
    that = this;

    if (container.length) {
      var links = container.getElements('a');

      $$(links).addEvent('click', function (event) {
        var target = $$(this.get('href'));
        entries.addClass('xHidden');
        that.showEntry(target);
      });
    }

    var hash = window.location.hash;
    if (hash.length) {
      var link = $$(hash);
      if (link.length) {
        this.showEntry(link);
      }
    }
  }
});

new BertaPortfolio();
