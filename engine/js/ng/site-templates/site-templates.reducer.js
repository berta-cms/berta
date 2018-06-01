(function(window, Immutable, ActionTypes) {
  'use strict';

  window.reducers = window.reducers || {};

  Object.assign(window.reducers, {
    siteTemplates: function(state, action) {

      if (state === undefined) {
        state = Immutable.Map();
      }

      switch (action.type) {
        case ActionTypes.SET_STATE:
          return Immutable.fromJS(action.state.site_templates);

        default:
          return state;
      }
    }
  });
})(window, window.Immutable, window.ActionTypes);
