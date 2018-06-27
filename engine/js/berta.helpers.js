window.BertaHelpers = (function() {
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
    }
  };
})();
