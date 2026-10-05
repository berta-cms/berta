var BertaPortfolio = class {
  constructor() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', this.onDOMReady.bind(this));
    } else {
      this.onDOMReady();
    }
    window.addEventListener('addEntry', this.onAddPortfolio.bind(this));
  }

  onAddPortfolio() {
    // after adding portfolio entry
    this.portfolioThumbnails();
  }

  onDOMReady() {
    this.portfolioThumbnails();
  }

  showEntry(entry) {
    entry.classList.remove('xHidden');
    var galleries = entry.querySelectorAll('.xGalleryContainer');

    setTimeout(function () {
      galleries.forEach(function (item) {
        if (bertaGlobalOptions.environment == 'site') {
          berta.initGallery(item);
        } else {
          bertaEditor.initGallery(item);
        }
      });
    }, 500);
  }

  // Portfolio links and URL hash point to an entry id: `#entry-slug`
  getEntryByHash(hash) {
    if (!hash || hash.charAt(0) !== '#') {
      return null;
    }
    return document.getElementById(hash.slice(1));
  }

  portfolioThumbnails() {
    document.querySelectorAll('.portfolioThumbnails a').forEach((link) => {
      // runs again after every addEntry, links that weren't re-rendered already have a listener
      if (link.dataset.portfolioListener) {
        return;
      }
      link.dataset.portfolioListener = 'true';

      link.addEventListener('click', () => {
        var target = this.getEntryByHash(link.getAttribute('href'));
        document.querySelectorAll('.xEntry').forEach(function (entry) {
          entry.classList.add('xHidden');
        });
        if (target) {
          this.showEntry(target);
        }
      });
    });

    var entry = this.getEntryByHash(window.location.hash);
    if (entry) {
      this.showEntry(entry);
    }
  }
};

new BertaPortfolio();
