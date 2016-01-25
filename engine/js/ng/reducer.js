(function(window, document) {
  'use strict';

  window.reducer = function(state, action) {
    state = state || Immutable.Map();

    switch (action.type) {
      case ActionTypes.GET_STATE:
        return state;
      case ActionTypes.SET_STATE:
        return Immutable.Map(action.data);
      default:
        return state;
    }
  };
})(window, document);