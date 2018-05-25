(function(window, document) {
  'use strict';

  window.reducers = window.reducers || {};

  Object.assign(window.reducers, {
    siteSettings: function(state, action) {

      if (state === undefined) {
        state = Immutable.Map();
      }

      switch (action.type) {
        case ActionTypes.SET_STATE:
          console.log('Site settings reducer:', action);
          return Immutable.fromJS(action.state.site_settings);


        case ActionTypes.CREATE_SITE_SETTINGS:
          return state.setIn([action.site_name], Immutable.fromJS(action.data));


        case ActionTypes.UPDATE_SITE_SETTINGS:
          console.log('Settings reducer:', action);

          var path = action.resp.path.split('/').slice(2);
          var value = action.resp.value;

          return state.setIn(
            [action.resp.site, path[0], path[1]],
            value
          );


        case ActionTypes.RENAME_SITE_SETTINGS_SITENAME:
          var section_old_name = action.data.site.get('name');

          return state.mapKeys(function (k) {
            if (k === section_old_name) {
              return action.data.site_name;
            }
            return k;
          });


        case ActionTypes.DELETE_SITE_SETTINGS:
          return state.filter(function (settings, site_name) {
            return site_name !== action.data.site_name;
          });


        default:
          return state;
      }
    }
  });
})(window, document);
