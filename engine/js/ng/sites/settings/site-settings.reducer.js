(function(window, Immutable, ActionTypes) {
  'use strict';

  window.reducers = window.reducers || {};

  Object.assign(window.reducers, {
    siteSettings: function(state, action) {

      if (state === undefined) {
        state = Immutable.Map();
      }

      switch (action.type) {
        case ActionTypes.SET_STATE:
          return Immutable.fromJS(action.state.site_settings);


        case ActionTypes.UPDATE_SITE_SETTINGS:
          var path = action.resp.path.split('/').slice(2);
          var value = action.resp.value;

          return state.setIn(
            [action.resp.site, path[0], path[1]],
            value
          );


        default:
          return state;
      }
    }
  });
})(window, window.Immutable, window.ActionTypes);
