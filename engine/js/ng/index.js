(function(window, document) {
  'use strict';

  var createStoreWithMiddleware = Redux.applyMiddleware(redux_middleware)(Redux.createStore);
  var site = getQueryParams()['site'];
  site = site === undefined ? '0' : site;

  window.redux_store = createStoreWithMiddleware(root_reducer);
  redux_store.dispatch(Actions.getState(site));
})(window, document);
