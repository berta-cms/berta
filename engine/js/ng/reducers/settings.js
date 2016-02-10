(function(window, document) {
  'use strict';

  window.reducers = window.reducers || {};

  Object.assign(window.reducers, {
    settings: function(state, action) {

      if (state === undefined) {
        state = Immutable.Map();
      }

      switch (action.type) {
        case ActionTypes.SET_STATE:
          console.log(action);
          return Immutable.fromJS(action.state.settings);

        default:
          return state;
      }
    }
  });
})(window, document);
