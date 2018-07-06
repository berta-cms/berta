window.Berta = window.Berta || {};
window.Berta.Engine = (function (Fx, Cookie) {

  return {
    /**
     * Initialize top menu hiding, showing, animations and URL updating according to site.
     *
     * @param {HTMLElement} topPanelContainer - container element of the top menu
     * @return {object} - Object with menu control functions (show, hide, slideIn, slideOut, setSiteInURLs).
     */
    initTopMenu: function (topPanelContainer) {
      var fxOut, fxIn;
      var topPanel = topPanelContainer.querySelector('#xTopPanel'),
          slideOutButton = topPanelContainer.querySelector('#xTopPanelSlideOut'),
          slideInButton = topPanelContainer.querySelector('#xTopPanelSlideIn'),
          newsTrackerContainer = topPanelContainer.querySelector('#xNewsTickerContainer');

      if (!topPanelContainer) {
        console.error('Top menu not found!');
        return;
      }

      if (!Fx) {
        console.warn('MooTools animations not available!');
        fxOut = fxIn = null;
      } else {
        fxOut = new Fx.Tween(topPanel),
        fxIn = new Fx.Tween(slideInButton);
      }

      /* Hide / Show top menu when arrow clicked */
      function slideOut () {
        if (newsTrackerContainer) {
          newsTrackerContainer.style.display = 'none';
        }

        if (fxOut && fxIn) {
          fxOut.start('top', -19).chain(function() {
            fxIn.start('top', 0);
          });
        }
        else {
          topPanel.style.display = 'none';
        }
      }
      slideOutButton.addEventListener('click', slideOut);

      function slideIn() {
        if (fxOut && fxIn) {
          fxIn.start('top', -19).chain(function() {
            fxOut.start('top', 0);
          });
        }
        else {
          topPanel.style.display = '';
        }
      }
      slideInButton.addEventListener('click', slideIn);

      /* Return an object with menu functionality */
      return {
        hide: function () {
          topPanelContainer.style.display = 'none';
        },

        show: function () {
          topPanelContainer.style.display = '';
        },

        slideOut: slideOut,
        slideIn: slideIn,

        setSiteInURLs: (function () {
          function setSiteInQueryString(site, qString) {
            if (site && !qString) {
              return '?site=' + window.encodeURIComponent(site);
            }
            if (site && /site=/.test(qString)) {
              return qString.replace(/site=.*&?/, 'site=' + window.encodeURIComponent(site));
            }
            if (!site && /site=/.test(qString)) {
              return qString.replace(/(\?|&)site=.*&?/, '');
            }
            if (site) {
              return qString + '&site=' + window.encodeURIComponent(site);
            }
            return qString;
          }

          return function (site) {
            var menu = topPanelContainer.querySelector('#xEditorMenu');
            var i, link, pathParts, locationName, windowQuery;

            if (!(menu && menu.children.length)) {
              return;
            }
            for (i = 0; i < menu.children.length; i++) {
              link = menu.children[i].querySelector('a');
              if (!link) {
                continue;
              }
              pathParts = link.pathname.split('/');
              locationName = pathParts[pathParts.length - 1] ?
                pathParts[pathParts.length - 1].replace('.php', '') :
                (pathParts[pathParts.length - 2] || '').replace('.php', '');

              if (['engine', 'sections', 'settings', 'shopsettings', 'seo'].indexOf(locationName) !== -1) {
                link.search = setSiteInQueryString(site, link.search);
              }
            }

            windowQuery = setSiteInQueryString(site, window.location.search);
            if (windowQuery !== window.location.search) {
              window.history.replaceState && window.history.replaceState({}, '',
                window.location.origin + window.location.pathname + windowQuery);
            }
          };
        })()
      };
    },

    /**
     * Initialize the news and tips popup below the top navigation.
     * @param {HTMLElement} newsTickerContainer - HTML element which will contain the news and tips
     */
    initNewsTicker: function (newsTickerContainer) {
      if (!newsTickerContainer) {
        return;
      }

      function hideNewsTicker(newsTickerContainer) {
        if (newsTickerContainer.hasClass('xNewsTickerHidden')) {
          return;
        }
        newsTickerContainer.addClass('xNewsTickerHidden');

        new Fx.Slide(newsTickerContainer, {
          duration: 800,
          transition: Fx.Transitions.Quint.easeInOut
        }).show().slideOut();

        Cookie.write('_berta_newsticker_hidden', 1 /*,{ domain: window.location.host, path: window.location.pathname }*/ );
      }

      newsTickerContainer.getElement('a.close').addEvent('click', function (event) {
        event.stop();
        hideNewsTicker(newsTickerContainer);
      }.bind(this));

      setTimeout(function() {
        hideNewsTicker(newsTickerContainer);
      }, 7000);
    },

  };
})(window.Fx, window.Cookie);
