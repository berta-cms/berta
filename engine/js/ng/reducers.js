(function(window, Redux, reducers) {
  'use strict';

  window.root_reducer = Redux.combineReducers(reducers);
})(window, window.Redux, window.reducers);
