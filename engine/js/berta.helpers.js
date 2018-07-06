window.BertaHelpers = (function(introJs, bertaGlobalOptions) {
  var xTopPanelContainer, xBgEditorPanelTrigContainer;

  return {

    hideTopMenus: function() {
      xTopPanelContainer = xTopPanelContainer || document.querySelector('.xTopPanelContainer');
      xBgEditorPanelTrigContainer = xBgEditorPanelTrigContainer || document.querySelector('#xBgEditorPanelTrigContainer');

      if (window.parent) {
        window.parent.postMessage('menu:hide', '*');
      }
      else if (xTopPanelContainer) {
        xTopPanelContainer.style.display = 'none';
      }

      if (xBgEditorPanelTrigContainer) {
        xBgEditorPanelTrigContainer.style.display = 'none';
      }
    },

    showTopMenus: function() {
      xTopPanelContainer = xTopPanelContainer || document.querySelector('.xTopPanelContainer');
      xBgEditorPanelTrigContainer = xBgEditorPanelTrigContainer || document.querySelector('#xBgEditorPanelTrigContainer');

      if (window.parent) {
        window.parent.postMessage('menu:show', '*');
      }
      else if (xTopPanelContainer) {
        xTopPanelContainer.style.display = '';
      }

      if (xBgEditorPanelTrigContainer) {
        xBgEditorPanelTrigContainer.style.display = '';
      }
    },

    updateTopMenuSite: function (queryString) {
      var site = [queryString.replace('?', '')]
        .reduce(function(_, valueString) {
          return valueString.split('&');
        }, '')
        .filter(function(valueArrayItem) {
          return valueArrayItem.split('=')[0] == 'site';
        })
        .reduce(function(_, siteValueStr) {
          if (!siteValueStr) {
            return '';
          }
          return siteValueStr.split('=')[1];
        }, '');

      if (window.parent) {
        window.parent.postMessage('menu:set_site=' + site, '*');
      }
    },

    /**
     * Create and return setup tour object or undefined.
     *
     * @param {HTMLElement} topPanelContainer - the Top menu HTML element. We will be touring it.
     * @param {string} updateUrl - URL where we send updates after tour is done.
     */
    initTour: function(topPanelContainer, updateUrl) {
      if (!topPanelContainer) {
        return;
      }
      if (!Cookie.read('_berta_videos_hidden') || typeof (bertaGlobalOptions) == 'undefined' || bertaGlobalOptions.skipTour) {
        return;
      }

      var steps = [];
      var engine_path = window.location.pathname.split('/');
      engine_path.pop();
      engine_path = engine_path.join('/') + '/';
      var next = null;
      var doneLabel = null;
      var query = window.location.search.replace('?', '').parseQueryString();
      var query_site = query.site ? '?site=' + query.site : '';

      if (document.querySelector('.page-xSections')) {
        steps = [{
          element: topPanelContainer.querySelector('#xSections'),
          intro: 'Add, copy, hide or delete your sections here.',
          position: 'right'
        }];
        next = engine_path + 'settings.php' + query_site;
      }
      else if (document.querySelector('.page-xSettings')) {
        steps = [{
          element: topPanelContainer.querySelector('#xSettings'),
          intro: 'Choose your template and edit general settings.',
          position: 'right'
        }];
        next = engine_path + 'settings.php?mode=template' + query_site;
      }
      else if (document.querySelector('.page-xTemplate')) {

        steps.push({
          element: topPanelContainer.querySelector('#xMySite'),
          intro: 'Site editing view. Add, drag & drop text and images',
          position: 'right'
        });

        steps.push({
          element: topPanelContainer.querySelector('#xTemplateDesign'),
          intro: 'Customize web design: font, size, colors, spacing and other. You can even add your custom CSS code.',
          position: 'right'
        });

        var xHelpDesk = topPanelContainer.querySelector('#xHelpDesk');
        if (xHelpDesk) {
          steps.push({
            element: xHelpDesk,
            intro: 'Find help here - videos, tutorials, FAQs and a discussion board.',
            position: 'left'
          });
        }

        steps.push({
          element: topPanelContainer.querySelector('#xSections'),
          intro: 'Start your website!',
          position: 'right'
        });

        doneLabel = 'Done';

      }
      else if (document.querySelector('.page-xMySite')) {
        steps = [
          {
            element: topPanelContainer,
            intro: 'Hey! This is a control panel.',
            position: 'right'
          }
        ];
        next = engine_path + 'sections.php' + query_site;
      }
      if (!steps.length) {
        return;
      }

      var tour = introJs();
      var exitButton = new Element('a', {
        'href': '#',
        'class': 'introjs-button introjs-exit'
      }).set('html', 'Exit');

      tour.setOptions({
        steps: steps,
        'doneLabel': doneLabel || 'Next',
        'nextLabel': 'Next',
        'prevLabel': 'Back',
        showBullets: false,
        showStepNumbers: false,
        exitOnOverlayClick: false
      });
      topPanelContainer.style.width = topPanelContainer.getBoundingClientRect().width + 'px';

      tour.start().onafterchange(function () {
        var skipButton = $$('.introjs-skipbutton');
        if (skipButton.length) {
          if (skipButton[0].get('text') == 'Done') {
            exitButton.hide();
            skipButton[0].setStyles({
              'display': 'inline',
              'float': 'left'
            });
          } else {
            exitButton.show();
            skipButton[0].setStyles({
              'display': 'none',
              'float': 'none'
            });
          }
        }
      }).oncomplete(function () {
        topPanelContainer.style.width = '';
        if (next) {
          window.location.href = next;
        } else {
          exitTour();
        }
      }).onexit(function () {
        topPanelContainer.style.width = '';
        exitTour();
      });

      //add exit button
      setTimeout(function () {
        var tooltipbuttons = $$('.introjs-tooltipbuttons');

        exitButton.addEvent('click', function (e) {
          e.preventDefault();
          tour.exit();
          exitTour();
        });
        exitButton.inject(tooltipbuttons[0], 'top');
      }, 200);

      var exitTour = function () {

        var data = {
          property: 'tourComplete',
          value: 1
        };

        new Request.JSON({
          url: updateUrl + query_site,
          data: JSON.stringify(data),
          urlEncoded: false,
          onComplete: function () {
            window.location.href = engine_path + 'sections.php' + query_site;
          }.bind(this),
          /* Called when on JSON conversion error:
             * Will use this as error handler for now, because server only returns non-JSON on exception */
          onError: function (responseBody) {
            console.error(responseBody);
          }
        }).post();
      };

      return tour;
    }
  };
})(window.introJs, window.bertaGlobalOptions);
