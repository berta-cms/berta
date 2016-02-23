(function(window, document) {
  'use strict';

  window.reducers = window.reducers || {};

  Object.assign(window.reducers, {
    sites: function(state, action) {
      var path, value, site, site_name, site_idx, sites = [];

      if (state === undefined) {
        state = Immutable.Map();
      }

      switch (action.type) {
        case ActionTypes.SET_STATE:
          console.log('Sites reducer:', action);
          return Immutable.fromJS({site: action.state.site});

        case ActionTypes.SITE_CREATED:
          console.log('Sites reducer:', action);
          sites = state.getIn(['site']).toJSON();
          sites.push(action.site);
          return state.setIn(['site'], Immutable.fromJS(sites));

        case ActionTypes.UPDATE_SITE:
          console.log('Sites reducer:', action);
          path = action.path.split('/');
          value = action.value;

          return state.setIn(path, value);

        case ActionTypes.SITE_UPDATED:
          console.log('Sites reducer:', action);
          path = action.resp.path.split('/');
          value = action.resp.value;

          return state.setIn(path, value);

        case ActionTypes.SITE_DELETED:
          sites = state.getIn(['site']).toJSON();
          site_name = action.resp.name === '0' ? '' : action.resp.name;
          site_idx = sites.findIndex(function (site, idx) {
            return site.name === site_name;
          });

          if (site_idx > -1) {
            console.log('Sites reducer:', action);
            sites.splice(site_idx, 1);
            return state.setIn(['site'], Immutable.fromJS(sites));
          }

          return state;

        case ActionTypes.ORDER_SITES:
          action.sites.forEach(function(site, new_idx) {
            var site_name = site === '0' ? '' : site;

            site = state.getIn(['site']).toJSON().find(function(site, old_idx) {
              return site.name === site_name;
            });

            if (site) {
              sites.push(site);
            }
          });

          if (sites.length > 0) {
            console.log('Sites reducer:', action);
            return state.setIn(['site'], Immutable.fromJS(sites));
          }

          return state;

        default:
          return state;
      }
    }
  });
})(window, document);
