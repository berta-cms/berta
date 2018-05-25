(function (window, document) {
  'use strict';

  domReady(Templates.load);

  var composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || Redux.compose;
  window.redux_store = Redux.createStore(
    root_reducer,
    {},
    composeEnhancers(
      Redux.applyMiddleware(ReduxThunk.default)
    )
  );

  var site = getCurrentSite();
  redux_store.dispatch(Actions.getState(site));

})(window, document);
