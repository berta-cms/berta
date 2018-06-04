(function (window, Redux, ReduxThunk, Actions, Templates, domReady, getCurrentSite) {
  'use strict';

  domReady(Templates.load);

  var composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || Redux.compose;
  window.redux_store = Redux.createStore(
    window.root_reducer,
    {},
    composeEnhancers(
      Redux.applyMiddleware(ReduxThunk.default)
    )
  );

  var site = getCurrentSite();
  window.redux_store.dispatch(Actions.getState(site));

})(window, window.Redux, window.ReduxThunk, window.Actions, window.Templates, window.domReady, window.getCurrentSite);
