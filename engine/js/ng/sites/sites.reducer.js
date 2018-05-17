(function(window, document) {
  'use strict';

  window.reducers = window.reducers || {};

  Object.assign(window.reducers, {
    sites: function(state, action) {
      var path, value, site, order, sites = [];

      if (state === undefined) {
        state = Immutable.Map();
      }

      switch (action.type) {

        case ActionTypes.SET_STATE:
          console.log('Sites SET_STATE reducer:', action);
          return Immutable.fromJS(action.state.sites);


        case ActionTypes.SITE_CREATED:
          console.log('Sites reducer:', action);

          return state.set(state.size, Immutable.fromJS(action.data));


        case ActionTypes.SITE_UPDATED:
          console.log('Sites reducer:', action);
          path = action.resp.path.split('/');
          order = parseInt(path[1], 10);
          value = action.resp.value;
          var prop = path.slice(2);  // example "title" or "@attributes/published"

          return state.map(function (site) {
            if (site.get('order') === order && site.getIn(prop) !== value) {
              return site.setIn(prop, value);
            }
            return site;
          });


        case ActionTypes.SITE_DELETED:
          console.log('Sites reducer:', action);

          // Filter out deleted site
          return state.filter(function (site) {
            return site.get('name') !== action.resp.name;

          // Update order
          }).map(function (site, order) {
            if (site.get('order') !== order) {
              return site.set('order', order);
            }
            return site;
          });


        case ActionTypes.SITES_ORDERED:
          return state.map(function (site) {
            var name = site.get('name');
            if (name === '') {
              name = '0';
            }
            var new_order = action.resp.indexOf(name);

            if (site.get('order') !== new_order) {
              return site.set('order', new_order);
            }
            return site;
          });


        default:
          return state;
      }
    }
  });
})(window, document);
