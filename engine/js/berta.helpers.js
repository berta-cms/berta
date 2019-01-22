window.BertaHelpers = (function () {
  var xTopPanelContainer, xBgEditorPanelTrigContainer;

  return {

    hideTopMenus: function () {
      xTopPanelContainer = xTopPanelContainer || document.querySelector('.xTopPanelContainer');
      xBgEditorPanelTrigContainer = xBgEditorPanelTrigContainer || document.querySelector('#xBgEditorPanelTrigContainer');

      if (window.parent) {
        window.parent.postMessage('menu:hide', '*');
      } else if (xTopPanelContainer) {
        xTopPanelContainer.style.display = 'none';
      }

      if (xBgEditorPanelTrigContainer) {
        xBgEditorPanelTrigContainer.style.display = 'none';
      }
    },

    showTopMenus: function () {
      xTopPanelContainer = xTopPanelContainer || document.querySelector('.xTopPanelContainer');
      xBgEditorPanelTrigContainer = xBgEditorPanelTrigContainer || document.querySelector('#xBgEditorPanelTrigContainer');

      if (window.parent) {
        window.parent.postMessage('menu:show', '*');
      } else if (xTopPanelContainer) {
        xTopPanelContainer.style.display = '';
      }

      if (xBgEditorPanelTrigContainer) {
        xBgEditorPanelTrigContainer.style.display = '';
      }
    },

    updateTopMenuSite: function (queryString) {
      var site = [queryString.replace('?', '')]
        .reduce(function (_, valueString) {
          return valueString.split('&');
        }, '')
        .filter(function (valueArrayItem) {
          return valueArrayItem.split('=')[0] == 'site';
        })
        .reduce(function (_, siteValueStr) {
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
     * Logout user by reloading the page
     */
    logoutUser: function () {
      if (window.parent === window) {
        window.location.reload();
      } else {
        window.parent.postMessage('user:logout', '*');
      }
    }
  };
})();
