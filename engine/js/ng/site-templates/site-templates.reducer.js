(function(window, document) {
  'use strict';

  window.reducers = window.reducers || {};

  Object.assign(window.reducers, {
    siteTemplates: function(state, action) {

      if (state === undefined) {
        state = Immutable.Map();
      }

      switch (action.type) {
        case ActionTypes.SET_STATE:
          console.log('Template settings reducer:', action);
          return Immutable.fromJS(action.state.siteTemplates);

        default:
          return state;
      }
    }
  });
})(window, document);
