(function(window, document) {
  'use strict';

  window.reducers = window.reducers || {};

  Object.assign(window.reducers, {
    tags: function(state, action) {
      console.log(action);

      if (state === undefined) {
        state = Immutable.Map();
      }

      switch (action.type) {
        case ActionTypes.SET_STATE:
          return Immutable.fromJS(action.state.tags);

        default:
          return state;
      }
    }
  });
})(window, document);
