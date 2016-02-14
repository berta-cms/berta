(function(window, document) {
  'use strict';

  var createStoreWithMiddleware = Redux.applyMiddleware(redux_middleware)(Redux.createStore);
  var site = getCurrentSite();
  domReady(Templates.load);

  window.redux_store = createStoreWithMiddleware(root_reducer);
  redux_store.dispatch(Actions.getState(site));
})(window, document);
