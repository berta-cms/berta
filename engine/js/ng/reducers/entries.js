(function(window, document) {
  'use strict';

  window.reducers = window.reducers || {};

  Object.assign(window.reducers, {
    entries: function(state, action) {
      console.log(action);

      if (state === undefined) {
        state = Immutable.Map();
      }

      switch (action.type) {
        case ActionTypes.SET_STATE:
          return Immutable.fromJS(action.state.entries);

        default:
          return state;
      }
    }
  });
})(window, document);
