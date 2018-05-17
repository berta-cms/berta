(function(window, document) {
  'use strict';

  window.reducers = window.reducers || {};

  Object.assign(window.reducers, {
    site_templates: function(state, action) {

      if (state === undefined) {
        state = Immutable.Map();
      }

      switch (action.type) {
        case ActionTypes.SET_STATE:
          console.log('Template settings reducer:', action);
          return Immutable.fromJS(action.state.site_templates);

        default:
          return state;
      }
    }
  });
})(window, document);
