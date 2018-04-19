(function(window, document) {
  'use strict';

  window.reducers = window.reducers || {};

  Object.assign(window.reducers, {
    site_settings: function(state, action) {

      if (state === undefined) {
        state = Immutable.Map();
      }

      switch (action.type) {
        case ActionTypes.SET_STATE:
          console.log('Site settings reducer:', action);
          return Immutable.fromJS(action.state.site_settings);

        case ActionTypes.SETTINGS_UPDATED:
          console.log('Settings reducer:', action);

          var path = action.resp.path.split('/').slice(2);
          var value = action.resp.value;

          return state.setIn(
            [action.resp.site, path[0], path[1]],
            value
          );

        case ActionTypes.SITE_SETTINGS_DELETED:
          return state.filter(function (settings, site_name) {
            return site_name !== action.data.site_name;
          });

        default:
          return state;
      }
    }
  });
})(window, document);
