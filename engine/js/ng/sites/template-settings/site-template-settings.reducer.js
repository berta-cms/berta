(function (window) {
  'use strict';

  window.reducers = window.reducers || {};

  Object.assign(window.reducers, {
    siteTemplateSettings: function (state, action) {

      if (state === undefined) {
        state = Immutable.Map();
      }

      switch (action.type) {
        case ActionTypes.SET_STATE:
          return Immutable.fromJS(action.state.site_template_settings);


        case ActionTypes.CREATE_SITE_TEMPLATE_SETTINGS:
          return state.setIn([action.site_name], Immutable.fromJS(action.data));


        case ActionTypes.UPDATE_SITE_TEMPLATE_SETTINGS:
          var path = action.resp.path.split('/').slice(2);
          var value = action.resp.value;

          return state.setIn(
            [action.resp.site, path[0], path[1], path[2]],
            value
          );


        case ActionTypes.RENAME_SITE_TEMPLATE_SETTINGS_SITENAME:
          var section_old_name = action.data.site.get('name');

          return state.mapKeys(function (k) {
            if (k === section_old_name) {
              return action.data.site_name;
            }
            return k;
          });


        case ActionTypes.DELETE_SITE_TEMPLATE_SETTINGS:
          return state.filter(function (site_template_settings, site_name) {
            return site_name !== action.data.site_name;
          });


        default:
          return state;
      }
    }
  });
})(window);
